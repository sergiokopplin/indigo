---
title: Learning representations of life
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
*This post was inspired in part by Horace Freeland Judson's excellent history of molecular biology from 1940-1980, [The Eighth Day of Creation.](https://jacobkimmel.notion.site/The-Eighth-Day-of-Creation-787948ef203141a5a21be1620fcfee31)*

<!-- Introduction -->

Machine learning approaches are rapidly becoming part of the life scientist's toolkit.
As we solve once intractable problems -- genomic variant effect prediction, protein folding, perturbation prediction -- a natural tension has arisen as this new class of models challenges the traditional cognitive toolkit of molecular biology.
This tension is visible in the back-and-forth discourse over the role of ML in biology, with ML practitioners sometimes overstating the capabilities that models provide, and experimental biologists emphasizing the failure modes of ML models while often overlooking the strengths.

Reflecting on the history of molecular biology, it strikes me that the recent rise of ML tools is more of a return to form than a dramatic divergence from biological traditions.
Molecular biology emerged from the convergence of physics and classical genetics, birthing a discipline that modeled complex biological phenomena from first principles where possible, and experimentally tested reductionist hypotheses where analytical exploration failed.
Our questions began to veer into the realm of complex systems, inherently difficult to predict with classical analytical modeling, and molecular biology became more and more of an experimental science.

Machine learning tools are only now enabling us to regain the model-driven mode of inquiry we lost to complexity.
Framed in the proper historical context, the ongoing convergence of computational and life sciences is a reprise of biology's foundational epistemic tools, rather than the fall-from-grace too often proclaimed within our discipline.

# Molecular biology was born from first-principles analytical models

> Do your own homework. To truly use first principles, don't rely on experts or previous work. Approach new problems with the mindset of a novice -- Richard Feynman

When Linus Pauling began working to resolve the structure of the alpha-helix, he built physical models of the proposed atomic configurations.
Most young biology students have seen photos of Pauling beside his models, but their significance is rarely conveyed properly.

<img src="http://scarc.library.oregonstate.edu/coll/pauling/catalogue/09/1954i.38-600w.jpg" width=400></img>

Pauling's models were not merely a visualization tool to help him build intuitions for the molecular configurations of peptides.
Rather, his models were precisely machined **analog computers** that allowed him to empirically evaluate hypotheses at high speed.
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
Rather, we largely develop individual hypotheses based on intuitions and heuristics, then test those hypotheses directly in cumbersome experimental systems.

Where did the models go?

# Emergent complexity in The Golden Era

Modern biology of most flavors lives in the shadow of The Golden Era of molecular biology.
The Golden Era's beginning is perhaps demarkated by Schroedinger's publication of Max Delbrück's questions and hypotheses on the nature of living systems in [*What is Life?*](https://en.wikipedia.org/wiki/What_Is_Life%3F).
The end is less clearly defined, but I'll argue that the latter bookend might be set by the contemporaneous development of recombinant DNA technology by Boyer & Cohen[^2] [1972] and (DNA sequencing technology)[https://en.wikipedia.org/wiki/Sanger_sequencing] by Fredrick Sanger [1977].

In Francis Crick's words[^3], The Golden Era was

> concerned with the very large, long-chain biological molecules -- the nucleic acids and proteins and their synthesis. Biologically, this means genes and their replication and expression, genes and the gene products.

Building on the classical biology of genetics, Golden Era biologists investigated biological questions through a reductionist framework.
The inductive bias guiding most experiments was that high-level biological phenomena -- heredity, differentiation, development, cell division -- could be explained by the action of a relatively small number of molecules.
From this inductive bias, a necessary and sufficient molecular actor that gave rise to a biological phenomenon became the gold standard for "mechanism" in the life sciences[^4].

Though molecular biology emerged from a model building past, the processes under investigation during the Golden Era were often too complex to meaningfully modeled using the tools of the day.
While Pauling could build a useful, analog computer from first principles to interrogate structural hypotheses, most questions involving more than a single molecular species eluded this form of analytical modeling.

Following the revelation of DNA structure and the DNA basis of heredity, Fraçois Jacob and Jacques Monod formulated a hypothesis that the levels of enzymes in invididual cells were regulated by how much messenger RNA was produced from corresponding genes.
Interrogating a hypothesis of this complexity was intractable through simple analog computers of the Pauling style -- how would one even begin to ask which molecular species governed transcription, which DNA sequences conferred regulatory activity, and which products were produced in response to which stimuli using 1960's methods?

Rather, Jacob and Monod turned to the classical toolkit of molecular biology.
They proposed a hypothesis that specific DNA elements controlled the expression of genes in response to stimuli, then directly tested that hypothesis using a complex experimental system[^5].
Modeling the underlying biology was so intractable, that it was simply more efficient to test hypotheses in the real system than to explore in a simplified version.

**The questions posed by molecular biology outpaced the measurement and computational technologies in complexity, beginning a long winter in the era of empirical models.**

# Learning the rules of life

Biology's first models followed from the physical science tradition, building "up" from first principles to predict the behavior of more complex systems.
As molecular biology entered The Golden Era, the systems of interest crossed a threshold of complexity, no longer amenable to this form of bottom up modeling.
This intractability to analysis is the hallmark feature of [complex systems](https://en.wikipedia.org/wiki/Complex_system).

The computational sciences offer an alternative approach to modeling complex systems.
Rather than beginning with a set of rules and attempting to predict emergent behavior, we can observe the emergent properties of a complex system and build models that capture the underlying rules.
We might imagine this as a "top-down" approach to modeling, in contrast to the "bottom-up" approach of the physical tradition.

<!-- Consider including an Illustrator graphic here -->

Most of the groundbreaking word at the intersection of ML and biology has taken advantage of [representation learning methods](https://arxiv.org/abs/1206.5538) that seek to encode useful information about a system in a learned, mathematical representation.
This is a fairly abstract statement, but it becomes clear with a few concrete examples.

<!-- Consider using a different example -- predicting cell type from gene expression -->

<!-- If we wish to train a model to discriminate cell cycle states from microscopy images, a representation learning approach to the problem might first reduce the raw microscopy images into a compressed code -- say, a 16-dimensional vector of numbers -- that is nonetheless sufficient to distinguish cell cycle states.
One beautiful aspect of this approach is that the learned representations often reveal relationships between the observations that aren't explicitly called for during training.
For instance, our model for classifying cell cycle states naturally learns to encode mononucleated and binucleated cells into different regions of the representation. -->

If we wish to train a model to predict cell types from gene expression profiles, a representation learning approach to the problem might first reduce the raw expression profiles into a compressed code -- say, a 16-dimensional vector of numbers on the real line -- that is nonetheless sufficient to distinguish one cell type from another.
One beautiful aspect of this approach is that the learned representations often reveal relationships between the observations that aren't explicitly called for during training.
For instance, our cell type classifier might naturally learn to group similar cell types near one another, revealing something akin to their lineage structure.

At first blush, learned representations are quite intellectually distant from Pauling's first principles models of molecular structure.
The implementation details and means of specifying the rules couldn't be more distinct!
I've yet to see a representation learning model implemented on an analog computer [please correct me if I'm wrong!].
Yet, the tasks these two classes of models enable are actually quite similar.

<!-- If we continue to explore the learned representation of our cell cycle classifier, we can use it to test hypotheses in much the same way Pauling, Crick, and countless others tested structural hypotheses with mechanical tools. -->

If we continue to explore the learned representation of our cell type classifier, we can use it to test hypotheses in much the same way Pauling, Crick, and countless others tested structural hypotheses with mechanical tools.

We might hypothesize that the gene expression program controlled by *TF X* helps define the identity of cell type A.
To investigate this hypothesis, we might synthetically increase or decrease the expression of *TF X* and its target genes in real cell profiles, then ask how this perturbation changes our model's prediction.
If we find that the cell type prediction score for cell type A is correlated with *TF X's* program moreso than say, a background set of other TF programs, we might consider it a suggestive piece of evidence for our hypothesis.

This hypothesis exploration strategy is not so dissimilar from Pauling's first principles models.
Both have similar failure modes -- if the rules encoded within the model are wrong, then the model might lend support to erroneous hypotheses.
The real distinction lies in 

<!-- We might hypothesize that all else being equal, binucleated cells are less likely to enter mitosis from resting phase [$G_0$] than mononucleated cells.
We could test this hypothesis by constructing binucleated images from mononucleated observations -- maybe copy and pasting a couple mononuclei nearby in a convincing way -- and asking whether the predicted cell cycle state shifted away from the M-phase relative to the mononuclear predictions.

We might hypothesize that senescent cells share features with cells stalled in G2 moreso than other non-dividing cell populations.
We could interrogate this hypothesis in our model by predicting cell cycle states from images of senescent cells and other non-dividing populations [e.g. serum-starved], then asking if senescent cells had higher G2 predictions than their counterparts. 

These examples are simple, almost trivial in light of our deep knowledge of the cell cycle, but I hope they're illustrative of the fact that learned representations can be **hypothesis generation and testing tools**, much akin to the foundational analytical models of molecular biology.
The early pioneers of the field 
-->

# Footnotes

[^1]: Chargaff famously did not hold Watson and Crick in high regard. Upon learning of Watson and Crick's structure, he quipped -- "That such giant shadows are cast by such [small men] only shows how late in the day it has become."
[^2]: The history of recombinant DNA technology is beautifully described in [*Invisible Frontiers* by Stephen Hall.](https://jacobkimmel.notion.site/Invisible-Frontiers-The-Race-to-Synthesize-a-Human-Gene-9dc341fcc1c24723a38e9545c98417d9)
[^3]: Judson, Horace Freeland. The Eighth Day of Creation: Makers of the Revolution in Biology (p. 309). CSHL Press.
[^4]: As a single example, Oswald Avery's classic experiment demonstrating that DNA was the genetic macromolecule proved both points. He demonstrated DNA was necessary to transform bacterial cells, and that DNA alone was sufficient. An elegant, clean-and-shut case.
[^5]: The classical experiment determined revealed that mutations in the *lac* operon could control *expression* of the beta-galactosidase genes, connecting DNA sequence to regulatory activity for the first time. ["The Genetic Control and Cytoplasmic Expression of Inducibility in the Synthesis of beta-galactosidase by E. Coli".](https://life.ibs.re.kr/courses/landmark/PaJaMo1959.pdf)

