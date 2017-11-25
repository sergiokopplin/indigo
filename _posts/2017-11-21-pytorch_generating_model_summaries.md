---
title: "Generating Model Summaries in PyTorch"
layout: post
date: 2017-11-21
tag:
- software
- deep learning
- pytorch
blog: true
---

Some of the most common bugs I encounter when building deep neural network models are dimensionality mismatches, or simple implementation errors that lead to a model architecture different than the one I intended. Judging based on the number of forum posts related to dimensionality errors, I guess I'm not the only one! While these bugs may be trivial to detect, the cryptic error messages produced when CUDA devices run out of memory (i.e. if you unintentionally multiply two huge matrices) aren't always helpful in tracking these bugs down.

To solve this, the [`keras`](https://keras.io) high-level neural network framework has a nice `model.summary()` method that lists all the layers in the network, and the dimensions of their output tensors. This sort of summary allows a user to quickly glance through the structure of their model and identify where dimensionality mismatches may be occurring.

I've taken up [`pytorch`](https://pytorch.org) as my DNN lingua-franca, but this is one feature I missed from "define-and-run," frameworks like `keras`. Since `pytorch` implements dynamic computational graphs, the input and output dimensions of a given layer aren't predefined the way they are in define-and-run frameworks. In order to get at this information and provide a tool similar to `model.summary()` in `keras`, we actually need to pass a sample input through each layer and get it's output size on the other side!

This isn't the most elegant way of doing things. I considered briefly implementing a method that identified the common layer types in a `pytorch` model, then computed the output dimensions based on known properties of the layer. I decided against this approach though, since it would require defining effects of each layer on dimensionality *a priori*, such that any custom layers or future layers added to `pytorch` would break the summary method for the whole model.

Instead, I implemented the inelegant solution described above of passing a sample input through the model and watching it's dimensionality change. The simple tool is available as [`pytorch_modelsummary`](https://github.com/jacobkimmel/pytorch_modelsummary). As with [the model size estimation tool]({{ site.url }}/pytorch_estimating_model_size) I described last week, the `pytorch_modelsummary` tool takes advantage of `pytorch`'s `volatile` Variables to minimize the memory expense of this forward pass. Model summaries are provided as a `pandas.DataFrame`, both for downstream analysis, and because `pandas` gives us pretty-printing "for free" :).

An example of using the model summary is provided below:

```python
# Define a model
import torch
import torch.nn as nn
from torch.autograd import Variable
import numpy as np

# Define a simple model to summarize
class Model(nn.Module):

    def __init__(self):
        super(Model,self).__init__()

        self.conv0 = nn.Conv2d(1, 16, kernel_size=3, padding=5)
        self.conv1 = nn.Conv2d(16, 32, kernel_size=3)

    def forward(self, x):
        h = self.conv0(x)
        h = self.conv1(h)
        return h

model = Model()

# Summarize Model
from pytorch_modelsummary import ModelSummary

ms = ModelSummary(model, input_size=(1, 1, 256, 256))

# Prints
# ------
# Name    Type               InSz              OutSz  Params
# 0  conv0  Conv2d   [1, 1, 256, 256]  [1, 16, 264, 264]     160
# 1  conv1  Conv2d  [1, 16, 264, 264]  [1, 32, 262, 262]    4640

# ms.summary is a Pandas DataFrame
print(ms.summary['Params'])
# 0     160
# 1    4640
# Name: Params, dtype: int64
```
