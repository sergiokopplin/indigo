---
title: Open Questions
layout: post
date: 2020-09-01
permalink: /lists/index.html
---

Inspired by [Patrick Collision's list of interesting questions](https://patrickcollison.com/questions), I've collected a similar list of open questions that interest me and books I'd love to read that may not exist.
These two lists are closely intertwined, as I often find that the most satisfying answers to an open question could fill a book.

# Open Questions

## Why can't we accelerate animal development? What sets the clock?

There are many mutants in biological model organisms that experience delayed development (Mouse, *Mus musculus*: ; Fruit fly, *Drosophila melanogaster*: ; Eutelic nematode *C. elegans*: ).
However, there are few reports of perturbations that accelerate animal development.
Faster development would obviously be desirable from a fitness perspective, so we might suspect that there are some good reasons that development requires a set amount of time in each organism.
We also know that body size and gestation time are associated, suggesting that there is a roughly logarithmic relationship between the total amount of animal that must be built and the total

What are the rate limiting steps in development that prohibit acceleration?
The first-order guess might be that cell cycle doubling times are the limiting factor, but some quick Fermi-style estimates [^1] suggest that a mouse could develop much faster if only cell cycle rates were limiting.
What fundamental limits account for the differences?
A few candidate guesses: rates of diffusion for signaling molecules, rates of transcription and protein synthesis for differentiation into complex cell types (e.g. muscles need sarcomeres), rates of chromatin remodeling for cell differentiation, and rates of cell motility for the developmental migration.
In the ideal case, I'd love to have a Gant-style chart identifying the limiting rate at each stage in development.

# Bibliographic Desiderata

## A History of the National Institutes of Health

The US National Institutes of Health (NIH, FY2019 ~38B USD) and National Science Foundation (NSF, FY2019 ~7.5B USD) are some of the world's pre-eminent scientific funding agencies.
The funding decisions made by these institutions set the boundaries for most US scientific research and therefore play an outsized role in the rate of human technological progress.
What decisions led to the existing bureaucratic structures within each of these agencies?

For instance, why is the NIH organized into ["Institutional Centers,"](https://www.nih.gov/institutes-nih/list-nih-institutes-centers-offices) focused on specific anatomical regions (NIHLB, NIAMS, NEI, NIDCR) or diseases (NCI, NIA, NIAID, NIDDK), rather than say, biological disiplines as in a university (Cell & Molecular Biology, Biochemistry, Computational Biology)?
Is this the most effective organizational structure?
What is the relative return-on-investment for intramural research at the NIH (the IRP in NIH-speak) relative to the extramural grants provided to academics?
Why does the intramural research program largely copy the organizational structure of academic labs, despite having a very different incentive and workforce structure?

I'd love to understand the factors that led to the existing NIH/NSF funding models and read objective assessments of their effectiveness all in one place.

# Footnotes

[^1]: A single cell [weighs ~1 ng](https://bionumbers.hms.harvard.edu/bionumber.aspx?s=n&v=0&id=109717) and a P1 C57Bl/6 pup weighs ~1 g. So, there are `1/1e-9 g = 1e9 cells` in a P1 pup. It would take `1e9 = 2**x -> x = log2(1e9) -> x = 30 divisions` to generate a P1 pup's worth of cells. Mouse embryonic stem cells double every 4-5 hours. While other mouse cell types later in development divide more slowly, the embryonic stem cell division rate sets an upper bound on the maximum possible division rate for mouse cells. At this rate, it would only take `5 hours * 30 * 1 day/24 hours = 6.25 days` to build a P1 mouse! Mouse development [actually takes ~21 days](https://embryology.med.unsw.edu.au/embryology/index.php/Mouse_Timeline_Detailed), so the observed developmental time isn't even close to the maximum theoretical rate.
