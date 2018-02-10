---
title: "Tiramisu: Fully Connected DenseNets in PyTorch"
layout: post
date: 2018-01-18
tag:
- software
- deep learning
- pytorch
- segmentation
- image analysis
blog: true
use_math: true
---

# Semantic Segmentation

[Image segmentation]() is the first step in many image analysis tasks, spanning fields from human action recognition, to self-driving car automation, to cell biology.

Semantic segmentation approaches are the state-of-the-art in the field. Semantic segmentation trains a model to predict the class of each individual pixel in an image, where classes might be something like "background," "tree," "lung," or "cell." In recent years, convolutional neural network (CNN) models have dominated standardized metrics for segmentation performance, such as the [PASCAL VOC dataset](http://host.robots.ox.ac.uk:8080/leaderboard/displaylb.php?challengeid=11&compid=6).

# Patchwise CNN Semantic Segmentation

The earliest CNN semantic segmentation models performed "patchwise segmentation." As the name implies, this involves splitting the image up into a series of patches, and classifying the center pixel of each patch based on the area around it. While effective for some tasks, this approach has several computational inefficiencies.

Given an image `I` that is `N x M` pixels, you need to generate `NM` patches for classification. The vast majority of each of these patches overlaps with *many* other patches you're going to classify. This means that not only is memory wasted in representing the same parts of an image multiple times, but that the total computational burden is increased due to this overlap. Specifically, the total area in a given image is simply `N*M` pixels, but the total area represented and classified with a patchwise model is `N*M*PatchX*PatchY`.

As an example, imagine we have a `512 x 512` image and we use `32 x 32` patches. The total area we need to both represent and pass through our model is `512**2(32**2)` pixels, or `32**2 = 1024` fold more than the original image itself!
