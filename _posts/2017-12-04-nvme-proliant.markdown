---
title: "Using am NVMe to PCIe adapter in an HP Proliant DL360e G8"
layout: post
date: 2017-12-04
image: /assets/images/2017-12-01-nvme-proliant/ricky-bobby.png
headerImage: true
tag:
- blog
- ssd
- nvme
- openstack
- proliant
- dl360e
- ubuntu
- openstack-ansible
blog: true
author: jamesdenton
description: Using am NVMe to PCIe adapter in an HP Proliant DL360e G8
---

Like many homelabbers, my home lab consists of machines and equipment that was procured from eBay or the dark alleys of Craigslist. In its heyday, my gear wasn't breaking performance records, but it's still useful as an all-purpose virtualization and sometimes-baremetal platform, and that's exactly what I was looking for.

Today I'm working with two of the following machines:

```
HP Proliant DL360e G8 - 4x LFF Slots
2x 2TB Hitachi 7200rpm SATA Drives
96GB RAM
```

These SATA drives aren't known for their speed. Many moons ago I picked up some 256GB Samsung PM951 M.2 NVMe SSDs for use with some HP Z240s that predated the purchase of the Proliants. Since then, I changed directions with the lab and the drives have gone unused since. The DL360e G8s have no built-in NVMe slots, so PCIe adapters are really the only way to go. So, off to Amazon I went and picked up two of the following:

```
Mailiya M.2 PCIe to PCIe 3.0 x4 Adapter
```

This sweet little card from Amazon came with a full and short-profile slot bracket and standoffs. What more could you ask for? I popped my SSD in, put the card in the server, and got to work.

I use Ubuntu MAAS to manage my lab, and MAAS makes it super-simple to modify the storage configuration prior to imaging a host. I configured the NVMe card to use LVM with the full `/` partition, configured my BIOS to boot from the PCIe storage controller before the built-in controller, PXE booted to MAAS, and got to work.

MAAS was able to kick the server just fine, but upon reboot I was greeted with the following message:

```
Attempting Boot from Hard Drive (C:)
```

Lovely. 

What I didn't realize, but should have known, is that the Proliant G8s do not support booting from NVMe PCIe storage controllers, and probably don't support booting from third-party controllers at all. 

I'm no sysadmin, but thinking about it a little more, I realized that I was really only interested in speeding up general disk I/O, including, but not limited to, OpenStack installs using openstack-ansible as well as virtual-machine disk performance. Could I put the `/boot` partition on the SATA drive, and leave the `/` partition on NVMe?

![<img>](/assets/images/2017-12-01-nvme-proliant/fs.png)

The `/boot/` partition was formatted as FAT32 on the SATA disk, the `/` partition takes up the entire NVMe SSD, and just for grins, I leveraged the SATA disk for a few logical volumes I knew didn't need high-performance. After kicking the server, it came right up on reboot. A glimpse at `df` shows the breakdown:

```
jdenton@hp01:~$ df -h
Filesystem           Size  Used Avail Use% Mounted on
udev                  48G     0   48G   0% /dev
tmpfs                9.5G  9.3M  9.5G   1% /run
/dev/nvme0n1p1       235G  9.5G  214G   5% /
tmpfs                 48G     0   48G   0% /dev/shm
tmpfs                5.0M     0  5.0M   0% /run/lock
tmpfs                 48G     0   48G   0% /sys/fs/cgroup
/dev/sda1            951M   59M  892M   7% /boot
/dev/mapper/vg0-lv0  917G   72M  870G   1% /home
/dev/mapper/vg0-lv1   92G   61M   87G   1% /var/log
tmpfs                9.5G     0  9.5G   0% /run/user/1000
```

## Benchmarking

I'm not great with storage benchmarking, but thought it important that I verify the performance of the SSD versus the SATA disk. I can't recall which slot this card is in, and I don't have any other SSD performance data to compare to, but here we go.

### dd - Write Performance

##### SATA
```
root@hp01:/home/jdenton# sync; dd if=/dev/zero of=/var/log/tempfile bs=1M count=4096; sync
4096+0 records in
4096+0 records out
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 42.1565 s, 102 MB/s
```

##### SSD
```
root@hp01:/home/jdenton# sync; dd if=/dev/zero of=/tmp/tempfile bs=1M count=4096; sync
4096+0 records in
4096+0 records out
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 3.53607 s, 1.2 GB/s
```

### dd - Read Performance

##### SATA
```
root@hp01:/home/jdenton# dd if=/var/log/tempfile of=/dev/null bs=1M count=4096
4096+0 records in
4096+0 records out
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 35.3813 s, 121 MB/s
```

##### SSD
```
root@hp01:/home/jdenton# dd if=/tmp/tempfile of=/dev/null bs=1M count=4096
4096+0 records in
4096+0 records out
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 2.67133 s, 1.6 GB/s
```
### hdparm

#### SATA
```
root@hp01:~/ioping# hdparm -Tt /dev/sda

/dev/sda:
 Timing cached reads:   13726 MB in  2.00 seconds = 6869.01 MB/sec
 Timing buffered disk reads: 364 MB in  3.00 seconds = 121.20 MB/sec
```

#### SSD
```
root@hp01:~/ioping# hdparm -Tt /dev/nvme0n1

/dev/nvme0n1:
 Timing cached reads:   13916 MB in  2.00 seconds = 6965.54 MB/sec
 Timing buffered disk reads: 4580 MB in  3.00 seconds = 1526.48 MB/sec
```

### ioping

##### SATA
```
root@hp01:~/ioping# ioping -R /dev/sda

--- /dev/sda (block device 1.82 TiB) ioping statistics ---
220 requests completed in 3.01 s, 73 iops, 292.9 KiB/s
min/avg/max/mdev = 3.89 ms / 13.7 ms / 21.9 ms / 3.88 ms
root@hp01:~/ioping# ioping -RL /dev/sda

--- /dev/sda (block device 1.82 TiB) ioping statistics ---
1.42 k requests completed in 3.00 s, 479 iops, 119.9 MiB/s
min/avg/max/mdev = 1.16 ms / 2.08 ms / 26.8 ms / 901 us
```

##### SSD
```
root@hp01:~/ioping# ioping -R /dev/nvme0n1

--- /dev/nvme0n1 (block device 238.5 GiB) ioping statistics ---
101.1 k requests completed in 3.00 s, 37.6 k iops, 146.7 MiB/s
min/avg/max/mdev = 19 us / 26 us / 5.68 ms / 22 us
root@hp01:~/ioping# ioping -RL /dev/nvme0n1

--- /dev/nvme0n1 (block device 238.5 GiB) ioping statistics ---
9.18 k requests completed in 3.00 s, 3.19 k iops, 797.5 MiB/s
min/avg/max/mdev = 277 us / 313 us / 6.74 ms / 83 us
```

## Summary

Overall, I'm pleased with the way this turned out, and hope that others wanting to leverage NVMe->PCIe adapters in an older Proliant will remember to turn to those slower SATA disks before giving up. The speed increase alone is worth the $15 I paid for each adapter, and nothing feels better than putting dormant hardware to use.

