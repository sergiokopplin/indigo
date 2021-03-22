---
title: "Introduction to CRIU and Live migration"
layout: post
date: 2020-10-07 22:38
image: /assets/images/markdown.jpg
headerImage: false
tag:
- criu
- linux internals
- live migration
- ptrace
- linux kernel
category: blog
author: talhoffman
description: An introduction to CRIU and Live migration
---


## Introduction to CRIU and Live Migration

<br> In this blog post I will try and explain what CRIU is and how it works,
what Live Migration is, and how those two are related.

### **So what the heck is CRIU?**

**Checkpoint-Restore in Userspace** (or **CRIU**) is a really (really) cool
open-source project started by virtualization software company — 
[Virtuozoo](https://www.virtuozzo.com/) — also known for being the creator of
[OpenVZ](https://openvz.org/).

What CRIU does is letting you freeze running Linux processes and checkpoint
their state to the disk as a collection of files. Those files can later be used
to restore a process right from the point it’d been freezed, multiple times, on
any other CRIU-supported Linux machine!

![](https://media.giphy.com/media/35H0pwQNaO2iLTnnBf/giphy.gif)

Among its many usage scenarios, CRIU can be used for slow-boot service speed up,
remote debugging, snapshots, process duplication, and for what is our main topic
today — **live migrations.**

> Take a look at
> [https://criu.org/Usage_scenarios](https://criu.org/Usage_scenarios) for more

CRIU is now integrated as part of Podman, Docker (experimental), OpenVZ,
LXC/LXD, and can also be used independently.

### The mechanics (in a nutshell)

Let’s take a little dive into the internals of how this magic happens.

**Checkpoint**

The first step when checkpointing a process is walking recursively
through its tree, and freezing it so it will not change its state while CRIU
needs to dump it. 

CRIU supports two different methods for freezing the state of the process and
its sub tasks.

By default, CRIU makes use of `ptrace` to stop the process. For those not
familiar with `ptrace`:

    The ptrace() system call provides a means by which one process (the "tracer") may observe and control the execution of another process (the "tracee"), and examine and change the tracee's memory and registers. It is primarily used to implement breakpoint debugging and system call tracing.

    See https://man7.org/linux/man-pages/man2/ptrace.2.html.

In this method, CRIU first lists and goes through the relevant `/proc/$pid`
entries. Thread ids are collected through `/proc/$pid/task`, whereas
sub-processes are recursively collected through reading
`/proc/$pid/task/$tid/children` files. 

Each task it encounters — parent process itself, sub-processes, and threads  — 
is being attached to CRIU’s tracer process by dispatching a  `PTRACE_SEIZE`
request, after which a `PTRACE_INTERRUPT` request is also dispatched in order to
stop that task.

The second method for freezing the process tree is using Linux’s **Cgroup
Freezer** — available through CRIU’s `--freeze-cgroup` flag. Cgroup Freezer is a
subsystem supported by the Linux Kernel which lets us start and stop a set of
tasks (i.e, processes and threads), by defining a control group. 

Here is a simple example of usage:

    # Create a cgroup freezer directory
    mkdir /sys/fs/cgroup/freezer

    # Mount directory against a cgroup filesystem of type 'freezer'  
    mount -t cgroup -ofreezer freezer /sys/fs/cgroup/freezer

    # Create a child cgroup directory
    mkdir /sys/fs/cgroup/freezer/whatever

    # Put a task into this cgroup
    echo $some_pid > /sys/fs/cgroup/freezer/whatever/tasks

    # Freeze cgroup
    echo FROZEN > /sys/fs/cgroup/freezer/whatever/freezer.state

    # cat /sys/fs/cgroup/freezer/whatever/freezer.state
    FREEZING

    # cat /sys/fs/cgroup/freezer/whatever/freezer.state
    FROZEN

    # Thaw (unfreeze) it
    echo THAWED > /sys/fs/cgroup/freezer/whatever/freezer.state

> Read more at
> [https://man7.org/linux/man-pages/man7/cgroups.7.html](https://man7.org/linux/man-pages/man7/cgroups.7.html)
and
[https://www.kernel.org/doc/Documentation/cgroup-v1/freezer-subsystem.txt](https://www.kernel.org/doc/Documentation/cgroup-v1/freezer-subsystem.txt).

Now that the process’s tasks tree is all frozen, CRIU needs to collect all
relevant tasks’ resources and write them to dump files, which should later be
used for restore.

The first set of resources being dumped are collected simply by reading  procfs.
These resources are VMAs (Virtual Memory Areas), memory-mapped files, and opened
file descriptors. In addition, registers and other core task parameters are
collected using `ptrace` and parsing `/proc/$pid/stat`. 

Afterwards, CRIU injects a parasite code into each task’s address space whose
job is to collect some more information such as credentials and actual memory
contents. 

> More information about how the parasite code injection is done can be found
> [here](https://criu.org/Parasite_code).

The final step in the checkpointing process is cleaning up CRIU’s parasite code,
restoring original code, detaching ptrace, and then resuming tasks from where
they’ve been stopped (actually this is optional and can be turned-off by
specifying `-R|--leave-running`).

**Restore**

The restore process is pretty straightforward. During restore CRIU gradually
morphs itself into the target process. 

First off, the restorer process reads all dumped image files and finds out which
processes share which resources. Next, it re-creates all processes in the tree
by calling `fork()`. Note that threads are **not** restored here but rather on
the last stage. 

**The PID Dance**

Each forked process is supposed to be assigned with its original pid. But how
exactly?

Well, in order to do so, CRIU utilizes a feature introduced in Kernel v3.3 used
by the kernel for keeping track of the last pid it has assigned. 

It is accessible through the sysctl file `/proc/sys/kernel/ns_last_pid `and is
basically an incrementing counter of process ids. It requires
`CONFIG_CHECKPOINT_RESTORE`  to be set and it is enabled by default in most of
Linux distributions.

So in order to fork a process with a desired pid, say 3214, CRIU does the
following:

    1. Opens /proc/sys/kernel/ns_last_pid
    2. Locks file
    3. Sets ns_last_pid's new value to pid-1 (3214 - 1)
    4. Closes /proc/sys/kernel/ns_last_pid
    5. Clones process so that the child process is supposed to have pid 3124
    6. Calls getpid() inside the child process to validate desired pid
    7. Unlocks file
    8. Voilà

Very simple and yet cool!

> Bear in mind that if any pid already exists when trying to restore, then the
> restore will fail. The solution is to  restore the process inside a different
pid namespace (and mount namespace — see
[https://criu.org/CR_in_namespace](https://criu.org/CR_in_namespace)). 

There are a few caveats to this approach, the main ones being it too slow due to
multiple syscalls required for each such clone, and that it is open to race
conditions.

As explained in
[https://lisas.de/~adrian/criu-and-the-pid-dance-article.pdf](https://lisas.de/~adrian/criu-and-the-pid-dance-article.pdf):

    It can always happen that between setting the desired PID via ns_last_pid and the actual clone() another process, independent of the restore, is created, which means that getpid() will not return the desired PID and CRIU will abort.

Enter `clone3()` and `set_tid`.

Using Kernel v5.3’s `clone3()` (note there’s no matching glibc wrapper yet), and
`set_tid` array available from v5.5, we can now explicitly select specific
process ids for a cloned process, in some or all of the PID namespaces where it
is present, directly when we call `clone3()`. This essentially eliminates the
race conditions and saves us from multiple syscalls requirement of the
ns_last_pid method. **It** **is currently supported by CRIU**.

*****

Now that all of the required processes were created, CRIU will carry on and
restore resources such as opening file descriptors, preparing namespaces,
opening anonymous shared mappings, opening file mappings, opening & pre-mapping
private memory areas, opening sockets, and more…

For the final step, CRIU will switch to the restorer context — cleaning up its
own memory mappings — and restore all  other resources left: threads, timers (so
they will fire as late as possible), credentials & security settings (so they
won’t limit us during the restore process), private memory areas re-mappings
(using `mremap`), file mappings (using `mmap`), and anonymous shared mappings
(also using `mmap`).

From now on, the process is restored and will continue to run from where it was
originally checkpointed.

![](https://media.giphy.com/media/yoJC2COHSxjIqadyZW/giphy.gif)

**If you’d like to dive even deeper inside the internals, have a look at
[https://criu.org/Category:Under_the_hood](https://criu.org/Category:Under_the_hood)
:)**

### Live Migration

Live migration is the process of moving a running Virtual Machine or Application
between two different nodes while keeping clients connected. Memory, relevant
storage and network connectivity should all be transfered. 

CRIU is a perfect match for these kind of tasks, and is actually used in
production by some big companies. For instance, Google uses CRIU for [live
migrating containers inside its Borg
clusters](https://www.slideshare.net/mobile/RohitJnagal/task-migration-using-criu).

Lets use CRIU ourselves to demonstrate the migration of a simple loop script
from our local machine to a virtual machine.

![](/assets/images/criu-demo.gif)

Our script looks like this (`test.sh`):

    #!/bin/sh
    while :; do
        sleep 1
        date
    done

In order to checkpoint the script’s process we run:

    sudo criu dump -t <pid> --images-dir ~/demo/images --shell-job && echo OK

* `--images-dir` indicates where to dump the image files
* `--shell-job` tells CRIU that our process was spawned from a shell

We then `scp` (i.e, transfer) both the script (so CRIU is able to restore its fd) and the
dumped images to our VM, and finally restore the process using:

     sudo criu restore -D <path-to-images-dir> -vvv --shell-job -d

* `-vvv` for higher verbosity
* `--shell-job` again to let CRIU known it was spawned from a shell
* `-d` so that the restored process will run in background

And that’s it!

> Some more cool CRIU tutorials can be found
> [here](https://www.youtube.com/watch?v=roJ91Kqeq5w&list=PL86FC0XuGZPISge_th8F5Jjj-IbGXEfE6&index=1).
