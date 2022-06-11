---
title: Learning representations of life
layout: post
date: 2021-12-06
tag:
- biology
- machine learning
- history   
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
*I'm frequently asked how I think machine learning tools will change our approach to molecular and cell biology. This post is in part my answer and in part a reflection on Horace Freeland Judson's history of early molecular biology -- [The Eighth Day of Creation.](https://jacobkimmel.notion.site/The-Eighth-Day-of-Creation-787948ef203141a5a21be1620fcfee31)*

<!-- Introduction -->

Machine learning approaches are now an important component of the life scientist's toolkit.
From just a cursory review of the evidence, it's clear that ML tools have enabled us to solve once intractable problems like genetic variant effect prediction[^1], protein folding[^2], and unknown perturbation inference[^3].
As this new class of models enters more and more branches of life science, a natural tension has arisen between the empirical mode of inquiry enabled by ML and the traditional, analytical and heuristic approach of molecular biology.
This tension is visible in the back-and-forth discourse over the role of ML in biology, with ML practitioners sometimes overstating the capabilities that models provide, and experimental biologists emphasizing the failure modes of ML models while often overlooking their strengths.

Reflecting on the history of molecular biology, it strikes me that the recent rise of ML tools is more of a return to form than a dramatic divergence from biological traditions that some discourse implies.

Molecular biology emerged from the convergence of physics and classical genetics, birthing a discipline that modeled complex biological phenomena from first principles where possible, and experimentally tested reductionist hypotheses where analytical exploration failed.
Over time, our questions began to veer into the realm of complex systems that are less amenable to analytical modeling, and molecular biology became more and more of an experimental science.

Machine learning tools are only now enabling us to regain the model-driven mode of inquiry we lost during that inflection of complexity.
Framed in the proper historical context, the ongoing convergence of computational and life sciences is a reprise of biology's foundational epistemic tools, rather than the fall-from-grace too often proclaimed within our discipline.

# Physicists & toy computers

> Do your own homework. To truly use first principles, don't rely on experts or previous work. Approach new problems with the mindset of a novice -- Richard Feynman

When Linus Pauling began working to resolve the three-dimensional structures of the peptides, he built physical models of the proposed atomic configurations.
Most young biology students have seen photos of Pauling beside his models, but their significance is rarely conveyed properly.

<img src="http://scarc.library.oregonstate.edu/coll/pauling/catalogue/09/1954i.38-600w.jpg" width=400>

Pauling's models were not merely a visualization tool to help him build intuitions for the molecular configurations of peptides.
Rather, his models were precisely machined **analog computers** that allowed him to empirically evaluate hypotheses at high speed.
The dimensions of the model components -- bond lengths and angles -- matched experimentally determined constants, so that by simply testing if a configuration fit in 3D space, he was able to determine if a particular structure was consistent with known chemistry.

These models "hard coded" known experimental data into a hypothesis testing framework, allowing Pauling to explore hypothesis space while implicitly obeying not only each individual experimental data point, but the emergent properties of their interactions.
Famously, encoding the steric hindrance -- i.e. “flatness” -- of a double bond into his model enabled Pauling to discover the proper structure for the [alpha-helix](https://en.wikipedia.org/wiki/Alpha_helix), while Max Perutz's rival group incorrectly proposed alternative structures because their model hardware failed to account for this rule.

Following Pauling's lead, Watson and Crick's models of DNA structure adopted the same empirical hypothesis testing strategy.
It's usually omitted from textbooks that Watson and Crick proposed multiple alternative structures before settling on the double-helix. 
In their first such proposal, Rosalind Franklin highlighted something akin to a software error -- the modelers had failed to encode a chemical rule about the balance of charges along the sugar backbone of DNA and proposed an impossible structure as a result.

Their discovery of the base pairing relationships emerged directly from empirical exploration with their physical model.
Watson was originally convinced that bases should form homotypic pairs -- A to A, T to T, etc. -- across the two strands.
Only when they built the model and found that the resulting "bulges" were incompatible with chemical rules did Watson and Crick realize that heterotypic pairs -- our well known friends A to T, C to G -- not only worked structurally, but confirmed Edwin Chargaff's experimental ratios[^4].

<p float="middle">
    <img src="https://www.sciencehistory.org/sites/default/files/styles/rte_full_width/public/watson-crick-dna-model.jpg?itok=Qa7645Jc" height=250>
    <img src="https://www.sciencehistory.org/sites/default/files/styles/rte_full_width/public/historical_profile/rosalind-franklin.jpg?itok=sEqCmXUm" height=250 />
</p>

These essential foundations of molecular biology were laid by empirical exploration of evidence based models, but they're rarely found in our modern practice.
Rather, we largely develop individual hypotheses based on intuitions and heuristics, then test those hypotheses directly in cumbersome experimental systems.

*Where did the models go?*

# Emergent complexity in The Golden Era

The modern life sciences live in the shadow of The Golden Era of molecular biology.
The Golden Era's beginning is perhaps demarcated by Schroedinger's publication of Max Delbrück's questions and hypotheses on the nature of living systems in a lecture and pamphlet entitled [*What is Life?*](https://en.wikipedia.org/wiki/What_Is_Life%3F).
The end is less clearly defined, but I'll argue that the latter bookend might be set by the contemporaneous development of [recombinant DNA](https://en.wikipedia.org/wiki/Recombinant_DNA) technology by Boyer & Cohen in California [^5] [1972] and [DNA sequencing technology](https://en.wikipedia.org/wiki/Sanger_sequencing) by Fredrick Sanger in the United Kingdom [1977].

In Francis Crick's words[^6], The Golden Era was

> concerned with the very large, long-chain biological molecules -- the nucleic acids and proteins and their synthesis. Biologically, this means genes and their replication and expression, genes and the gene products.

Building on the classical biology of genetics, Golden Era biologists investigated biological questions through a reductionist framework.
The inductive bias guiding most experiments was that high-level biological phenomena -- heredity, differentiation, development, cell division -- could be explained by the action of a relatively small number of molecules.
From this inductive bias, the gold standard for "mechanism" in the life sciences was defined as a molecule that is necessary and sufficient to cause a biological phenomenon[^7].

Though molecular biology emerged from a model building past, the processes under investigation during the Golden Era were often too complex to model quantitatively with the tools of the day.
While Pauling could build a useful, analog computer from first principles to interrogate structural hypotheses, most questions involving more than a single molecular species eluded this form of analytical attack.

The search to discover how genes are turned on and off in a cell offers a compact example of this complexity.
Following the revelation of DNA structure and the DNA basis of heredity, Fraçois Jacob and Jacques Monod formulated a hypothesis that the levels of enzymes in individual cells were regulated by how much messenger RNA was produced from corresponding genes.
Interrogating a hypothesis of this complexity was intractable through simple analog computers of the Pauling style. 
How would one even begin to ask which molecular species governed transcription, which DNA sequences conferred regulatory activity, and which products were produced in response to which stimuli using 1960's methods?

Rather, Jacob and Monod turned to the classical toolkit of molecular biology.
They proposed a hypothesis that specific DNA elements controlled the expression of genes in response to stimuli, then directly tested that hypothesis using a complex experimental system[^8].
Modeling the underlying biology was so intractable that it was simply more efficient to test hypotheses in the real system than to explore in a simplified version.

**The questions posed by molecular biology outpaced the measurement and computational technologies in complexity, beginning a long winter in the era of empirical models.**

# Learning the rules of life

> John von Neumann [...] asked, How does one state a theory of pattern vision? And he said, maybe the thing is that you can’t give a theory of pattern vision -- but all you can do is to give a prescription for making a device that will see patterns! 
> 
> In other words, where a science like physics works in terms of laws, or a science like molecular biology, to now, is stated in terms of mechanisms, maybe now what one has to begin to think of is algorithms. Recipes. Procedures. -- Sydney Brenner[^9]

Biology's first models followed from the physical science tradition, building "up" from first principles to predict the behavior of more complex systems.
As molecular biology entered The Golden Era, the systems of interest crossed a threshold of complexity, no longer amenable to this form of bottom up modeling.
This intractability to analysis is the hallmark feature of [**complex systems**](https://en.wikipedia.org/wiki/Complex_system).

There's no general solution to modeling complex systems, but the computational sciences offer a tractable alternative to the analytical approach.
Rather than beginning with a set of rules and attempting to predict emergent behavior, we can observe the emergent properties of a complex system and build models that capture the underlying rules.
We might imagine this as a "top-down" approach to modeling, in contrast to the "bottom-up" approach of the physical tradition.

Whereas analytical modelers working on early structures had only a few experimental measurements to contend with -- often just a few X-ray diffraction images -- cellular and tissue systems within a complex organism might require orders of magnitude more data to properly describe.
If we want to model how transcriptional regulators define cell types, we might need gene expression profiles of many distinct cell types in an organism.
If we want to predict how a given genetic change might effect the morphology of a cell, we might similarly require images of cells with diverse genetic backgrounds.
It's simply not tractable for human-scale heuristics to reason through this sort large scale data and extract useful, quantitative rules of the system.

Machine learning tools address just this problem.
By completing some task using these large datasets, we can distill relevant rules of the system into a compact collection of model parameters.
These tasks might involve supervision, like predicting the genotype from our cell images above, or be purely unsupervised, like training an autoencoder to compress and decompress the gene expression profiles we mentioned.
Given a trained model, machine learning tools then offer us a host of natural approaches for both [inference](https://en.wikipedia.org/wiki/Statistical_inference) and prediction.

Most of the groundbreaking work at the intersection of ML and biology has taken advantage of a category of methods known as [representation learning](https://arxiv.org/abs/1206.5538).
Representation learning methods fit parameters to transform raw measurements like images or expression profiles into a new, numeric represenatation that captures useful properties of the inputs.
By exploring these representations and model behaviors, we can extract insights similar to those gained from testing atomic configurations with a carefully machined structure. 
This is a fairly abstract statement, but it becomes clear with a few concrete examples.

If we wish to train a model to predict cell types from gene expression profiles, a representation learning approach to the problem might first reduce the raw expression profiles into a compressed code -- say, a 16-dimensional vector of numbers on the real line -- that is nonetheless sufficient to distinguish one cell type from another[^10].
One beautiful aspect of this approach is that the learned representations often reveal relationships between the observations that aren't explicitly called for during training.
For instance, our cell type classifier might naturally learn to group similar cell types near one another, revealing something akin to their lineage structure.

At first blush, learned representations are quite intellectually distant from Pauling's first principles models of molecular structure.
The implementation details and means of specifying the rules couldn't be more distinct!
Yet, the tasks these two classes of models enable are actually quite similar.

If we continue to explore the learned representation of our cell type classifier, we can use it to test hypotheses in much the same way Pauling, Crick, and countless others tested structural hypotheses with mechanical tools.

We might hypothesize that the gene expression program controlled by *TF X* helps define the identity of cell type A.
To investigate this hypothesis, we might synthetically increase or decrease the expression of *TF X* and its target genes in real cell profiles, then ask how this perturbation changes our model's prediction.
If we find that the cell type prediction score for cell type A is correlated with *TF X's* program more so than say, a background set of other TF programs, we might consider it a suggestive piece of evidence for our hypothesis.

This hypothesis exploration strategy is not so dissimilar from Pauling's first principles models.
Both have similar failure modes -- if the rules encoded within the model are wrong, then the model might lend support to erroneous hypotheses.

In the analytical models of old, these failures most often arose from erroneous experimental data.
ML models can fall prey to erroneous experimental evidence too, but also to spurrious relationships within the data.
A learned representation might assume that an observed relationship between variables always holds true, implicitly connecting the variables in a causal graph, when in reality the variables just happened to correlate in the observations.

Regardless of how incorrect rules find their way into either type of model, the remedy is the same.
Models are tools for hypothesis exploration and generation, and real-world experiments are still required for validation.

# Old is new

Despite the implementation details, ML models are then not so distinct from the analog models of old.
They enable researchers to rapidly test biological hypotheses to see if they obey the "rules" of the underlying system.
The main distinction is how those rules are encoded.

In the classical, analytical models, rules emerged from individual experiments, were pruned heuristically by researchers, and then a larger working model was built-up from their aggregate.
By contrast, machine learning models derive less explicit rules that are consistent with a large amount of experimental data.
In both cases, these rules are not necessary correct, and researchers need to be wary of leading themselves astray based on faulty models.
You need to be no more and no less cautious, no matter which modeling tool you choose to wield.

This distinction of how rules are derived is then rather small in the grand scheme.
Incorporating machine learning models to answer a biological question is not a departure from the intellectual tradition that transformed biology from an observational practice to an explanatory and engineering disipline.
Rather, applications of ML to biology are a return to the formal approaches that allowed molecular biology to blossom from the fields that came before it.


<!-- # Endless forms most beautiful

> From so simple a beginning endless forms most beautiful and most wonderful have been, and are being evolved -- Charles Darwin -->

<!-- 
grails attained:
1 - classical genetics - models of DNA regulatory sequence
2 - classical biochemistry - models of protein structure from sequence and conservation
3 - classical development - models of cell type from expression and chromatin accessibility (scNym, scArches, multiVI)

grails unfinished:
1 - classical cell biology - integrative models of cellular structure. Integrated Cell reference.
2 - classical development - models of gene program interactions, predicting perturbations. Combinatorial perturbation autoencoder.
3 - physiology - models of how organ functions influence another. If cell type A in the liver changes in a particular direction, how will this effect the adipose tissue?
4 - biochemistry -- protein protein interactions. allosteric interactions with small molecules. evolution on molecular docking.
5 - virology - influence of mutations on viral fitness, virulence, pathogenicity
6 - immunology - sequence to antigen specificity conversion, predict sequences for target antigens
 -->


<!-- Given this analog between molecular biology's origin and the present confluence with ML, we might naturally wonder: What questions can this new class of models help us answer? What forms will these models take?

Analytical models helped reveal the structures of biological molecules, the kinetics of enzymatic reactions[^11], and the stochastic basis of genetic mutations[^12].
Already, machine learing models have enabled us to push beyond the limits of analytical approaches in some of the same biological domains.
A comprehensive discussion of the ML / biology intersection would span hundreds of pages[^13], but considering just a few examples provides many of the necessary intuitions to predict where the field is moving.

## Decoding the genome

How does a change in DNA sequence of a genome influence the phenotype of the organism? 
This classic question sits at the heart of modern molecular biology and remains the primary challenge in tasks ranging from comparative biology to human genetics.
Using analytical approaches, Gamow, Crick, Brenner, and the other members of the ["RNA Tie Club,"](https://www.wikiwand.com/en/RNA_Tie_Club) broke the cypher that maps DNA to protein sequences[^14].
While the cypher explains a core piece of the Central Dogma, the analytical approach can only explain the effect of a small number of mutations[^15].

<!-- **Current advances**  -->
<!--
Many researchers have developed ML models to close the gap between this limited set of analytical predictions and our empirical observation that mutations outside coding sequences matter a great deal.
These models can predict the effects of DNA sequence changes anywhere in a genome, most notably employing convolutional neural networks and multi-headed attention architectures.
As one illustrative example, [Basset](https://github.com/davek44/Basset) is a convolutional neural network developed by my colleague [David R. Kelley](http://www.davidrkelley.com/info) that predicts many functional genomics experimental results from DNA sequence alone.

Said differently, the model learns to translate DNA sequence into likely functional outcomes, including gene expression activity, chromatin accessibility, and transcription factor binding.
Approaches descended from Basset like [Basenji](https://github.com/calico/basenji), [BPNet](https://github.com/kundajelab/bpnet), and [Enformer](https://github.com/deepmind/deepmind-research/tree/master/enformer) build on a similar set of ideas but incorporate more sophisticated neural networks to achieve superior performance.

Using these tools, a researcher can exhaustively search the space of hypotheses about the effect of DNA mutations on functional genomic features.
By feeding the model mutated versions of the real, reference genome, researchers can obtain the predicted effect of each individual mutation.
These "*in silico* mutagenesis" experiments might be analogized to Pauling flipping the components of his molecular model into different orientations, querying the rules encoded in the model to see if they support a hypothesis.

With such remarkable results, are these models the "solution" to genetics?

Far from it.
DNA sequence models have achieved remarkable performance, but there are still fundamental questions that remain unsolved.
As a holy grail of molecular genetics, we might wish to translate the sequence of a genome into a list of phenotypes describing the organism that will develop, how it will live, and how might perish.
After all -- all of this information is reflected in the sequence alone.
Our current generation of DNA sequence models are far from this lofty goal.

We're currently limited to predicting only the first-order effects of DNA sequence changes, rather than considering the higher-order effects that might result.
For instance, if we *in silico* mutagenize the promoter of a transcription factor, current models might correctly predict a decrease in transcription factor gene expression, but can't extend that logic to predict that accessibility at the transcription factor's binding motifs might decreased.
This first-order prediction limitation is a common feature of many current ML models applied to biological problems, and represents a key challenge for future work modeling complex biological systems filled with feedback loops.
It's important to keep these limitations front of mind as we consider the very material benefits these modeling approaches provide, lest we fool ourselves into underestimating the complexity of biological problems. -->

<!-- 
**Unsolved problems**

While remarkable in their capability, existing regulatory sequence analysis models have important limitations:

* Current models predict only first-order impacts -- ablating the promoter sequence of a transcription factor doesn't change accessibility predictions for it's target genes in the same genome
* The effect of large scale gene sequence changes, like large insertion or deletions, or chromosomal rearrangements is difficult to model
* Most models map local sequence features to local sequence phenotypes. Few are capable of predicting higher-order phenotypes from large sets of sequences. e.g. We're not yet at the point of predicting the influence of a genetic variant on animal development. -->


<!-- ## Biochemistry

How does a simple, linear amino acid sequence give rise to a complex, three-dimensional structure? 
How do these structures confer the essential biological functions that dictate cell geometry, reproduction, and metabolism?

Analagous to molecular biology's obsession with information, these are a few of the eminent questions in biochemistry.

**Current advances**

Multiple groups have now constructed machine learning models that can fairly accurately predict the structure of a protein from an amino acid sequence[^11].
This is a truly remarkable feat, solving one of biology's widely recognized Grand Challenges.
By

* Molecular docking review

**Unsolved problems**

* Mutation prediction
* Small molecule design by discrimination -->

<!-- ## Development

How does a metazoan cell decide which genes to express and which cell type to become?

This is another classic question, the first glimmers of an answer emerging in [Hilde Mangold's experiments](https://www.wikiwand.com/en/Spemann-Mangold_organizer) that showed diffusable signals confered anatomical identity.
Through an analytical approach, embryologists proposed models for how these signals might propogate and interact to determine the myriad identities in a complex organism, but they too were outmatched by complexity at the cellular level[^16].
While analytical models can explain how distinct cell types might receive unique signals at some point in development, the molecular mechanisms that confer unique cell identities based on those signals are too complex to unravel from first principles.

Here too, researchers have taken advantage of machine learning approaches t

*  -->


<!-- ## Immunology

## Virology  -->


# Footnotes

[^1]: Researchers have built a series of ML models to interpret the effects of DNA sequence changes, most notably employing convolutional neural networks and multi-headed attention architectures. As one illustrative example, [Basenji](https://github.com/davek44/basenji) is a convolutional neural network developed by my colleague [David R. Kelley](http://www.davidrkelley.com/info) that predicts many functional genomics experimental results from DNA sequence alone.
[^2]: Both [DeepMind's AlphaFold](https://www.nature.com/articles/s41586-021-03819-2) and [David Baker lab's three-track model](https://science.sciencemag.org/content/early/2021/07/14/science.abj8754?adobe_mc=MCMID%3D55247908165515510124239564654459857138%7CMCORGID%3D242B6472541199F70A4C98A6%2540AdobeOrg%7CTS%3D1638513014&_ga=2.32296894.1688072684.1638513014-313706132.1636862856) can predict the 3D-structure of a protein from an amino acid sequence well enough that the community considers the problem "solved."
[^3]: If we've observed the effect of perturbation *X* in cell type *A*, can we predict the effect in cell type *B*? If we've seen the effect of perturbations *X* and *Y* alone, can we predict the effect of *X + Y* together? A flurry of work in this field has emerged in the past couple years, summarized wonderfully by Yuge Ji in a [recent review.](https://www.cell.com/cell-systems/pdf/S2405-4712(21)00202-7.pdf) As a few quick examples, [conditional variational autoencoders](https://github.com/theislab/scgen) can be used to predict known perturbations in new cell types, and [recommender systems can be adapted to predict perturbation interactions.](https://www.science.org/doi/10.1126/science.aax4438)
[^4]: Watson and Crick both knew Chargaff, but didn't appreciate the relevance of his experimentally measured nucleotide ratios until guided toward that structure by their modeling work. Chargaff famously did not hold Watson and Crick in high regard. Upon learning of Watson and Crick's structure, he quipped -- "That such giant shadows are cast by such [small men] only shows how late in the day it has become."
[^5]: The history of recombinant DNA technology is beautifully described in [*Invisible Frontiers* by Stephen Hall.](https://jacobkimmel.notion.site/Invisible-Frontiers-The-Race-to-Synthesize-a-Human-Gene-9dc341fcc1c24723a38e9545c98417d9)
[^6]: Judson, Horace Freeland. The Eighth Day of Creation: Makers of the Revolution in Biology (p. 309).
[^7]: As a single example, Oswald Avery's classic experiment demonstrating that DNA was the genetic macromolecule proved both points. He demonstrated DNA was necessary to transform bacterial cells, and that DNA alone was sufficient. An elegant, clean-and-shut case.
[^8]: The classical experiment revealed that mutations in the *lac* operon could control *expression* of the beta-galactosidase genes, connecting DNA sequence to regulatory activity for the first time. ["The Genetic Control and Cytoplasmic Expression of Inducibility in the Synthesis of beta-galactosidase by E. Coli".](https://life.ibs.re.kr/courses/landmark/PaJaMo1959.pdf)
[^9]: Judson, Horace Freeland. The Eighth Day of Creation: Makers of the Revolution in Biology (p. 334).
[^10]: This is just one of many problems at the ML : biology interface, but [it's one I happen to have an affinity for.]({{site.url}}/scnym/)
<!--
[11]: [Michaelis–Menten kinetics](https://en.wikipedia.org/wiki/Michaelis–Menten_kinetics)
[12]: Salvador Luria and the Max Delbrück performed a classic experiment -- ["the Luria-Delbrück experiment"](https://en.wikipedia.org/wiki/Luria–Delbrück_experiment) -- that showed bacterial mutations conferring phage resistance were acquired spontaneously, rather than induced by the prescence of phage. Their interpretation of the results relied upon a complex analytical model for how many resistant colonies were expected across a number of culture plates if resistance mutations were stochastic.
[13]: See this excellent, open-access review from an amazing collection of leaders in the field -- [Opportunities and obstacles for deep learning in biology](https://greenelab.github.io/deep-review/)
[14]: Crick noted many years after the solution was found that "cypher," is a more appropriate term than "code," since a cypher describes a mapping at the level of individual letters, while a code describes a mapping at the level of words.
[15]: Non-sense mutations in gene coding sequences can be predicted to abolish the function of the gene product based purely on first principles. The effects of almost all other mutations are very difficult to interpret using purely analytical tools. 
[16]: For instance, researcher's proposed the [French Flag model](https://www.wikiwand.com/en/French_flag_model) of morphogen interaction to explain how just two signaling molecules can specify diverse cellular fates.
[16]: [DeepMind's AlphaFold](https://www.nature.com/articles/s41586-021-03819-2), [David Baker lab's three-track model](https://science.sciencemag.org/content/early/2021/07/14/science.abj8754?adobe_mc=MCMID%3D55247908165515510124239564654459857138%7CMCORGID%3D242B6472541199F70A4C98A6%2540AdobeOrg%7CTS%3D1638513014&_ga=2.32296894.1688072684.1638513014-313706132.1636862856) -->
