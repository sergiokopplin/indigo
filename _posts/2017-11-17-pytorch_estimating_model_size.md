---
title: "PyTorch Model Size Estimation"
layout: post
date: 2017-11-17
tag:
- software
- deep learning
- pytorch
blog: true
---

When you're building deep neural network models, running out of GPU memory is one of the most common issues you run into.

Adding capacity to your model by increasing the number of parameters can improve performance (or lead to overfitting!), but also increases the model's memory requirements. Likewise, increasing the minibatch size during typical gradient descent training improves the gradient estimates and leads to more predictable training results.

I imagine that some years in the future, GPU memory will become so plentiful that this isn't as common a constraint. However, in the big bright world of today, most of us are still stuck worrying about whether or not our models fit within the capacity of a typical consumer GPU.

I've really been loving [PyTorch](pytorch.org) for deep neural network development recently. Unfortunately, estimating the size of a model in memory using PyTorch's native tooling isn't as easy as in some other frameworks.

To solve that, I built a simple tool -- [`pytorch_modelsize`](https://github.com/jacobkimmel/pytorch_modelsize).

Let's walk through the logic of how we go about estimating the size of a model.

First, we'll define a model to play with.

```python
# Define a model
import torch
import torch.nn as nn
from torch.autograd import Variable
import numpy as np

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
```

There are three main components that need to be stored in GPU memory during model training.

1. Model parameters: the actual weights in your network
2. Input: the input itself has to be in there too!
3. Intermediate variables: intermediate variables passed between layers, both the values and gradients

How do we calculate in human-readable megabytes how big our network will be, considering these three components?

Let's walk through it step-by-step for an input with a batch size of `1`, image dimensions `32 x 32`, and `1 channel`. By PyTorch convention, we format the data as `(Batch, Channels,
Height, Width)` -- `(1, 1, 32, 32)`.

Calculating the input size first in bits is simple. The number of bits needed to store the input is simply the product of the dimension sizes, multiplied by the bit-depth of the data. In most deep neural network models, we'll be using double precision floating point numbers with a bit depth of `32`. Sometimes, calculations are done with single precision floats at only a `16` bit depth.

```python
bits = 32
input_size = (1, 1, 32, 32)
input_bits = np.prod(input_size)*bits
print(input_bits) # 32768
```

Calculating the size of the parameters is similarly fairly simple. Here, we utilize the `.modules()` attribute of `torch.nn.Module`.

```python
mods = list(model.modules())
for i in range(1,len(mods)):
    m = mods[i]
    p = list(m.parameters())
    sizes = []
    for j in range(len(p)):
        sizes.append(np.array(p[j].size()))

total_bits = 0
for i in range(len(sizes)):
    s = sizes[i]
    bits = np.prod(np.array(s))*bits
    total_bits += bits

print(total_bits) # 148480
```

Calculating the size of intermediate variables in PyTorch is a bit trickier. Since PyTorch uses dynamic computational graphs, the output size of each layer in a network isn't defined *a priori* like it is in "define-and-run" frameworks. In order to account for dimensionality changes in a general way that supports even custom layers, we need to actually run a sample through a layer and see how its size changes. Here, we'll do that with a dummy variable with the `volatile = True` parameter set to use minimal resources for this probing sojourn.

```python
input_ = Variable(torch.FloatTensor(*self.input_size), volatile=True)
mods = list(model.modules())
out_sizes = []
for i in range(1, len(mods)):
    m = mods[i]
    out = m(input_)
    out_sizes.append(np.array(out.size()))
    input_ = out

total_bits = 0
for i in range(len(self.out_sizes)):
    s = self.out_sizes[i]
    bits = np.prod(np.array(s))*self.bits
    total_bits += bits

# multiply by 2
# we need to store values AND gradients
total_bits *= 2
print(total_bits) # 4595712
```

As we see in this example, the majority of the memory is taken up by the intermediate variables and their gradient values.

It becomes obvious when working through this exercise why inference requires so much less memory than training. Storing gradients is expensive!

Using the tool linked above, this process is automated away.

```python
from pytorch_modelsize import SizeEstimator
se = SizeEstimation(model, input_size=(1,1,32,32))
estimate = se.estimate_size()
# Returns
# (Size in Megabytes, Total Bits)
print(estimate) # (0.5694580078125, 4776960)
```
