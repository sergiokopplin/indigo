---
title: "This Old Lisa: A Look at the X/ProFile Storage Adapter"
layout: post
date: 2017-02-02
image: /assets/images/2018-01-27-lisa-xprofile/lisa2.png
headerImage: true
tag:
- blog
- apple
- lisa
- vintage
- storage
blog: true
author: jamesdenton
description: A look at the X/ProFile storage adapter for the vintage Apple Lisa

---

If you're an Apple Lisa owner, there's a good chance you're playing with fire every time you turn the machine on. No, because of the infamous battery leakage issues, but rather, due to the nature of aging magnetic media and obsolete drive motors and mechanisms.

In this episode of This Old Lisa, I'll be taking a look at the X/ProFile compact flash-based storage system for the Apple Lisa series of machines, a replacement for vintage Apple ProFile and Widget hard drives that power Lisa systems. 
<!--more-->

# A little background

I've been an admirer of the Apple Lisa for over twenty-five years, and recently had an opportunity to add one to my collection of vintage Apple hardware. Growing up, I only knew of the Lisa from old Sun Remarketing catalogs that would show up in the mail every now and then. I'd peruse the pages of not-so-current generation systems, and make a shopping list that would take almost twenty years to fulfill. 

The vintage computing scene has exploded in recent years, and new developments in hardware have given new life to old beasts like the original Macintosh, Amigas, Apple IIs, and even the Lisa.

The [X/ProFile](http://sigmasevensystems.com/xprofile.html) is a storage system developed by [Seven Sigma Systems](http://sigmasevensystems.com/), a reknowned expert in all things Lisa. Seven Sigma Systems has been in the Lisa space since the 1980's, back when these machines were viable alternatives to Apple's then-current stable of Macintosh systems. The Apple Lisa's unique hardware allowed it to run software known as MacWorks that provided an environment that looked and felt like a Macintosh, so that various Macintosh operating systems and application could be used. The Lisa provided a larger screen, RAM, and storage than what was available with Macintoshes at the time, which meant that third-party addons were welcomed to help extended the life of these machines. Apple even remarketed the Lisa as the Macintosh XL, and made hardware changes to make it more 'Mac-like' and closed the door on the Lisa forever.

Fast-forward to the mid 2000's, and you'd find Seven Sigma Systems still hard at work developing useful technology for the Apple Lisa. The X/ProFile is more-or-less a drop-in replacement for Apple's aging parallel-based ProFile and Widget hard drives. The X/Profile supports IDE drives and compact flash cards, and adapts those storage mediums to a parallel interface that can be leveraged by the Apple Lisa and Macintosh XL.

# What's old is new

The X/ProFile kit from [VintageMicros](http://www.vintagemicros.com) comes with the X/Profile hardware, two compact flash cards, a SUN20 parallel port cable, a replacement video rom module, and other misc installation hardware.

<div class="side-by-side">
    <div class="toleft">
        <p>The hardware itself is impressive, and is assembled by hand by the owner of VintageMicros, John Woodall. John is the exclusive distributer for the X/ProFile, and takes great pride in his work. The X/Profile can be installed inside the Lisa unit for a seamless look, or it can be installed in an external ProFile case with a power regulator that is available for an additional cost. </p>
    </div>

    <div class="toright">
        <img class="image" src="/assets/images/2018-01-27-lisa-xprofile/kit.png" alt="Alt Text">
        <figcaption class="caption">Kit components from VintageMicros</figcaption>
    </div>
</div>

My Lisa is a Lisa 2/5, which is the second iteration of the system and resembles the Lisa 1 in almost every way. The Lisa 2/5 was originally equipped with a 5 Mhz Motorola 68000 processor, a built-in 400k Sony 3.5" floppy drive, and an external 5 megabyte Apple ProFile hard disk drive. The Lisa 2/5 also included two built-in external serial ports and a single built-in external parallel port. The Apple ProFile drive could be connected to the built-in parallel port or an expansion parallel port card if desired.

The Lisa 1 included the same hardware, with the exception of the floppy drive. The original Apple Lisa has two built-in 800k "Twiggy" floppy drives that were very problematic. The Lisa 2, released almsot a year later, solved the issue of problematic floppy drives by utilizing the same drive as it's cousin, the original Macintosh. This was at the expense of drive capacity, however, the external ProFile alleviated some of the pain. The Apple Lisa 2/10 and the Macintosh XL are similiar in design to the Lisa 2/5, and leveraged an internal 10 MB hard drive known as the Widget. Over 30 years later, Widget and ProFile drives in working condition are few and far between. 

# Installation 

The X/ProFile is very much a plug-and-play device as delivered, but requires careful reading of the installation and operation guides to ensure a pleasant experience. 

<div class="side-by-side">
    <div class="toleft">
        <p>Installing the X/ProFile in the machine is the cleanest method, and the kit includes all of the hardware necessary to install the card directly on the card cage above the floppy drive.</p>
    </div>

    <div class="toright">
        <img class="image" src="/assets/images/2018-01-27-lisa-xprofile/board-mounted.png" alt="Alt Text">
        <figcaption class="caption">Board mounted directly to the card cage for a factory look</figcaption>
    </div>
</div>

<div class="side-by-side">
    <div class="toright">
        <p>When installing into a Lisa 2/5, you can take advantage of some left-over Twiggy hardware from the Lisa 1 design - notably, the Twiggy power cable. One of the cables is connected to a built-in Lisa Lite adapter card that converts a Twiggy interface to the Sony interface. The other cable is left unused, and may be found hiding behind or under the drive cage.</p>
    </div>

    <div class="toleft">
        <img class="image" src="/assets/images/2018-01-27-lisa-xprofile/twiggy-cable.png" alt="Alt Text">
        <figcaption class="caption">The Twiggy power cable comes in handy</figcaption>
    </div>
</div>

The data connection is a bit trickier, however, since the Lisa 2/5 did not have an internal disk drive like the Lisa 2/10 or the Macintosh XL. When installating the X/ProFile inside a Lisa 2/5, a Sun20 cable is required. This cable has 26-pin socket header on one end and a male DB25 connector on the other end. Pin 7 on the DB25 is snipped, and Pin 26 of the socket conenctor remains unsed. 

<div class="side-by-side">
    <div class="toleft">
        <p>The DB25 connector will route out the back of the machine and connect to the built-in parallel port of the Lisa.</p>
    </div>

    <div class="toright">
        <img class="image" src="/assets/images/2018-01-27-lisa-xprofile/data3.png" alt="Alt Text">
    </div>
</div>

# Using the X/ProFile

Once the installation was complete, it was time to power up the Lisa. The kit comes with two compact flash cards; one has a Lisa Office System 2.1 install, and the other has a MacWorks install. Both are usable out of the gate without any changes to the X/ProFile necessary.

<div class="side-by-side">
    <div class="toright">
        <p>The Lisa Office System employs a unique copy protection scheme that serializes applications to the serial number of the machine. The kit includes a video ROM chip that can be installed that allows the included Lisa Office System applications to work. Or, if you have original media, that can be used to install a fresh operating system and applications. Either way, the X/ProFile is completely compatible with Lisa applications. Maybe even Snappier™!</p>
    </div>

    <div class="toleft">
        <img class="image" src="/assets/images/2018-01-27-lisa-xprofile/los.png" alt="Alt Text">
        <figcaption class="caption">The Lisa Office System in all its glory</figcaption>
    </div>
</div>

<div class="side-by-side">
    <div class="toleft">
        <p>A few tweaks to the X/ProFile allowed me to format a 128 MB compact flash card into two 32 MB storage areas. Given the size, the storage areas are only be usable with MacWorks. Within twenty minutes, I had System 7.1 running on the X/ProFile.</p>
    </div>

    <div class="toright">
        <img class="image" src="/assets/images/2018-01-27-lisa-xprofile/macworks.png" alt="Alt Text">
        <figcaption class="caption">A meager System 7.1 environment</figcaption>
    </div>
</div>

Any changes to the X/ProFile settings should only be done after a thorough reading of the manual. Otherwise, data loss can occur if you're not careful.

# Summary

The X/ProFile is one of only a few third-party addons for the Apple Lisa that is currently in production and available for purchase. Of all the addons available, the X/ProFile is probably the most important, since an Apple Lisa is not really usable without some form of hard disk storage. Genuine Apple ProFile drives often sell for hundreds of dollars online, and most are sold as 'untested', putting buyers at risk of ending up with a DOA device. The easy expansion capabilities of the X/ProFile and its compatibility with all known Lisa operating systems like Lisa Office System, MacWorks, Xenix, and more, make it a no brainer for any Lisa owner looking to archive their ProFile drives and enjoy their Lisa machine.

For interested buyers, the X/ProFile can be found at [VintageMicros](http://vintagemicros.com/catalog/product_info.php/cPath/30/products_id/282). 

Happy Hacking!

![](/assets/images/2018-01-27-lisa-xprofile/lisa2-noprofile.png)