---
title: Heteromotility data analysis with `hmR`
layout: post
date: 2018-04-16
tag:
- software
- biology
- cell motility
- heteromotility
- R
blog: true
---

[`Heteromotility`](https://jacobkimmel.github.io/heteromotility) extracts quantitative features of single cell behavior from cell tracking data. Analyzing this high dimensional data presents a challenge. A typical workflow incorporates various types of analysis, such as unsupervised clustering, dimensionality reduction, visualization, analysis of specific features, pseudotiming, and more.

Previously, `heteromotility` data analysis relied on a library of rather unwieldy functions released with the feature extraction tool itself. I'm excited to release [`hmR`](https://github.com/jacobkimmel/hmR) today to lend some sanity to this analysis process.

[`hmR`](https://github.com/jacobkimmel/hmR) provides a set of clean semantics around single cell behavior data analysis. Inspired by the semantics of [`Seurat`](https://github.com/satijalab/seurat) in the single cell RNA-seq analysis field, [`hmR`](https://github.com/jacobkimmel/hmR) focuses analysis around a single data object that can be exported and transported across environments while maintaining all intermediates and final products of analysis.

[`hmR`](https://github.com/jacobkimmel/hmR) carries users from raw `heteromotility` feature exports, all the way to biologically meaningful analysis in just a few simple commands.

As an example, it's easy to produce visualizations of cell behavior state space in just a few lines with `hmR`.

```R
library(hmR)

df = read.csv('path/to/motility_statistics.csv')
mot = hmMakeObject(raw.data=df)

# Perform hierarchical clustering
mot = hmHClust(mot, k = 3, method='ward.D2')

# Run and plot PCA
mot = hmPCA(mot)
mot = hmPlotPCA(mot)

# Run and plot tSNE
mot = hmTSNE(mot)
mot = hmPlotTSNE(mot)
```

Running a pseudotime analysis is just as simple

```R

mot = hmPseudotime(mot)
hmPlotPseudotime(mot)
```

`hmR` currently focuses on analysis of cell behavior data in the static context, with dynamic analysis (detailed balance breaking, *N*-dimensional probability flux analysis, statewise cell transition vectors, etc.) being handled by the original `heteromotility` analysis suite.

Give `hmR` a try with your single cell behavior data and let me know if I can be helpful!

[**hmR Github**](https://github.com/jacobkimmel/hmR)

```R
library(devtools)
devtools::install_github('jacobkimmel/hmR')
```
