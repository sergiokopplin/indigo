---
title: Interpolation for Regularization and Profit
layout: post
date: 2019-11-28
tag:
- machine learning
- classification
- semi-supervised
blog: true
use_math: true
---
This post is a summary of two recent papers in the machine learning literature that try to improve upon classic supervised learning methods.

1. [mixup: Beyond Empirical Risk Minimization](https://arxiv.org/abs/1710.09412)
2. [Interpolation Consistency Training for Semi-Supervised Learning](https://arxiv.org/abs/1903.03825)

# How do we train a supervised classifier?

Supervised classification methods in machine learning focus on finding a mapping function $f_\theta$ with some parameters $\theta$ to map some inputs $\mathbf{X}^{n \times p}$ to a desired output $\mathbf{y}$.
In a now cliche example, the inputs $\mathbf{X}$ might be images of cats and dogs and the outputs are labels assigned to each image, $y_i \in$ {cat, dog}.

To find the right parameters $\theta$ for this mapping function, most machine learning methods take in a set of labeled training data -- say, images $\mathbf{X}$ with associated labels $y$ -- and change the parameters $\theta$ using an optimization method to minimize the difference between the predicted labels and true labels.
This is a broad strokes description of **empirical risk minimization [ERM]**, a general method for learning a mapping function of this sort.

One simple version of ERM is linear regression, as taught in high school algebra.
In linear regression, our function is $f_\theta(\mathbf{X}) = m\mathbf{X} + b$ and we alter the parameters $\theta = \{m, b\}$ to fit a line to some set of $\mathbf{X}$ points and $\mathbf{y}$ continuous labels.

Empirical risk minimization is great.
Combined with deep neural network architectures, it's yielded human-level performance on image classification, high quality machine translation, and life-like generation of images, videos, and music.
However, ERM does suffer from some flaws.
Predicting examples that are "outside the training distribution" -- a bit different than any of the examples in our training data -- results in poor performance.
A whole field of research in **adversarial examples** has cropped up to generate samples of this sort that give unexpected and problematic results.

# Can we improve on empirical risk minimization?

If we're given some set of data $\mathbf{X}$ and labels $\mathbf{y}$, classic supervised learning uses that data to reduce error, and that data alone.
However, there's some extra information in these data and labels that we might leverage.
Not only do we know the data points $\mathbf{X}$ and their labels $\mathbf{y}$, but we know the *covariance structure* [often called $\Sigma$ in the linear case] of the features in observation $x_{ij} \in \mathbf{x}_i$ in the data $\mathbf{X}$.
The covariance structure contains information about how features of our data change in concert with one another.
For instance, the covariance structure might capture that the shapes of ears and noses tend to vary together in our images of dogs and cats -- few dogs have cat noses, and few cats have dog ears, so those features vary together.

A classifier can learn the covariance structure of our data implicitly, but a classifier can perform very well even if it only respects the covariance structure in local neighborhoods around the observed data points.
If a new data point falls in between two observed data points, there are no guarantees that the classifier output will reflect this.
One approach we might take to improve a supervised classifier is to enforce the covariance structure *between* data points, in addition to enforcing it at the data points themselves.

We could enforce the covariance structure between data points by training our classifier on "simulated" data between observations, as well as those observations themselves.
We can take educated guess at a new data point $\hat{\mathbf{x_i}}$, $\hat{y_i}$ that might appear in the data by using the covariance structure to interpolate between observations.
If we were to guess at a new dog/cat image we might observe, given only our data $\mathbf{X}$, $\mathbf{y}$, we can use $\Sigma$ to make the educated assumption that a floppy eared friend will likely also have a dog snout, rather than a cat nose.
If we trained our classifier on these "simulated" examples between data points, we would effectively ask the classifier to provide predictions that are linear interpolations of observed data, consistent with intuitions.

This discussion has so far been a bit hand-wavy.
How might we actually go about using the covariance information in $\Sigma$ to simulate data, formally?
A recent paper from [Zhang et. al.](https://arxiv.org/abs/1710.09412) describes an elegantly simple method named **mixup**.
To generate a guess at a new data point $\hat{\mathbf{x_i}}$, $\hat{y_i}$, we simply blend two of our existing data points together with a weighted average.

$$\text{Mix}(\mathbf{x}, \mathbf{x}', \gamma) = \gamma \mathbf{x} + (1 - \gamma) \mathbf{x}'$$

where $\gamma \rightarrow [0, 1]$.

We can then take some educated guesses $\hat{\mathbf{x_i}}$, $\hat{y_i}$ at what additional data might look like, simply by weighted averaging of the data we already have.
By training on this mixed-up data, we can ensure that our classifier provides linear interpolations between data points.

Stated formally, the **mixup** training procedure is pretty simple. Assuming we have a model $f_\theta (\mathbf{x})$ with parameters $\theta$:

**1 - Draw a mixup parameter $\gamma$ from a $\beta$ distribution to determine the degree of mixing**

We parameterize the $\beta$ with a shape parameter $\alpha$ -- small $\alpha$ enforces less mixing, large $\alpha$ enforces more.

$$\gamma \sim \text{Beta}(\alpha, \alpha)$$

**2 - Mixup two samples $x_i$ and $x_j$, along with their labels $y_i$ and $y_j$**

$$x_k = \text{Mix}(x_i, x_j, \gamma)$$

$$y_k = \text{Mix}(y_i, y_j, \gamma)$$

**3 - Compute a supervised training loss**

Perform a supervised training iteration by computing the loss $l$ between the mixed label $y_k$ and the prediction made on the mixed sample $f_\theta(x_k)$. For classification, we can assume $l(y, y')$ is a cross-entropy loss to be concrete.

This procedure can be seen as a clever form of **data augmentation** -- a family of techniques to get more mileage out of a data set that usually involves adding noise to observations.
By training on our observed data, plus data that has undergone this **mixup** operation, we can build a classifier that provides smooth, linear interpolations between observed data points.

If we receive a new adversarial image that is exactly half-dog and half-cat ([perhaps a dog in a cat costume](https://i.pinimg.com/originals/72/48/a1/7248a1d4a343b9e78930bf250a2db212.jpg)), unlike anything we've ever seen before, we'd hope our classifier would output a score of 50% dog, 50% cat, rather than something totally crazy.
A classifier trained on mixup altered data can handle this scenario, and give the intuitive output.

![An image of a fluffy white dog in black cat costume, providing much joy.](https://i.pinimg.com/originals/72/48/a1/7248a1d4a343b9e78930bf250a2db212.jpg)

Not only does mixup provide an intuitive result in the case of unseen data that interpolates between training observations, but it improves classifier performance more generally.
The authors demonstrate on a variety of tasks that enforcing linear interpolations in the classifier outputs improves classification accuracy.
mixup can therefore be seen as a type of regularization, improving the generalization performance of a model and preventing overfitting.
Few ideas can provide quite so much bang for your buck!

# How can we use data without labels?

[Verma et. al.](https://arxiv.org/abs/1903.03825) explore an interesting extension of **mixup** applied to unlabeled data.
There are many domains where acquiring unlabeled data is cheap, but acquiring labeled data is hard.
Biology is a great poster child for this regime.
Some experiments are cheap to run, but hard to annotate [e.g. fluorescence microscopy images].
Even expensive experiments [e.g. next-gen sequencing] can benefit from public data that lack the appropriate annotations.

Without labels though, how can we leverage this data using standard classification models?
Just like our labeled data, some unlabeled data $\mathbf{U}$ still provides information about the covariance structure among our features of interest.
In the realm where our unlabeled data comes from a different environment [a different lab, different experimental method, etc.], the covariance structure might even differ somewhat.
If we can leverage this information about the covariance structure in our unlabeled data, we may be able to build a more robust classifier.

The key insight of [Verma et. al.](https://arxiv.org/abs/1903.03825) is that we can treat classifier predictions on unlabeled data as "fake labels" for the purpose of training.
Given these fake labels, we can use **mixup** on our unlabeled data the same way we use it on labeled data to ensure linear interpolations between unlabeled observations.
Even though the fake labels are initially very wrong, enforcing linear interpolation of classifier predictions between unlabeled points helps our model generalize to the covariance structure of the unlabeled data.

Stated formally, we're given some labeled data $\mathbf{X}$ with labels $\mathbf{y}$ as before, but we're also given another matrix of unlabeled data $\mathbf{U}$.

**1 - Compute supervised loss**

We first classify the labeled samples and compute a supervised loss $L_s$ [e.g. cross-entropy] as usual.

**2 - Counterfeit some labels**

We also compute a new, *unsupervised* loss $L_U$. We pass some unlabeled samples through the model to get some fake labels $z$.

$$z_i, z_j = f_\theta(u_i), f_\theta(u_j)$$

**3 - Mixup our unlabeled data and associated imposter annotations**

After generating fake labels, we perform **mixup** the same way we do for supervised labels.

$$\gamma \sim \text{Beta}(\alpha, \alpha)$$

$$u_k = \text{Mix}(u_i, u_j, \gamma)$$

$$z_k = \text{Mix}(z_i, z_j, \gamma)$$

**4 - Compute the unsupervised loss**

We compute the unsupervised loss as the difference of the mixed fake label from the prediction made on the mixed unlabeled sample.

$$L_U = l(f_\theta(u_k), z_k)$$

where $l$ is the cross-entropy loss $l(y, y') = -\sum_i^K y' \log(y)$$.

**5 - Compute the combined training loss**

We compute the overall training loss as a weighted sum of the supervised loss $L_S$ and the unsupervised loss $L_U$ with a weighting function $w(t)$ where $t$ is an iteration or epoch number. The exact form of $w(t)$ is flexible, but it often increases monotonically, starting from a $0$ value and rising to some values $>= 1$.

$$L = L_S + w(t) L_U$$

The authors demonstrate that this simple procedure improves performance on multiple classification tasks where a large degree of unlabeled data is available.

## All you need for semi-supervision is this one weird trick

I really admire how simple the **mixup** and ICT extensions are to the standard ERM paradigm.
With a couple modifications that can be implemented in a few hundred lines, any standard classification model can be extended to a semi-supervised classifier.
I look forward to seeing how these methods are adopted and applied to biological problems where unlabeled data bounds, but annotated data is thin on the ground.
