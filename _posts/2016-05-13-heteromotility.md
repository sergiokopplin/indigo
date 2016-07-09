---
title: "Heteromotility"
layout: post
date: 2016-05-14
tag: software, image analysis, biology
projects: true
description: "Software tool for quantitative analysis of cell motility"
---

![Heteromotility Logo]( {{ site.url }}/assets/images/heteromotility_logo.png)

Heteromotility is a tool for analyzing cell motility in a quantitative manner. Heteromotility takes timelapse imaging data as input and calculates various 'motility features' that can be used to generate a 'motility fingerprint' for a given cell. The tool contains basic image segmentation and cell tracking components, but can also be used to analyze cell trajectories derived from another software tool. By analyzing more features of cell motility than most common cell tracking methods, Heteromotility may be able to identify novel heterogenous motility phenotypes.

## Heteromotility Core Features

* Cell tracking from timelapse imaging data with low temporal resolution
* Support for external tracking algorithms
* Extraction of 60+ motility features, including:
  + Average, maximum, minimum rates of travel
  + Total and net distance traveled
  + Linearity, monotonicity, progressivity of motion
  + Proportion of time spent moving, speed statistics only while moving
  + Comparison of cell motion to a naive random walk model, with variable time lag
  + Determination of mean squared displacement
  + Estimation of long-range dependence (rescaled range, detrended fluctuation analysis)
  + Proportion of turns in a given direction, magnitude of turn statistics
* Visualization of cell paths

## Additional Tools Provided

* Multiple segmentation algorithms for fibroblastic mammalian cells
* Supervised and unsupervised learning methods to cluster and classify cells by motility phenotypes

## Workflow & Usage

**Detailed usage details coming soon!**

*Built-in tracking from CSVs of object XY positions*

    $ heteromotility.py /path/to/cellxy_csvs/ /output_dir/

*Using external tracking software, providing cell paths as a pickled object*

    $ heteromotility --exttrack path_to/cell_path.pickle

## Source code

[Heteromotility Github](https://github.com/jacobkimmel/heteromotility)
