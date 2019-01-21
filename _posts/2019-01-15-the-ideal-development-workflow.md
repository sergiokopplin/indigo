---
title: "The Ideal Development Workflow"
layout: post
date: 2019-01-15
image: /assets/images/markdown.jpg
headerImage: false
tag:
- building
- development
- productivity
- testing
category: blog
author: andrew
description: What the ideal development workflow is and why we strive to approximate it.
---

*Work in Progress*

Developing software is like herding cats: the cats are the myriad and sometimes unexpected inputs provided by our users,
and the cowboys are our carefully-designed lines of code, funneling the cats through well-tested call stacks, and
and leaving them with useful output.

We may invent services to provide for a specific use-case, but once we expose these services to the world, we may be
met with thousands of simultaneous requests that carry unforeseen expectations for our products.

We cannot meet these challenges with numbers. Successful software products may have millions of users per engineer.
*The Mythical Man Month* suggests that adding engineers to a product only delays its progress. Each change to a software
service risks crashing the service or opening a security breach. Trying to coordinate large numbers of such changes can
be a losing battle.

However, providing your development team a simple, quick, and consistent workflow could amplify your team's
productivity to meet whatever challenges your user-scale brings. Rather than throwing larger numbers of talent at a
problem, we empower the talent we already have to work more effectively.

# The Steps of an Ideal Development Workflow

Our workflow begins with a well-described feature request or bug report, a highly readable codebase, and a developer
skilled in whatever language the codebase is written in. To make things interesting, we will assume that the developer
is new to the project: this will be their first pull request for this repository.

## 1. Cloning the Repository

This may seem simple. A `git clone ...` command is truly all we need here. But how do we find the Git URL?

Ideally, your product would have a wiki page entitled as 'Your Product Name', so any layperson in your organization
could find this page. The page would explain where services' repositories lie in a concise, tabular form:

| name   | purpose                | repository                           |
|--------|------------------------|--------------------------------------|
| barn   | a place to keep cows   | [https://github.com/ags799/barn]()   |
| cowboy | herds cattle           | [https://github.com/ags799/cowboy]() |
| stable | a place to keep horses | [https://github.com/ags799/stable]() |

It's important not to overdo the "purpose" description here. Precise documentation expires more quickly. Documentation
outside of source control may be discoverable to your broader organization, but its rarely visited by the experts
working on a product. Thus, if we have the "true", all-encompassing description of a service on this wiki page, it is
almost certainly going to be misleading a month later.

We reserve "true" definitions of a service's purpose to the README in that service's repository. We describe its short,
somewhat vague purpose on our wiki page to help guide the developer along, but we expect them to visit a few
repositories and read their descriptions on their README pages before they feel confident that they understand our
multi-repository setup.

After browsing this highly-discoverable wiki page and the highly-descriptive README files it links to, our developer
has a high chance of identifying the repository for which to submit a change without ever asking for help. Of course,
it is ridiculous to expect a new developer to accomplish anything without asking questions. We only try to make our
process as fluid as possible to keep our development team running like a well-oiled machine.

# Why an Ideal Development Workflow is Impossible and Why We Try to Approximate It

TODO
