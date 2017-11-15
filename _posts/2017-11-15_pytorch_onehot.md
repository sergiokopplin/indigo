---
title: "PyTorch One-Hot Labels"
layout: post
date: 2017-11-15
tag:
- software
- deep learning
- pytorch
blog: true
---

Some interesting loss functions in deep learning require "one-hot" labels.

A "one-hot" label is simply a binary array of dimensions `dim0...dimN, C`, where `C` is the number of classes in your label.
This differs from the corresponding integer label, which is an array of `dim0...dimN`, where the values of each element are in the range `[0, C]`. Storing labels in the integer format is more common, since it's more compact.

When using [PyTorch](https;//pytorch.org), the built in loss functions all accept integer label inputs (thanks to the devs for making our lives easy!).

However, if you implement your own loss functions, you may need one-hot labels. Converting between the two is easy and elegant in PyTorch, but may be a little unintuitive.

To do so, we rely on the `torch.Tensor.scatter_()` function, which fills the target tensor with values from the source along provided indices. See the documentation [for details.](http://pytorch.org/docs/master/tensors.html#torch.Tensor.scatter_)

Below is a quick function I threw together to convert 2D integer labels to 2D one-hot labels, which can easily be altered for a different input/output dimensionality.
See the [Gist here](https://gist.github.com/jacobkimmel/4ccdc682a45662e514997f724297f39f).

```python
import torch
from torch.autograd import labels
def make_one_hot(labels):
    '''
    Converts an integer label Tensor/Variable to a one-hot variable.

    Parameters
    ----------
    labels : torch.Tensor or torch.Variable
        N x H x W, where N is batch size.
        Each value is an integer representing correct classification.

    Returns
    -------
    target : torch.LongTensor or torch.Variable
        N x C x H x W, where C is class number. One-hot encoded.
        Returns `Variable` if `Variable` is given as input, otherwise
        returns `torch.LongTensor`.
    '''
    v = False
    if isinstance(labels, torch.autograd.variable.Variable):
        labels = labels.data
        v = True

    C = labels.max() + 1
    labels_ = labels.unsqueeze(1)
    one_hot = torch.LongTensor(labels_.size(0), C, labels_.size(2), labels_.size(3)).zero_()
    target = one_hot.scatter_(1, labels_, 1)

    if v and torch.cuda.is_available():
        target = Variable(target)

    return target
```


Let's see this in action.


```python
>> labels = torch.LongTensor(4,4) % 3

2  1  0  0
1  0  0  0
2  0  0  1
2  0  0  1
[torch.LongTensor of size 4x4]

>> make_one_hot(labels)

(0 ,0 ,.,.) =
  0  0  1  1
  0  1  1  1
  0  1  1  0
  0  1  1  0

(0 ,1 ,.,.) =
  0  0  0  0
  1  0  0  0
  0  0  0  1
  0  0  0  1

(0 ,2 ,.,.) =
  1  1  0  0
  0  0  0  0
  1  0  0  0
  1  0  0  0
[torch.LongTensor of size 1x3x4x4]
```
