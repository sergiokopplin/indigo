---
title: "State transitions in aged stem cells"
layout: post
date: 2019-08-24
tag:
- aging
- biology
- muscle
- stem cell
- timelapse
- microscopy
- single cell
- genomics
- rna-seq
projects: true
description: "Aging induces aberrant state transition dynamics in murine muscle stem cells"
---

*This post is adapted from a series of posts on Twitter, so please excuse the short form nature of some descriptions.*

## Muscle stem cell activation is impaired with age

Old muscle stem cells (MuSCs) are bad at regeneration, partly because they don’t activate properly.
Does aging change the set of cell states in activation, or the transition rates between them?
In my final days as a graduate student, I explored this question with my excellent mentors [Wallace Marshall](cellgeometry.ucsf.edu) & [Andrew Brack.](bracklab.com)

[Check out our manuscript on this topic over on bioRxiv.](https://www.biorxiv.org/content/10.1101/739185v1)

If aging changes a cellular response like stem cell activation, it might happen through two mechanisms.
Aging might change the set of cell states a cell transitions through (different paths), or it might change the rate of transitions (different speeds).
In biology, reality is often a weighted mixture of two models, so both of these mechanisms may be at play.
How can we determine the relative contribution of each model?

## Measuring the trajectory of stem cell activation in aged cells

![Cartoon schematic showing aged and young cells moving through an abstract two dimensional space in either different directions, or at different speeds.]({{site.url}}/assets/images/aging_musc_dynamics/model.jpg)

We can measure the path of activation by measuring many individual cells at a single timepoint.
To estimate these paths, we measured transcriptomes of aged and young muscle stem cells with scRNA-seq during activation.
As an added twist, I isolated cells from mice harboring *H2B-GFP^+/-^; rtTA^+/-^* alleles that [allow us to label muscle stem cells with different proliferative histories.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3605795/)
In previous work, Andrew's lab has shown that MuSCs which divide rarely during development (label retaining cells, LRCs) are more regenerative than those that divide a lot (non-label retaining cells, nonLRCs).
By sorting these cells into separate tubes by FACS, we were able to associate each transcriptome in the single cell RNA-seq assay with both a cell age and proliferative history.

![Schematic of our single cell RNA sequencing experimental design. We took muscle stem cells from young and aged mice using FACS and performed sequencing at two time points: 1. immediately after isolation and 2. after 18 hours of culture.]({{site.url}}/assets/images/aging_musc_dynamics/scrnaseq_schematic.jpg)

From the scRNA-seq data, we can fit a "pseudotime" trajectory to estimate the path of activation.
This trajectory inference method was pioneered by Cole Trapnell, now at the University of Washington.
We find this trajectory recapitulates some known myogenic biology, and also has some surprises.
The one that stood out most to me was the non-monotonic behavior of *Pax7*.
It has long been assumed that *Pax7* marked the most quiescent, least activated stem cells, so it was a bit shocking to see it go back up as cells activated.

![A pseudotime trajectory fit to our single cell RNA sequencing data.]({{site.url}}/assets/images/aging_musc_dynamics/trajectory_fit.jpg)

Onto the aging stuff we came for — young and aged cells are pretty evenly mixed along the same trajectory.
Most aging changes are pretty subtle by differential expression, further suggesting that the change in activation trajectories with age is modest.
This seems to suggest the “path” of activation is retained in aged cells.

![A pseudotime trajectory fit to our single cell RNA sequencing data.]({{site.url}}/assets/images/aging_musc_dynamics/trajectory_age.jpg)

## Measuring state transitions in single cells

So if the paths are pretty similar across ages, are the rates different?
How can we even measure state transition rates in single cells?
In previous work with Wallace Marshall, [I developed a tool to infer cell states from cell behavior captured by timelapse microscopy.]({{site.url}}/heteromotility)
We found we could measure state transitions during early myogenic activation in that first paper.
Measuring cell state transitions rates in aged vs. young cells was an obvious next step.

So, to see if aging changes the rate of stem cell activation, we did just that.
After featurizing behavior and clustering, we find that aged and young MuSCs lie along an activation trajectory, as in the first paper.

![Experimental schematic of our cell behavior experiment. Young and aged MuSCs were imaged by timelapse microscopy for 48 hours and Heteromotility was used to featurize behaviors.]({{site.url}}/assets/images/aging_musc_dynamics/behavior.jpg)

Aged and young cells again share an activation trajectory, but young cells are enriched in more activated clusters.
State transition rates are higher in young cells as well.
This suggests aging alters states transition rates.

![Cell behaviors contrasted by age.]({{site.url}}/assets/images/aging_musc_dynamics/behavior_age.jpg)

scRNA-seq and cell behavior seem to be telling a similar story.
But are the states of activation they reveal the same?
We investigated the non-monotonic change in Pax7 with activation that we found by single cell RNA-seq using cell behavior to find out.

We set up a cell behavior experiment, and immediately stained cells for Pax7/MyoG after the experiment was done.
This allows us to map Pax7 levels to cell behavior states.
We find the same non-monotonic change in Pax7 that we found by scRNA-seq!

![Cell behaviors paired to immunohistochemistry.]({{site.url}}/assets/images/aging_musc_dynamics/behavior_stains.jpg)

So, scRNA-seq & behavior suggest the activation trajectory is retained with age, but behavior indicates aged state transitions are slower.
Can we estimate transition rates from scRNA-seq too?
[In brilliant work from 2018,](https://t.co/18jOk2X7DE?amp=1) La Manno *et. al.* showed that we can estimate state transitions from intronic reads in RNA-seq.
We find this inference method recapitulates the activation trajectory we found with pseudotime really well.

![RNA velocity vectors projected atop a PCA projection of our single cell RNA sequencing data.]({{site.url}}/assets/images/aging_musc_dynamics/velocity.png)

There were no obvious qualitative differences in the RNA velocity field between ages.
To make quantitative comparisons though, I turned to the classic dynamical systems technique of phase simulations.
A phase simulation places an imaginary point in a vector field and updates the position of the point over time based on the vectors in the neighborhood of the point.

This can reveal properties of the vector field that are hard to deduce qualitatively.
Imagine floating a leaf on top of a river to figure out how fast the water is flowing.
Here, I start phase points in the young/aged velocity fields, and update positions over time based on velocity of neighboring cells.

![RNA velocity phase simulations.]({{site.url}}/assets/images/aging_musc_dynamics/phase_sim.png)

[Watch an animation of this simulation process here.](https://twitter.com/i/status/1163534186885464064)

At each time step, we can infer a pseudotime of coordinate for the phase point using a simple regression model.
After a thousand or so simulations, we find that young cells progress more rapidly through the activation trajectory than aged cells.
This got me excited — two totally orthogonal measurement technologies telling us the same thing.

![RNA velocity phase simulations.]({{site.url}}/assets/images/aging_musc_dynamics/phase_sim_result.png)

We also infer a “future” pseudotime coordinate for each cell from the velocity vector.
We found many cells are moving backwards!
This suggests activation is more like biased diffusion than a ball rolling downhill.

![RNA velocity backwards motion.]({{site.url}}/assets/images/aging_musc_dynamics/backwards.jpg)

Perhaps more poetically, this reminds me of the difference between macroscopic motion and microscopic motion.
In macroscopic motion, like a ball rolling down a hill, inertia takes precedence and noise is negligible.
By contrast, noise often dominates the motion of microscopic particles, like a molecule of water diffusing across a glass.
It seems activating muscle stem cells more closely resemble that diffusing water molecule than a ball rolling down a hill, maybe to Waddington's chagrin.

## Conclusions

In toto, both cell behavior and scRNA-seq indicate that aged MuSCs maintain youthful activation trajectories, but have dampened transition rates.
