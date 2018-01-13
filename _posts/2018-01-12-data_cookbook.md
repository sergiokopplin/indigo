---
title: "Data Cookbook"
layout: post
date: 2018-01-12
tag:
- software
- data science
- pandas
- numpy
- python
blog: true
---

# Data Cookbook

An ever-growing collection of code blocks to perform useful data manipulation and plotting functions with standard Python libraries. This is mostly for my own self-reference, but possibly useful to others!

# Numpy

## Preserve array dimensionality when slicing

When slicing a plane `i` from a multidimensional array `A`, use `A[i:i+1,...]` to preserve the array dimensionality with an empty dimension of size `1`.

```python
import numpy as np
A = np.random.random(5,5,5)
i = 0

A[:,i,:].shape # (5,5)
A[:,i:i+1,:].shape # (5,1,5)
```

# Pandas

## Sort a DataFrame by multiple columns

Use the `sort_values` method of DataFrames.

```python
df.sort_values(['a', 'b'], ascending=[True, False])
```

[Credit](https://stackoverflow.com/questions/17141558/how-to-sort-a-dataframe-in-python-pandas-by-two-or-more-columns)

## Check if rows are equal to an array-like vector

Given an array-like vector `v` with same dimensionality as rows in a DataFrame `df`, check which rows in `df` are equal to `v`.

```python
df = pd.DataFrame([[0,1],[2,3],[4,5]], columns=['A', 'B'])
v = np.array([0,1])
(df == v).all(1) # checks for boolean True across columns
```

[Credit](https://stackoverflow.com/questions/24761133/pandas-check-if-row-exists-with-certain-values)

# Matplotlib / Seaborn

## Rotate Seaborn axis labels

```python
g = sns.barplot(...)
g.set_xticklabels(g.get_xticklabels(), rotation=45)
```
