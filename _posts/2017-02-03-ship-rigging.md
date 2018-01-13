---
title: "Submarine Rigging"
layout: post
date: 2017-02-03
tag:
- workstation
- deep learning
- software
- image analysis
blog: true
description: "A tale of building a deep learning development rig."
---

# Motivation

As I dive deeper into the image analysis world, I've outgrown the Macbook Pro my undergrad institution provided circa 2012. It's not you shiny silver slab of the future, I'm just in the 1% of users for whom 16GB of RAM is not sufficient. Between (steerable filtering)[https://www.wikiwand.com/en/Steerable_filter] and [convolutional neural networks](https://www.wikiwand.com/en/Convolutional_neural_network), I've developed a pretty demanding set of computational needs.

Last month I decided it was time to sit down and build a real workstation, both to serve as a deep learning development rig and my everyday image analysis box. That in mind, I had to optimize across a couple axes.

**Goals**

* Benchtop tower format: I don't have a ton of dry lab space, so the box needs to fit in my current work area
* Dual GPU support: GPUs are the main processing unit for deep learning work, so it's critical that the workstation hold at least a couple late model cards.
* CPU with high single thread performance
* >=64 GB of RAM
* *Quiet*: We have some workstations in the lab that sound like jet turbines when the fans spin up. It's only a little annoying at first, but slowly drives you crazy.

# Components

The final build is a scaled back version of [NVidia's DIGITS workstation](https://developer.nvidia.com/devbox).

Component | Part
----------|------------------------
Motherboard | Asus X99M-WS
CPU | Core i7 5820K
GPUs | NVidia GTX 1080 (Pascal) x2
RAM | 64GB, DDR3 (Generic)
SSD | Samsung M.2 256GB
HDD | 6TB Western Digital x 2
Case | Cooler Master HAF 912
Fans | Fractal Design Silent Series R2

I opted for GTX 1080s rather than Titan Xs as a cost saving measure. Based on benchmarks, it seems 2 1080s provide more power in aggregate than a single Titan X for a similar price.  
Limiting VRAM per GPU is undesireable in a deep learning box, but given cost constraints this seemed like the best way to go.

The Cooler Master case decked out with Fractal Design Fans is nearly silent, allowing my lab mates and I to maintain our sanity during weeks long training sessions.

# Software

## OS

I loaded the rig up with Ubuntu 16.04 LTS. I've been a Linux geek since I was a child, and while other distro's may provide better performance when fine-tuned (i.e. Arch), it's hard to beat the community support for Debian distributions, and Ubuntu LTS especially, as a platform.

With the exception of proprietary NVidia and Broadcom drivers, everything worked right after installation. It's great to see how much Linux on the desktop has matured in recent years.

## Python Management

I've been a Python devotee since primary school and use it to implement the vast majority of my work.  

While Python 3 is now a mature product, the community is still split between Python 2.7 and Python 3, and a large amount of legacy code relies on Python 2.x. As such, you'll find you need to keep both installed on your development box.

[PyEnv]() is a great tool for managing multiple Python installations, and I recommend setting it up sooner rather than later.

Similarly, you should look into [`virtualenv`]() if you aren't already a fan. Like a pillow between siblings in the back of a car, sometimes the best way to avoid dependency woes is to keep every project in its own personal space.

## Deep Learning Packages

### CUDA and cuDNN

CUDA is the library magic that allows for parallelized computing on NVidia compute capable GPUs. To install it, download the latest libraries from NVidia's Accelerated Computing site and throw them in a directory where you're comfortable keeping libraries (i.e. `/usr/local/lib`).

cuDNN offers high performance implementations of common operations used by deep neural networks, such as convolution. Similarly, grab the latest version from NVidia and throw it in `/usr/local/lib/cuda` or the like.

Ensure that your `LD_LIBRARY_PATH` variable includes these directories so that CUDA and cuDNN are picked up by other packages. If you're unfamiliar with Linux environment variables, you can set a variable with a call to `export VARIABLENAME=/path/to/thing`. If you call `export` at the shell, it will only be stored for that session. To ensure that all new shell sessions reinstantiate the variable, you'll want to throw the same `export` call into your shell configuration file (i.e. `~/.bashrc`).

For Debian/Ubuntu, something like this in `~/.bashrc` will do the trick:

    export LD_LIBRARY_PATH=/path/to/cuda/lib64:/path/to/cuDNN/:${LD_LIBRARY_PATH}
    export CPATH=/path/to/cuda/include:${CPATH}
    # ${VARNAME} at the end appends the current path to the new added paths
    # ensuring you don't accidently overwrite a path set for another purpose

### Keras and Theano

I use the excellent [Keras package](https://keras.io/) as a DNN development framework, and [Theano]() as a Python tensor backend.

In this setup, Theano interfaces with the GPU to perform tensor computations in parallel, and Keras serves as a high-level markup to define, train, and use deep neural network models.

Both can be installed with a simple call to `pip`:

    pip install --user keras
