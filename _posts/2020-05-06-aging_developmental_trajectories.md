---
title: "Aging across developmental trajectories"
layout: post
date: 2020-05-06
tag:
- aging
- biology
- muscle
- stem cell
- single cell
- genomics
- rna-seq
- velocity
projects: true
description: "Differentiation reveals the plasticity of age-related change in murine muscle progenitors"
---

*This post is adapted from [a series of posts on Twitter](https://twitter.com/jacobkimmel/status/1236098664147202048) and is intended to provide a ~5 minute summary of a recent paper. Please see the paper or research website for a more detailed description.*

Old stem cells are bad at making new cells to maintain tissue health, but it's unknown where in this process defects arise.

My [Calico](http://calicolabs.com) colleagues and I wondered if some aging defects are unseen until old stem cells are challenged to differentiate.

We describe our answers to this question in a new manuscript and research website.

**Differentiation reveals the plasticity of age-related change in murine muscle progenitors**  
Jacob C. Kimmel, David G. Hendrickson, David R. Kelley  
**doi:** [https://doi.org/10.1101/2020.03.05.979112](https://www.biorxiv.org/content/10.1101/2020.03.05.979112v1)

[Aging across developmental trajectories -- Calico Research Website](https://myo.research.calicolabs.com/)

## Mapping differentiation trajectories

Skeletal muscle becomes unhealthy with age & contains two stem cell types to explore these questions.

Using single cell RNA-seq, we captured transcriptomes for both muscle and mesenchymal stem cells before & after a differentiation challenge.

![Single cell mRNA abundance profiles displayed in a UMAP projection colored by cell type]({{site.url}}/assets/images/myoage/web_maca_cell_types.png)

Using a maximum mean discrepancy approach to compare young and aged cells, we found that differentiation increased the magnitude of aging in both muscle and mesenchymal stem cells.
This suggested that some aspects of aging are latent until stem cells are challenged.

![MMD comparisons]({{site.url}}/assets/images/myoage/web_maca_mmd_only.png)

Where in the differentiation process do these age-related changes arise?

Single cell genomics lets us infer a differentiation state using pseudotime methods, so we can contrast young and old cells across the trajectory.

![Pseudotime trajectories]({{site.url}}/assets/images/myoage/web_maca_trajectories_only.png)

We found that some aspects of aging are masked and more are revealed during differentiation, suggesting age-related changes are plastic across differentiation trajectories.

This was consistent in both of our stem cell types, suggesting the result isn't lineage specific.

![Differential expression across pseudotime]({{site.url}}/assets/images/myoage/web_maca_dex.png)

If differentiation reveals aging defects, does it change the trajectory of differentiation, or the ultimate cell fates?

Surprisingly, we found no evidence for trajectory or fate differences with age.

However, we *did* see that old muscle stem cells differentiated more slowly!

[Muscle differentiation delay]({{site.url}}/assets/images/myoage/web_maca_myogenic_traj.png)

Where do the old muscle stem cells "slow down"?
To answer this question, I leaned on the [remarkable RNA velocity technique.](https://t.co/18jOk2X7DE?amp=1)

Combining divergence analysis from dynamical systems with RNA velocity revealed two stable states in differentiating myogenic cells.

A stable stem cell state and committed state are separated by an unstable "repulsor," or energy barrier.

[Divergence analysis]({{site.url}}/assets/images/myoage/web_maca_velo.png)


The topology of the velocity field suggests cells have to make a decision in the repulsor region: either commit to making muscle, or retreat to the stem cell state.
Using stochastic phase simulations, we found this intuition is correct.

[Phase simulations]({{site.url}}/assets/images/myoage/web_maca_phase_math.png)

I loved this result, since it's consistent with the idea of "reserve cells" that quiesce when challenged to differentiate.

[Reserve cells were proposed >20 years ago](https://t.co/rJ3AixiOmB?amp=1), but this is the first time we've captured cells in the middle of this decision.

We used a simple machine learning model and RNA velocity to predict how each cell will move in the differentiation trajectory, yielding a "change in pseudotime."

We found that old muscle stem cells get "stuck" in the repulsor and differentiate more slowly than young cells.

[Delayed differentiation]({{site.url}}/assets/images/myoage/web_maca_change_in_pseudotime.png)

This suggests that there's a specific place in differentiation where old stem cells exhibit large aging defects.

Can we determine why some cells are moving forward, and others backward at this decision point?

To compare cells based on their velocity vectors, we developed a molecular bootstrap approach to estimate velocity confidence intervals.

We computed differential expression for forward vs. backward moving cells & found known regulators of myogenesis & some surprises.

[Myogenic determinants]({{site.url}}/assets/images/myoage/web_maca_vdex.png)

Our experiments suggest that differentiation reveals aging defects that are otherwise latent.

Functionally challenging other cell types might be a useful approach to uncover which of the many young vs. old differentially expressed genes contribute to functional defects.

As an example of highlighting important changes, functional challenges in myogenoc cells revealed a specific differentiation stage where things go wrong.

While aging seems to have little effect on differentiation trajectory or fates, differences in the rate are readily apparent.

[Models]({{site.url}}/assets/images/myoage/web_maca_models.png)
