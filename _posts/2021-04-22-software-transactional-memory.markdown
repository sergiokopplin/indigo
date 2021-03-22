---
title: "Software Transactional Memory: a stairway to lock-free programming heaven?"
layout: post
date: 2020-04-22 12:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- stm
- locks
- parallelism
- concurrency
- gil
- haskell
- python
- clojure
category: blog
author: talhoffman
description: When it comes to synchronization of shared state and intermediacy, developer-controlled locking has always been a double-edged sword. Although effective, it's been proven to be deadly when done wrong. Deadlocks, livelocks, and a lack of composability are all way too common, and frankly - hard to avoid - especially when dealing with large, complex applications.
---


## Software Transactional Memory: a stairway to lock-free programming heaven?

When it comes to synchronization of shared state and intermediacy, developer-controlled locking has always been a double-edged sword. Although effective, it's been proven to be deadly when done wrong.  

Deadlocks, livelocks, and [a lack of composability](https://medium.com/r/?url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FLock_%28computer_science%29%23Lack_of_composability) are all way too common, and frankly - hard to avoid - especially when dealing with large, complex applications.

### Enter Software Transactional Memory.

One alternative approach to this pain in the arse problem is moving the locking part inside the runtime, basically freeing the developer from locking decision concerns. It works such that each critical section access is done using an "atomic transaction".  

Before we proceed any further, one has to understand the difference between "lock-less programming" and "lock-less programs" in regard to this blog post. STM is meant to be a solution to the first one by taking care of locking for us, the developers, hence "lock-less programming". This means no deadlocks, less livelocks, and much better composability.  

We'll also be using a specific STM algorithm which is lock-free, in the sense of not using traditional locking primitives, but rather bounded spinlocks which if already acquired - do not block. Therefore, we're also considered a "lock-less program".  

Now let's proceed…  

STM was first introduced by [Shavit and Touitou](https://medium.com/r/?url=https%3A%2F%2Fgroups.csail.mit.edu%2Ftds%2Fpapers%2FShavit%2FShavitTouitou-podc95.pdf) back in 1995. It was an exciting improvement of an earlier concept called Hardware Transactional Memory, in which hardware support was used to achieve the same goal, only now it could be done at software level - either entirely or as an hybrid software-hardware solution.  

It works by isolating a set of reads and writes to shared memory locations in a construct called "a transaction". The runtime executes the user code as if it were to run alone, with no other threads interfering. It attempts to commit all of the transaction's writes into memory, and aborts execution if it notices a conflict with other threads. The runtime would keep retrying to run the transaction, until it is able to successfully commit all shared memory modifications.  

However, as previously stated, it is important to understand that STM by itself doesn't necessarily mean lock-free concurrency. Some implementations are indeed lock-free, while some are not. Software Transactional Memory is merely an abstraction which frees the developer from typical locking concerns.

![](https://www.researchgate.net/profile/Hans-Kestler/publication/43049227/figure/fig2/AS:267575359701012@1440806345935/Software-transactional-memory-Software-transactional-memory-circumvents-the-need-for.png)
*Credit: [https://researchgate.net](https://www.researchgate.net/figure/Software-transactional-memory-Software-transactional-memory-circumvents-the-need-for_fig2_43049227)*

Sounds familiar?

Many of you might have already heard of this modus operandi. A similar form of this concurrency control is used in databases and version control systems. It is known as [optimistic concurrency](https://medium.com/r/?url=https%3A%2F%2Fen.m.wikipedia.org%2Fwiki%2FOptimistic_concurrency_control).

![](https://media.giphy.com/media/N1OBW2fPuXh91zXlPh/giphy.gif)


### Transactional Locking II (with a slight touch)

There are several approaches and algorithms for implementing STM, one of them being "Transactional Locking II (TL2)" proposed by Dive, Shalev, and Shavit, on which we'll focus here.  

The algorithm is pretty straightforward, and can be split into three parts: reading a variable, writing to a variable, and committing the transaction.   

The secret to it all is "versioning". Basically, each time a value is read or a commit needs to go through, the runtime makes sure that versions are up-to-date and that there is no other thread in the middle of messing up with that memory location at the time of inspection. Otherwise, it starts over until each transaction is looking at a consistent view of things.  

It is, in a sense, a form of double-checked locking integrated into the runtime, if you wish.  

This works by maintaining a global version "clock" and wrapping each globally shareable variable with its own (shared) version and its own lock. Lets call it a "versioned lock" from now on.  

That versioned lock is a 64-bit word (`uint64`), for that matter, where the first bit is the lock and the other 63 bits hold the version. Kind of like `seqlocks` which are being used in the Linux Kernel:

```golang
// VersionedLock consists of a lock bit and a version number.
// Note that this lock doesn't enforce ownership!
type VersionedLock uint64

// Tries to acquire lock.
// Non-blocking.
func (vl *VersionedLock) TryAcquire() error {
   currentlyLocked, currentVersion, currentLock := vl.Sample()
   if currentlyLocked {
      return ErrAlreadyLocked
   }

   // Lock = true; Version = current
   return vl.tryCompareAndSwap(true, currentVersion, currentLock)
}

// Releases lock.
func (vl *VersionedLock) Release() error {
   currentlyLocked, currentVersion, currentLock := vl.Sample()
   if !currentlyLocked {
      return ErrAlreadyReleased
   }

   // Lock = false; Version = current
   return vl.tryCompareAndSwap(false, currentVersion, currentLock)
}

// Atomically updates lock version and releases it.
func (vl *VersionedLock) VersionedRelease(newVersion uint64) error {
   currentlyLocked, _, currentLock := vl.Sample()
   if !currentlyLocked {
      return ErrAlreadyReleased
   }

   // Lock = false; Version = new
   return vl.tryCompareAndSwap(false, newVersion, currentLock)
}

// Retrieves lock state - whether it is locked, its version, and its raw form.
func (vl *VersionedLock) Sample() (bool, uint64, uint64) {
   current := atomic.LoadUint64((*uint64)(vl))
   locked, version := vl.parse(current)
   return locked, version, current
}

func (vl *VersionedLock) tryCompareAndSwap(doLock bool, desiredVersion uint64, compareTo uint64) error {
   newLock, err := vl.serialize(doLock, desiredVersion)
   if err != nil {
      return errors.WithMessage(err, "try compare and swap")
   }

   if swapped := atomic.CompareAndSwapUint64((*uint64)(vl), compareTo, newLock); !swapped {
      return ErrLockModified
   }
   return nil
}

func (vl *VersionedLock) serialize(locked bool, version uint64) (uint64, error) {
   if (version >> versionOffset) == 1 { // Version mustn't override our lock bit.
      return 0, ErrVersionOverflow
   }

   if locked {
      return (1 << versionOffset) | version, nil
   }
   return version, nil
}

func (vl *VersionedLock) parse(serialized uint64) (bool, uint64) {
   version := (1<<versionOffset - 1) & serialized
   lockedBit := serialized >> versionOffset
   return lockedBit == 1, version
}
```

#### Reads

Prior to each read we make sure of 3 things:
1. That no other thread is currently trying to modify that memory location (lock bit should be off)
1. That the shared version of that memory location is older or equals the global version, meaning we hold an up-to-date version of it
1. That the relevant memory location wasn't modified beneath our feet in case a context switch occurred before our read operation (i.e, variable version pre-read == variable version post-read)

If this read-set validation fails - the transaction will abort.

```golang
type StmContext struct {
   readLog      map[*StmVariable]interface{}
   writeLog     map[*StmVariable]interface{}
   restart      bool
   readVersion  uint64
   writeVersion uint64
}

// ...

func (sc *StmContext) Read(stmVariable *StmVariable) interface{} {
   if newVal, foundInWriteLog := sc.writeLog[stmVariable]; foundInWriteLog { // Short road to success...
      return newVal
   }

   _, preReadVersion, _ := stmVariable.lock.Sample()
   readVal := stmVariable.val.Load()
   locked, postReadVersion, _ := stmVariable.lock.Sample()

   // Fail transaction if:
   // 1. Variable is currently being changed by some other goroutine; or if
   // 2. Variable was changed before/after being read; or if
   // 3. Variable is too new meaning our read version is outdated
   sc.restart = locked || preReadVersion != postReadVersion || preReadVersion > sc.readVersion

   return readVal
}
```

#### Writes

When it comes to writing to shared locations, each update is cached in-memory, waiting for the transaction to end so it can be committed.

```golang
func (sc *StmContext) Write(stmVariable *StmVariable, newVal interface{}) {
   sc.writeLog[stmVariable] = newVal
}
```

#### Commits

We will implement a slightly modified version of TL2 in terms of committing transactions.

When a user code is done executing and commit time is due, we try to "lock" each write log variable **and each read set variable\***.

The next step is to atomically increment-and-fetch the global clock and making it be our transaction's write version. This would become the official version of each write-log variable in case everything goes well and our transactions commits successfully.

Next up we need to once again validate our read-set, making sure nothing had changed between us executing the user's code and our attempt to commit the transaction. If validation fails - you know the drill - the transaction restarts. A slight optimization here is to avoid running this validation if we are the only transaction (that is, the transaction's read version + 1 == transaction's write version that we've just set).

Otherwise, modifications are committed one-by-one in an atomic manner (say compare-and-swap?) and seqlocks are released.

This entire process repeats itself until the transaction finally looks at a consistent memory layout and is able to commit itself successfully.  

* Please note that the original TL2 specification doesn't mention anything about locking the read-set. This left me thinking: what would happen if a context switch occurs right after the commit-phase's read-set validation, but before actually updating the write-set memory? In that case, a second thread might modify variables which were already validated by the first one, causing it to have a false sense of memory consistency.  

Nonetheless, despite me [trying to desperately get good explanations](https://medium.com/r/?url=https%3A%2F%2Fwww.reddit.com%2Fr%2Fhaskell%2Fcomments%2Fleva71%2Fhelp_understanding_software_transactional_memory%2F) as to why this isn't really an issue  -  I could not find any. None of the official papers seemed to address this concern either.  

Therefore, I decided to go what I believe is the safer way (until being proven otherwise) and lock the read-set as well, taking into account additional performance costs.

```golang
func StmAtomic(block func(*StmContext) interface{}) interface{} {
   for {
      ctx := &StmContext{
         readLog:      make(map[*StmVariable]interface{}, 0),
         writeLog:     make(map[*StmVariable]interface{}, 0),
         restart:      false,
         readVersion:  versionClock.Load(),
         writeVersion: 0,
      }

      retVal := block(ctx)
      if ctx.restart {
         continue
      }

      // "And she's buying a stairway to heaven..."
      if len(ctx.writeLog) == 0 {
         return retVal
      }

      lockSet := make(map[*StmVariable]int, 0)
      if err := tryAcquireSets(ctx, lockSet); err != nil {
         if fatal := isFatalAcquireErr(err); fatal { // Avoid a panic if lock is already acquired.
            panic(fatal)
         }
         continue
      }

      ctx.writeVersion = versionClock.Increment()

      // Now that our read and write sets are locked, we need to ensure that nothing has changed in terms of our
      // read set, in-between running the user's code and locking everything.
      // However, if no other concurrent actors were involved (readVersion == writeVersion - 1), there is no need to
      // validate anything cause we were all alone.
      if ctx.readVersion != ctx.writeVersion-1 {
         if validated := validateReadSet(ctx, lockSet); !validated {
            continue
         }
      }

      commitTransaction(ctx, lockSet)

      return retVal
   }
}
```

**The entire repository code can be found here - https://github.com/talhof8/kashmir.**


### Caveats

No rose without a thorn, though. STM indeed has some very noticeable downsides and thus was considered a research toy for a long time. First off, STM rises the inevitable question of what do you do about non-idempotent operations. That is, I/O, network, print statements, etc…? Such operations cannot be simply undone when a memory conflict is detected. The default answer to this question is as simple (and perhaps conveniently looks the other way) as just to avoid putting side-effect causing operations inside STM atomic blocks. Another approach is to queue all side-effects causing operations inside a buffer and running them only on successful commits, outside the transaction.  

Another potential issue - which is more  implementation-dependent than an overall STM issue - is livelocks. Obviously threads could still conflict, causing them to keep retrying the transaction thus none progressing. It could be avoided by using some backoff mechanism (be it a random backoff, exponential one, etc…) in-between transaction attempts. This will obviously cause a performance hit, raising the question of how important is performance in this regard?   

In addition, a major concern is what to do about languages which do not have garbage collection. Unless given official implementation-level support, some STM algorithms would conceptually allow threads to free  heap-allocated variables while other threads are de-referencing them - causing segmentation faults. Have a look here for a deeper explanation.

Over and above that, in our implementation we use a form of spin-locking, meaning that long-running commit attempts might blow up CPU usage (unless preempted by the runtime/OS). This means that performance-wise our STM implementation is most performant in scenarios where transactions succeed on first attempt. Overall STM introduces quite a good performance (also depending on the implementation), albeit slightly less good than classic fine-grained locking.  

Moreover, long-running programs could obviously make the global version clock overflow. This case can quite easily be resolved by the runtime, by making it reset to zero, for example, and syncing all relevant transactions to use the new, reset version clock, at a slight performance cost, when such cases occur. 


### Applications

Those of you who are familiar with the likes of CPython and Ruby MRI have probably heard of the infamous GIL. It is basically a mutex which prevents some interpreters from running threads in parallel, though still concurrently, in order to support specific memory management methods and for calling unsafe native extensions safely. Attempts have been made to get rid of Global Interpreter Lock (GILs) using our dear friend - Transactional Memory. For instance, a fork of pypy called pypy-stm has been created - [https://doc.pypy.org/en/latest/stm.html](https://doc.pypy.org/en/latest/stm.html) - but seemed to be abandoned and is no longer maintained.  

In addition, several languages such as Clojure and Haskell support Software Transactional Memory out-of-the-box as part of the core language/runtime, offering an alternative approach to both standard locking and actor model concurrency. There's also an official proposal and implementation by core Ruby committer Koichi Sasada to add STM to Ruby's parallelism feature named "Ractors" - [https://bugs.ruby-lang.org/issues/17261](https://bugs.ruby-lang.org/issues/17261).

Although STM officially being an integral part of both Clojure and Haskell, overall adoption of STM has been lacking to say the least. Attempts to get rid of the GIL by using STM has not come into fruition yet, as well.  

> If you'd like to read some reflections on that topic, please take a look at [https://dl.acm.org/doi/abs/10.1145/3359619.3359747](https://dl.acm.org/doi/abs/10.1145/3359619.3359747).

**STM is often compared to Garbage Collection**. Both operate on memory in runtime. Whilst the first manages the state of memory, the latest manages references to memory. Please do keep in mind that garbage collection used to be doubted and back-slashed a lot when first introduced to the world, and has suffered significant performance costs. It has been vastly improved over the years, to say the least, and has become a major, integral part of many programming languages. The community's hope in regard to this matter is put our knowledge of garbage collection and how we have improved it, to use with transactional memory - making it much more mature, performant, and production-ready.