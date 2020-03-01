---
title: Git Cookbook
layout: post
date: 2018-10-13
tag:
- software
- git
- vcs
blog: true
---

# Git Cookbook

Similar to [the Data Cookbook]({{ site.url }}/data_cookbook), this is a list of
recipes for somewhat non-standard `git` workflows like recovering from accidental
commits. Primarily, this is for my own self-reference, but may prove useful to
others.

## Go Back One Commit

Often you accidentally commit something or need to revert to the previous version.

Have no fear, just

```bash
git reset HEAD^
```

to go back `N` commits

```bash
git reset HEAD^N
```
