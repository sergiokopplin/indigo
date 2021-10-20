---
title: Weekly scientific article highlights
layout: post
date: 2021-10-18
tag:
- genomics
- biology
- ml
- science
blog: true
use_math: true
---

I tend to write a set of short paper summaries every week to help crystalize my interpretation of the scientific literature.
Others have found these useful in the past, so I'll start sharing them at a more regular cadence here to highlight work I found interesting.

Papers will appear without an particular ordering.

### [Confronting false discoveries in single-cell differential expression](https://www.nature.com/articles/s41467-021-25960-2)

[Link](https://www.nature.com/articles/s41467-021-25960-2)

This is a sober take on some Simpson's Paradox flavored issues that can arise in single cell differential expression. The authors begin by assembling a compendium of 18 datasets where both bulk and single cell data were collected from control and perturbed cells of a single cell type. They then proceed to evaluate many different DE methods to recover the bulk DE results from single cells, treating bulk DE as ground truth.

The essential conclusion is that most common single cell DE methods don't account for biological replicates. Instead, they consider cells as replicates. 
In the event that biological replicates exhibit lots of variation, this can confound DE results and lead to lots of false discoveries. 
Surprisingly, the authors report that a simple pseudo-bulk procedure -- i.e. generating pseudobulk profiles for each biological replicate -- followed by classic bulk RNA-seq methods [DESeq2, edgeR] is superior to any single cell DE method for recovering DE genes from bulk samples. 

There's one caveat the authors don't touch on here, which is that their "ground truth" is a bit circular.
One can imagine genes where expression is driven by a small number of cells in the tissue, such that variability is better assessed by single cell methods than bulk RNA-seq. 
By treating bulk data as ground truth, these cases where single cell DE methods might perform better are masked.

Overall, I think this work highlights the importance of explicitly considering biological replicate information. 
Despite the authors critique of mixed-model GLMs at the end, I think that's likely the way forward.

I hope to one day get back around to building out a Bayesian mixed GLM implementation to enable this sort of analysis with denoised single cell data.

### [VEGA is an interpretable generative model for inferring biological network activity in single-cell transcriptomics](https://www.nature.com/articles/s41467-021-26017-0)

[Link](https://www.nature.com/articles/s41467-021-26017-0)

Here, the authors present a modified single cell VAE that incorporates a sparse set of weights in the decoder reflecting prior knowledge. The basic idea is similar to [PLIER](https://pubmed.ncbi.nlm.nih.gov/31249421/) in that the authors mask weights of a one-layer linear decoder so that each latent variable can contribute only to a pre-specified set of genes. 
They generate these gene masks based on several different databases [MSigDB, Reactome, TF GRNs] and show that their models can recover enrichment of immune cell signaling gene sets upon stimulation and cell type specific enrichment of TF GRNs.

There aren't any benchmarking excercises comparing the VEGA approach to simple gene set scoring baselines [e.g. gene set enrichment analysis on differentially expressed genes]. 
It's therefore unclear if the VEGA approach is superior to more traditional bioinformatics tools as implemented here. 
Nonetheless, this is a clever idea and it's interesting to see that even straightforward regularization approaches can yield more interpretable latent spaces.

Congratulations to the authors on a clean, well-executed algorithm!

### [SIMBA: SIngle-cell eMBedding Along with features](https://www.biorxiv.org/content/10.1101/2021.10.17.464750v1)

[Link](https://www.biorxiv.org/content/10.1101/2021.10.17.464750v1)

This is an interesting new paper applying knowledge graph embedding methods to single cell genomics problems. They authors only benchmark a subset of the problems the method addresses, so it's unclear exactly where a user should employ this approach, but the idea is quite distinct from the common approaches for several single cell genomics analysis tasks.

The authors formulate the problem of interpreting single cell experiments as a knowledge graph interpretation task. Given several biological entities [cells, genes, peaks, TF motifs], we want to learn relationships between them. They propose using knowledge graph embeddings to learn a representation where related entities co-embed. 
In practice, they treat cells and genes [or cells, peaks, TF motifs etc] as nodes in the graph, and draw edges between them when a given gene is expressed in a cell, or a given peak is open. 
They then apply a standard contrastive loss that maximizes the similarity of nodes that share edges in the embedding relative to a random set of edges that are constructed as negative examples.
Framing the problem as a knowledge graph embedding is reminiscent of my colleague Han Yuan's work to embed transcription factor binding motifs with [BindSpace.](https://www.nature.com/articles/s41592-019-0511-y)

Formally, the method contructs a graph $G = (V, E)$ defined by vertices $v_i \in V$ and edges $e = (v_i, v_j) \in E$. 
The graph construction differs depending on the analysis task, but in the simplest single cell RNA-seq case, the vertices are both cells **and** genes, while edges are drawn between cells and the genes they express.
Each of these edges is given a coarse grained weight based on the expression level of the gene in each cell.

The method then fits an embedding $\theta$ by minimizing a contrastive loss with stochastic gradient descent.
The loss is defined to maximize the "score" of true edges in the graph relative to simulated edges generated between semi-random pairs of nodes.
The score $s_e$ is defined as the simple dot product of two nodes in the embedding $s_e = \theta_{v_i} \cdot \theta_{v_j}$.
Intuitively, an edge will get a high score if the nodes are close together in the embedding, and a low score if they are far apart.

This brings us to our loss:

$L = - \log \frac{\exp(s)}{\sum_{s' \in N} \exp(s')} + \lVert \theta \rVert_2^2$

where the right hand term is a simple $\ell_2$ regularization penalty.

Once fit, they have an embedding of not only cells but also genes and peaks in the same space. Kinda weird to think about at first.
The authors find that they can identify marker genes based on coembedding with different cell types, find TF motifs that are enriched in different cell populations, and correct for batch effects across datasets. 
For cell cluster recovery, cell marker discovery, and batch effect correction, the authors report superior performance to some existing baseline approaches. I found this convincing evidence that the embeddings recover more than just pretty nearest neighbor graphs.

For future work, I'm particularly interested in the application of knowledge graph embeddings to recovering gene regulatory networks [e.g. $\mathrm{TF} \rightarrow \mathrm{Target\ Gene}$ graphs).
The authors highlight some qualitative results in this work, but it will be exciting to see comparisons to baseline approaches [covariance, sequence motifs, combination methods like SCENIC, scBasset et. al.] in the future.