---
title: Guard Rails
layout: post
date: 2021-11-25
tag:
- biology
- machine learning
blog: true
use_math: false
---

<!-- 

Modeling the boundaries of life: Pauling used physical models of atomic structure to “hard code” known physical parameters into a hypothesis testing regime. His models were a form of physical computer — the dimensions of the objects matched realistic values, so that by simply testing of a configuration fit in 3D space, he was able to determine if a particular structure was consistent with known chemistry. As a simple example, all the bond lengths obeyed known values and double bond structure properly forced a fixed rotation angle between two bonded atoms. Encoding the “flatness” of a double bond enabled pauling to come up with the proper model for an alpha helix, vesting a rival group led by Max Perutz that incorrectly proposed several models where double bonds were able to rotate freely on their axes. Watson  and crick adopted a similar strategy for their construction of DNA models. In fact, one of their first model proposals that was dismissed by R Franklin was effectively a “software” failure — they failed to account for the necessity of water near highly polar phosphate groups, which they originally proposed would be on the internal side of a DNA helix. 


ML: We might imagine ML models as simply the natural evolution of Paulings simple physical models. Much of biology is best modeled as a complex system, difficult to reconstruct from a small set of rules. This makes it much harder to build useful Pauling style first principles models — the number of constants and their relationships explodes combinatorially as the complexity of the system increases. ML models offer and end run around this difficult. Given sufficient empirical data, we can learn a degenerate model of a system, if not a system that matches the rules used by biology. From these empirical models, we can rapidly test hypotheses that might otherwise be laborious to evaluate. 

As simple examples: combinatorial drug screening prediction, molecular docking predictions, protein folding, DNA sequence mutations, protein sequence mutations, gene regulatory network perturbations, lineage commitment perturbation predictions (PRESCIENT). ML models are a tool just like any other in biology, closer to classical theoretical biology than many practitioners or opponents of these methods realize.

Golden era of molecular biology

* The life sciences live in the shadows of molecular biology's giants. 
* Everything from our cognitive toolkit to the physical methods we employ and our definitions of success emerge from this era.
* As a disipline, we have largely adopted that classical molecular biologist's view that living systems like physical systems can largely be reduced to singular functions of individual parts.
* We define success as the assignment of a specific molecule to a function -- "mechanism," in biology largely means a molecule that can be shown as necessary and sufficient for a phenomenon. 
* We run individual expeirments guided by a single hypothesis to break systems into their components so that we may name them and assign a characture of their role.
* These methods have proved incredibly powerful, revealing to us the molecular basis of heredity, the physical mechanisms of cellular replication, the basis of many diseases, and empowering us to re-write the code of life at-will.
* The logic is not infalliable though -- we often come to oversimplified conclusions and fail to appreciate the broader rules of biological systems revealed by our individual experiments.

* Arjun Raj beautifully summarizes some of these errors in his infamous cartoon of a biologist investigating the molecular biology of airplanes: Cite Arjun's cartoon

History lesson

* The life sciences did not always proceed on so narrow an intellectual path.
* Early in the history of molecular biology itself, theory, first principles reasoning, and *empirical modeling* played key roles in 

Enter ML

* Machine learning has demonstrated remarkable advances in biology in the past 10 years
* Models have enabled researchers to ask biological questions at a scale that never before been possible
* A degree of tension has emerged between the ML and biological communities. These discussions aren't often public, but by traveling in these communities you gain a sense of the perspectives. Experimental biologists feel that the results of ML models are over-hyped and quickly move to defend the essential role of experimentation. ML practicioners lament the slow, one-off, irrepreducable nature of biological science, and wish that the experimental community could embrace the ML practicioners as biology's new leaders.

history lesson

* This tension reminds me of the clash-of-cultures that occured when Max Delbruck led a wave of physicists into biology following the second world war.
* Famously, Delbruck transitioned into biology after working with Lisa Meitner and Otto Hahn on nuclear physics in the 1930's. He expressed a series of concrete questions and hypotheses about the nature of living systems from a physicts perspective, made famous by Edwin Schroedinger in his pamphlet "What is life?".
* 
-->
*This post was inspired in part by Horace Freeland Judson's excellent history of molecular biology from 1940-1980, The Eighth Day of Creation.*

When Linus Pauling began working to resolve the structure of the alpha-helix, he built physical models of the proposed atomic configurations.
Most young biology students have seen photos of Pauling beside his models, but their significance is rarely conveyed properly.

<img src="http://scarc.library.oregonstate.edu/coll/pauling/catalogue/09/1954i.38-600w.jpg" width=400></img>

Pauling's models were not merely a visualization tool to help him build intuitions for the molecular configurations of peptides.
Rather, his models were precicesly machined **analog computers** that allowed him to empirically evaluate hypotheses at high speed.
The dimensions of the model components -- bond lengths and angles -- matched experimentally determined constants, so that by simply testing of a configuration fit in 3D space, he was able to determine if a particular structure was consistent with known chemistry.

These models "hard coded" known experimental data into a hypothesis testing framework, allowing Pauling to explore hypothesis space while implicitly obeying not only each individual experimental data point, but the emergent properties of their interactions.
Famously, encoding the “flatness” of a double bond into his model enabled Pauling to discover the proper structure for an alpha helix, while Max Perutz's rival group incorrectly proposed alternative structures because their model hardware failed to account for this rule.

Following Pauling's lead, Watson and Crick's models of DNA structure adopted the same empirical hypothesis testing strategy.
It's usually omitted from textbooks that Watson and Crick proposed multiple alternative structures before settingly on the alpha-helix. 
In their first such proposal, Rosalind Franklin highlighted something akin to a software error -- the modelers had failed to incorporate the necessity of water molecules to balance the charges of sugar-backbone phosphate groups, such that their model was physically implausible. 

Their discovery of the base pairing relationships emerged directly from empirical exploration with their physical model.
Watson was originally convinced that bases should form homotypic pairs -- A to A, T to T, etc. -- across the two strands.
Only when they build the model and found that the resulting "bulges" were incompatible with chemical rules did Watson and Crick realize that heterotypic pairs -- our well known friends A to T, C to G -- not only worked structurally, but confirmed Edwin Chargaff's experimental ratios[^1].

The foundations of molecular biology were laid by empirical exploration of evidence based models, but they're rarely found in our modern practice.

Where did the models go?

<!-- Complexity and the golden era of molecular biology -->

Modern biology lives in the shadow of The Golden Era of molecular biology.
The Golden Era's beginning is perhaps demarkated by Schroedinger's publication of Max Delbruck's questions and hypotheses on the nature of living systems in *What is Life?*.
The end is less clearly defined, but I'll argue that the latter bookend might be set by the contemporaneous development of recombinant DNA technology by Boyer & Cohen[^2] [1972] and (DNA sequencing technology)[https://en.wikipedia.org/wiki/Sanger_sequencing] by Fredrick Sanger [1977].
<!-- alternatively, one might say that Sanger sequencing was the defining end to the Golden Era and the rise of the Quantitative Era -->


# Footnotes

[^1]: Chargaff famously did not hold Watson and Crick in high regard. Upon learning of Watson and Crick's structure, he quipped -- "That such giant shadows are cast by such [small men] only shows how late in the day it has become."
[^2]: The history of recombinant DNA technology is beautifully described in [*Invisible Frontiers* by Stephen Hall.](https://jacobkimmel.notion.site/Invisible-Frontiers-The-Race-to-Synthesize-a-Human-Gene-9dc341fcc1c24723a38e9545c98417d9)

