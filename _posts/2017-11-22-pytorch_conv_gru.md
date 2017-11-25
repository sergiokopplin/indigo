---
title: "Convolutional Gated Recurrent Units in PyTorch"
layout: post
date: 2017-11-22
tag:
- software
- deep learning
- pytorch
blog: true
use_math: true
---

Deep neural networks can be incredibly powerful models, but the vanilla variety suffers from a fundamental limitation. DNNs are built in a purely linear fashion, with one layer feeding directly into the next. Once a forward pass is made, vanilla DNNs don't retain any "memory," of the inputs they've seen before outside the parameters of the model itself. In many circumstances, this is totally fine! The classic supervised image classification task is a good example. A model doesn't need to "remember," anything about the inputs it saw previously, outside the parameters of the model, in order to demonstrate super-human performance. There is no temporal relationship between the examples shown to a simple supervised classification network competing on the traditional ImageNet or CIFAR datasets.

But what about situations where temporal relationships do exist? Where "remembering," the last input you've seen is beneficial to understanding the current one? To allow neural networks to "remember," [recurrent units](https://en.wikipedia.org/wiki/Recurrent_neural_network?oldformat=true) have been developed that allow the network to store memory of previous inputs in a "hidden state" $h$. Recurrent units in the most general sense were demonstrated [as early as 1982](http://www.pnas.org/content/79/8/2554.abstract). However, the earliest recurrent neural networks (RNNs) were difficult to train on data with long-term temporal relationships due to the problem of vanishing gradients [(Bengio 1994)](http://ieeexplore.ieee.org/document/279181/). [Long- short-term memory units (LSTMs)](https://en.wikipedia.org/wiki/Long_short-term_memory?oldformat=true) and their somewhat simpler relative [gated recurrent units (GRUs)](https://en.wikipedia.org/wiki/Gated_recurrent_unit?oldformat=true) have arisen as the recurrent unit of choice to solve these issues, and allow standard training by backpropogation. Chris Olah has [an incredibly lucid explanation of how both of these units work](https://en.wikipedia.org/wiki/Gated_recurrent_unit?oldformat=true).

Both LSTMs and GRUs were originally conceived as fully connected layers. Implementing transformations of the general form

$$g = \sigma (W x_t + U h_{t-1} + b)$$

where $g$ is the output of a "gate" within the recurrent unit, $\sigma$ is the sigmoid function, $W$ and $U$ are parameterized weight matrices, $x_t$ is the input at time $t$, $h_{t-1}$ is the hidden state from the previous time point $t -1$, and $b$ is a bias.

In this form, it's obvious that any spatial relationships which exist in the input $x_t$ are lost by the simple linear matrix multiplication of $W x_t$. In the case of image based inputs, it is likely advantageous to preserve this information.

Enter: convolutional gated recurrent units.

[Ballas *et. al.*](https://arxiv.org/abs/1511.06432) have recently explored a convolutional form of the traditional gated recurrent unit to learn temporal relationships between images of a video. Their formulation of the convolutional GRU simply takes the standard linear GRU

$$z_t = \sigma_g(W_z x_t + U_z h_{t-1} + b_z)$$
$$r_t = \sigma_g(W_r x_t + U_r h_{t-1} + b_z)$$
$$h_t = z_t \circ h_{t-1} + (1 - z_t) \circ \sigma_h(W_h x_t + U_h(r_t \circ h_{t-1}) + b_h)$$

and replaces the matrix multiplications with convolutions

$$z_t = \sigma_g(W_z \star x_t + U_z \star h_{t-1} + b_z)$$
$$r_t = \sigma_g(W_r \star x_t + U_r \star h_{t-1} + b_z)$$
$$h_t = z_t \circ h_{t-1} + (1 - z_t) \circ \sigma_h(W_h \star x_t + U_h \star (r_t \circ h_{t-1}) + b_h)$$

where $z_t$ is an update gate at time $t$, $r_t$ is a reset gate at time $t$, and $h_t$ is the updated hidden state at time $t$.

With this simple restatement, our GRU now preserves spatial information!

I was interested in using these units for some recent experiments, so I reimplemented them in [PyTorch](https://pytorch.org) with lots of inspiration from [@halochou's gist](https://gist.github.com/halochou/acbd669af86ecb8f988325084ba7a749) and [the PyTorch RNN source.](http://pytorch.org/docs/master/_modules/torch/nn/modules/rnn.html#RNN)

My implementation is [available on Github as `pytorch_convgru`](https://github.com/jacobkimmel/pytorch_convgru). The implementation currently supports multi-cell layers with different hidden state depths and kernel sizes. Currently, the spatial dimensions of the input are preserved by zero padding in the module. If you want to change the spatial dimensions in the ConvGRU, you can simply place a `.view()` op that implements your desired transformation between two separate `ConvGRU` modules.

As an example, here we can build a 3-cell ConvGRU with different hidden state depths and kernel sizes.

```python
from convgru import ConvGRU

# Generate a ConvGRU with 3 cells
# input_size and hidden_sizes reflect feature map depths.
# Height and Width are preserved by zero padding within the module.
model = ConvGRU(input_size=8, hidden_sizes=[32,64,16],
                  kernel_sizes=[3, 5, 3], n_layers=3)

x = Variable(torch.FloatTensor(1,8,64,64))
output = model(x)

# output is a list of sequential hidden representation tensors
print(type(output)) # list

# final output size
print(output[-1].size()) # torch.Size([1, 16, 64, 64])
```
