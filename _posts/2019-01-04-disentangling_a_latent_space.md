---
title: Disentangling a Latent Space
layout: post
date: 2019-01-08
tag:
- machine learning
- vae
- latent space
- biology
blog: true
use_math: true
---
# An introduction to latent spaces

High-dimensional data presents many analytical challenges and eludes human intuitions. These issues area often short-handed as the ["Curse of Dimensionality."](https://en.wikipedia.org/wiki/Curse_of_dimensionality?oldformat=true) A common approach to address these issues is to find a lower dimensional representation of the high dimensional data. This general problem is known as [dimensionality reduction](https://en.wikipedia.org/wiki/Dimensionality_reduction?oldformat=true), including common techniques like principal component analysis [PCA].

In cell biology, the high-dimensional space may consist of many measurements, like transcriptomics data where each gene is a dimension. In the case of images, each pixel may be viewed as a non-negative dimension. The goal of dimensionality reduction is then to find some smaller number of dimensions that capture biological differences at a higher layer of abstraction, such as cell type or stem cell differentiation state. This smaller set of dimensions is known as a **latent space**. The idea of latent space is that each **latent factor** represents an underlying dimension of variation between samples that explains variation in multiple dimensions of the measurement space.

## Disentangled Representations

In the ideal case, a latent space would help elucidate the rules of the underlying process that generated our measurement space. For instance, an ideal latent space would explain variation in cell geometry due to cell cycle state using a single dimension. By sampling cells that vary only along this dimension, we could build an understanding of how the cell cycle effects cell geometry, and what kind of variation in our data set is explained by this singular process. This type of latent space is known as a **disentangled representation**. More formally, a disentangled representation maps each latent factor to a **generative factor**. A generative factor is simply some parameter in the process or model that generated the measurement data.

The opposite of a disentangled representation is as expected, an **entangled representation**. An entangled representation identifies latent factors that each map to more than one aspect of the generative process. In the cell geometry example above, an entangled latent factor may explain geometry variation due to the cell cycle, stage of filopodial motility, and environmental factors in a single dimension. This latent factor would certainly explain some variance in the data, but by convolving many aspects of the generative process together, it would be incredibly difficult to understand what aspects of cell biology were causing which aspects of this variation.

### Independence is necessary, but not sufficient

Notably, independence between latent dimensions is necessary but not sufficient for a disentangled representation. If latent dimensions are not independent, they can't represent individual aspects of a generative process in an unconfounded way. So, we need independent dimensions. However, independent dimensions are not necessarily disentangled. Two dimensions that are perfectly orthogonal could still change in unison when a particular parameter of the generative process is varied. For instance, imagine a latent space generated from cell shape images where one dimension represents the cell membrane edge shape and another represents the nuclear shape. If the cell cycle state of measured cells changes, both of these dimensions would covary with the cell cycle state, such that the representation is still "entangled." A disentangled representation would have only a single dimension that changes covaries with the cell cycle state.

## How can we find a disentangled representation?

Disentangled representations have many intuitive advantages over their entangled counterparts.

* List advantages of disentangled representations over entangled representations

However, there is no obvious route to finding a set of disentangled latent factors. Real world generative processes often have parameters with non-linear effects in the measurement space that are non-trivial to decompose. For instance, the expression of various genes over the ["lifespan" of a yeast cell](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3392685/) may not change linearly as a function of cellular age. To uncover this latent factor of age from a set of transcriptomic data of aging yeast, the latent space encoding method must be capable of disentangling these non-linear relationships.


# Advances in Disentangling

I've been excited by a few recent papers adapting the [variational autoencoder]( {{site.url}}/variational_autoencoding ) framework to generate disentangled representations. While variational autoencoders are somewhat complex, the modifications introduced to disentangle their latent spaces are remarkably simple. The general idea is that the objective function optimized by a variational autoencoder applies a penalty on the latent space encoded by a neural network to make it match a prior distribution, and that the strength and magnitude of this prior penalty can be changed to enforce less entangled representations.

## Digging into the VAE Objective

To understand how and why this works, I find it helpful to start from the beginning and recall what a VAE is trying to do in the first place. The VAE operates on two types of data -- $x$'s in the measurement space, and $z$'s which represent points in the latent space we're learning.

There are two main components to the network that transform between these two types of data points. The encoder $q(z \vert x)$ estimates a distribution of possible $z$ points given a data point in the measurement space. The decoder network does the opposite, and estimate a point $\hat x$ in the measurement space given a point in the latent space $z$.

This function below is the objective function of a VAE[^1]. A VAE seeks to minimize this objective by changing the parameters of the encoder $\phi$ and parameters of the decoder $\theta$.

$${L}(x; \theta, \phi) = - \mathbb{E}[ \log_{q_\phi (z \vert x)} p_\theta (x \vert z)] + \mathbb{D}_{\text{KL}}( q_\phi (z \vert x) \vert \vert p(z) )$$

While that looks hairy, there are basically two parts to this objective, each doing a particular task. Let's break it down.

### Reconstruction error pushes the latent space to capture meaningful variation

The first portion $-\mathbb{E}[ \log_{q_\phi (z \vert x)} p_\theta (x \vert z)]$ is the log likelihood of the data we observed in the measurement space $x$, given a particular configuration of the latent space $z$. If the latent space is configured in a way that doesn't capture much variation in our data, the decoder $p(x \vert z)$ will perform poorly and this log likelihood will be low. Vice-versa, a latent space that captures variation in $x$ will allow the decoder to reconstruct $\hat x$ much better, and the log likelihood will be higher.

This is known as the **reconstruction error**. Since we want to minimize $L$, better reconstruction will make $L$ more negative. In practice, we estimate reconstruction error using a metric of difference between the observed data $x$ and the reconstructed data $\hat x$ using some metric of difference like binary cross-entropy. In order to get reasonable reconstructions, the latent space $q(z \vert x)$ has to capture variation in the measurement data. The reconstruction error therefore acts as a pressure on the encoder network to capture meaningful variation in $x$ within the latent variables $z$. This portion of the objective is actually very similar to a "normal" autoencoder, simply optimizing how close we can make the reconstructed $\hat x$ to the original $x$ after forcing it through a smaller number of dimensions $z$.

### Divergence from a prior distribution enforces certain properties on the latent space

The second part of the objective

$$\mathbb{D}_{\text{KL}}( q (z \vert x) \vert \vert p(z) )$$

measures how different the learned latent distribution $q(z \vert x)$ is from a prior we have on the latent distribution $p(z)$. This difference is measured with the [Kullback-Leibler divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence?oldformat=true) [^2], which is shorthanded $$\mathbb{D}_\text{KL}$$. The more similar the two are, the lower the value of $\mathbb{D}_{\text{KL}}$ and the therefore the lower the value of the loss $L$. This portion of the loss therefore "pulls" our encoded latent distribution to match some expectations we set in the prior. By selecting a prior $p(z)$, we can therefore enforce some features we want our latent distribution $q(z \vert x)$ to have.

This prior distribution is often set to an isotropic Gaussian with zero mean $$\mu = 0$$ and a diagonalized covariance matrix with unit scale $$\Sigma = \mathbf{I}$$, where $$\textbf{I}$$ is the identity matrix, so $$p(z) = \mathcal{N}(0, \textbf{I})$$ [^3]. Because the prior has a diagonal covariance, this prior pulls the encoded latent space $$q(z \vert x)$$ to have independent components.

### Reviewing the Objective

Taking these two parts together, we see that the objective part **1** optimizes $p(x \vert z)$ and $q(z \vert x)$ to recover as much information as possible about $x$ after encoding to a smaller number of latent dimensions $z$ and **2** enforces some properties we desire onto the latent space $q(z \vert x)$  based on a desiderata we express in a prior distribution $p(z)$.

Notice that the objective doesn't scale either of the reconstruction or divergence loss in any way. Both are effectively multiplied by a coefficient of $1$ and simply summed to generate the objective.

### What sort of latent spaces does this generate?

The Gaussian prior $p(z) = \mathcal{N}(0, \mathbf{I})$ pulls the dimensions of the latent space to be independent. However, it does not explicitly force the disentangling between generative factors that we so desire. As we outlined earlier, independence is necessary but not sufficient for disentanglement.


# Footnotes

[^1]: An Objective function is also known as a loss function or energy criterion.

[^2]: The Kullback-Leibler divergence is a fundamental concept that allows us to measure a distance between two probability distributions. Since "the KL" is a distance, it is bounded on the low end at zero and unbounded on the upper end. $$\mathbb{D}_\text{KL} \rightarrow [0, \infty)$$.

[^3]: The identity matrix $\mathbf{I}$ is a square matrix with $1$ on the diagonal and $0$ everywhere else. In mathematical notation, $\mathcal{N}(\mu, \Sigma)$ is used to shorthand the [Gaussian distribution function.](https://en.wikipedia.org/wiki/Normal_distribution?oldformat=true#General_normal_distribution)
