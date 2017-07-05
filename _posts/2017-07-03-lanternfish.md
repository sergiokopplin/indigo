---
title: "Lanternfish"
layout: post
date: 2017-07-03
tag:
- software
- deep learning
- convolutional neural networks
- biology
projects: true
description: "Convolutional neural network analysis of biological motion"
use_math: true
---

![Lanternfish logo]( {{ site.url }}/assets/images/lanternfish_logo.png )

`Lanternfish` is a set of software tools to analyze motion data with convolutional neural networks. `Lanternfish` converts recorded motion paths in 2-dimensions into 3-dimensional 'motion cube' images, representing motion in an entirely spatial manner. `Lanternfish` includes CNN architectures suitable for classification of these 3-dimensional 'motion cubes' or unsupervised learning of motion features by autoencoding.

We've published a pre-print using `Lanternfish` to analyze cell motility in myogenic cells and a model of neoplastic transformation.  
[Check it out on bioRxiv!](http://www.biorxiv.org/content/early/2017/07/05/159202)

## Lanternfish Core Features

### Conversion of motion paths into 3-dimensional images

![Lanternfish 3D Motion Cubes]( {{ site.url }}/assets/images/lanternfish_fig1.png )

2-dimensional motion paths are converted into 3-dimensional images with dimensions $(x, y, time)$. Each timepoint in the series is represented by a slice of the resulting 'motion cube.' Each slice marks the location of the object at the corresponding timepoint as the center of an anisotropic kernel.

A typical kernel may be a Gaussian with a broad $\sigma_x = \sigma_y$ and a unit depth in the time domain. The magnitude $\mu$ of the kernel may be specified independently at each timepoint to allow for an additional information parameter to be encoded within the motion cube. Encoding the instantaneous speed of an object as the $\mu$ parameter tends to be useful for general classification tasks. `Lanternfish` also contains tools to specify a truly dynamic kernel for each timepoint, for instance encoding additional parameters as $\sigma_x$ and $\sigma_y$, by convolution on either CPUs or CUDA capable GPUs.

Motion cube generation tools also include the option to compress or crop collected tracks. This feature is useful to deal with limited GPU memory for downstream CNN training. Compression is performed by simple division and rounding of path coordinates, reducing the number of pixels required to represent the full field-of-view in each slice of a motion cube. Cropping allows for removal of a minority of paths that require much larger fields of view to fit, preventing a few outliers from 'diluting' the other motion cubes with empty space.

### Simulation of Motion and Transfer Learning

Borrowed from [`Heteromotility`]( {{site.url }}/heteromotility ), `Lanternfish` contains tools to simulate multiple biologically relevant models of motion. These simulations are useful for pre-training networks to learn 3-dimensional image features relevant to the image size and kernels chosen. Simulators of random walks, Levy fliers, and fractal Brownian motion are included.  

Tools to transfer learned representations from CNNs trained on simulated data to CNNs operating on real data are included.  

### Motion Classification CNNs

CNN architectures are included which have proven effective in classification of different types of motion. Architectures optimized for different motion cube sizes are provided.  

### Motion Autoencoding CNNs

CNN architectures for autoencoding of motion cubes to learn representations of motion feature space in an unsupervised manner are included. Architectures optimized for different motion cube sizes are provided.  

## Source code

All source code is freely available on the `Lanternfish` Github page. Feel free to [email me with any questions!](mailto:jacobkimmel@gmail.com)

[Lanternfish Github](https://github.com/jacobkimmel/lanternfish)
