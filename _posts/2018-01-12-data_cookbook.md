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

An ever-growing collection of code blocks to perform useful data manipulation and plotting functions with standard Python libraries. This is mostly for my own self-reference, but possibly useful to others.

# Bash

## sed

### Delete a line matching a pattern

```bash
sed '/some_string/d' $FILE
```

# Python

These code snacks describe useful features of Python 3+ that aren't always emphasized.

## Force only named arguments to functions

In the below example, arguments following the splat `*` must be supplied
as named arguments.

This is somewhat intuitive if you're used to Pythons splat operator for
`*args` or `**kwargs`. Here, the lonely splat "catches" positional arguments
passed to the function after its introduction in the definition string.

```
def function(positional, *, named_only0, named_only1):
  # do some things
  return

def only_takes_named_args(*, named_only0, named_only1):
  # do some things
  return
```

This is useful when defining functions that may have arguments added and removed
over time, explicitly preventing code from relying on the positional order.

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

## Add an empty dimension by indexing

You can add an empty dimension of size `1` to an `np.ndarray` by passing `None` to one of the axes while indexing.

```python
A = np.random.random((3,3))

B = A[:, :, None]
print(B.shape) # (3, 3, 1)

C = np.expand_dims(A, -1)
print(C.shape) # (3, 3, 1)

np.all(B == C) # True
```

# Pandas

## Split a column by a text delimiter

Use `.str.split`

```python
# split by a '-' delimiter
# split is a pd.DataFrame, with each delimited column separated out
split = df.str.split('-', expand=True)
```

## Replicate each row in a DataFrame *N* times

Use the `.values` attribute of a DataFrame and `np.repeat`

```python
N = 3 # times to replicate
newdf = pd.DataFrame(np.repeat(df.values, N, axis=0))
newdf.columns = df.columns
```

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

## Create editable, uncropped PDF exports

```python
import matplotlib
# ensure text in PDF exports is editable.
matplotlib.rcParams['pdf.fonttype'] = 42
matplotlib.rcParams['ps.fonttype'] = 42
# prevent the PDF from being clipped to the "figsize".
# NOTE: this is different than `plt.tight_layout()`
# despite the similar name.
matplotlib.rcParams['savefig.bbox'] = 'tight'
```

## Rotate Seaborn axis labels

```python
g = sns.barplot(...)
g.set_xticklabels(g.get_xticklabels(), rotation=45)
```

## Plot a line with a continuous color variable

Use a `matplotlib.collections` `LineCollection` to plot a set of smaller lines
each with a different color, as desired.

[StackOverflow Credit](https://stackoverflow.com/questions/10252412/matplotlib-varying-color-of-line-to-capture-natural-time-parameterization-in-da/10253183#10253183)

```python
import numpy as np
from matplotlib import pyplot as plt
from matplotlib.collections import LineCollection

x  = np.sin(np.linspace(0, 2*np.pi, 100))
y  = np.cos(np.linspace(0, 2*np.pi, 100))
t = np.linspace(0,1,x.shape[0]) # your "time" variable

# set up a list of (x,y) points
points = np.array([x,y]).transpose().reshape(-1,1,2)
print points.shape  # Out: (len(x),1,2)

# set up a list of segments
segs = np.concatenate([points[:-1],points[1:]],axis=1)
print segs.shape  # Out: ( len(x)-1, 2, 2 )
                  # see what we've done here -- we've mapped our (x,y)
                  # points to an array of segment start/end coordinates.
                  # segs[i,0,:] == segs[i-1,1,:]

# make the collection of segments
lc = LineCollection(segs, cmap=plt.get_cmap('viridis'))
lc.set_array(t) # color the segments by our parameter

# plot the collection
fig, ax = plt.subplots(1,1)
ax.add_collection(lc) # add the collection to the plot
ax.set_xlim(x.min(), x.max()) # line collections don't auto-scale the plot
ax.set_ylim(y.min(), y.max())
```

## Add a label to heatmap colorbars in `seaborn`

```python
seaborn.heatmap(data,
  cbar_kws={'label': 'colorbar title'})
```

## Remove space between subplots

This is useful when plotting a grid of images.

```python
H, W = 2, 2
fig, ax = plt.subplots(H, W)
fig.subplots_adjust(hspace=0.020,
                    wspace=0.00005)
for i in range(4):
  ax[i//2, i%2].imshow(I)
  ax.set_xticks([])
  ax.set_yticks([])
```

## Remove axis spines from a `matplotlib` plot

```python
fig, ax = plt.subplots(H, W, figsize=(h, w))
ax[idx].spines['right'].set_visible(False)
# `.spines` keys are {'left', 'right', 'top', 'bottom'}
```

## Animate an image

```python
from matplotlib import animation, rc

fig, ax = plt.subplots(1, 1, figsize=(10,10))
# remove white frame around image
fig.subplots_adjust(left=0, bottom=0, right=1, top=1, wspace=None, hspace=None)

im = ax.imshow(data, animated=True)


def updatefig(idx):
    im.set_array(new_data_iterable[idx])
    return im

anim = animation.FuncAnimation(
  fig, # figure with initialized artists
  updatefig, # updating function
  frames=100, # number of iterations, passes `range(0, frames)` to `updatefig`
  interval=1e3/30, # ms between frames, i.e. 1e3/FPS for a FPS argument
  blit=True) # drawing optimization

# if in a Jupyter notebook, the HTML module can display the animation inline
from IPython.display import HTML
HTML(anim.to_html5_video())
```

## Add a row/column color legend to seaborn clustermap

[Credit](http://dawnmy.github.io/2016/10/24/Plot-heatmaap-with-side-color-indicating-the-class-of-variables/)

```python
# define some row clusters
row_clusters = get_row_clusters(data) # np.ndarray, np.int

# set up a LUT to assign colors to `row_clusters`
pal = sns.color_palette('tab20')

# make a clustermap
clmap = sns.clustermap(
  ...,
  row_colors = pal[row_clusters]
)

for label in np.unique(clusters):
    clmap.ax_col_dendrogram.bar(0,
                                0,
                                color=pal[label],
                                label=label,
                                linewidth=0)
clmap.ax_col_dendrogram.legend(loc="center", ncol=5, frameon=False)
```

## Add a second set of xticklabels to a seaborn heatmap

```python
fig, ax = plt.subplots(1, 1, ...)

sns.heatmap(
  ...,
  ax=ax
)

# clone the x-axis
ax2 = ax.twiny()
ax2.set_xlim(ax.get_xlim())
ax2.set_xticks(ax.get_xticks())
ax2.set_xticklabels(SOME_NAMES_HERE)

# clean up the plotting aesthetics introduced by the second axis
plt.grid(b=None)

for x in ['top', 'bottom', 'right', 'left']:
    ax.spines[x].set_visible(False)
    ax2.spines[x].set_visible(False)
```

# LaTeX

I love LaTeX.
LaTex does not love me back.
Here are some snippets to make our relationship more functional.

## Use if/then control flow in a LaTeX build

```latex
\usepackage{etoolbox}
% defines \newtoggle, \settoggle
\newtoggle{somevar} % set a new boolean variable
\toggletrue{somevar}
\togglefalse{somevar}

% run an if then
\iftoggle{somevar}{
  % do thing
}{
  % else, do other thing or blank for nothing
}
```

## Generate a custom bibtex style

```bash
# outputs
#   some_name.dbj - instructions for making a `bst`
#   some_name.bst - compiled `bst`
latex makebst
# to remake a `bst` from the `dbj`
tex some_name.dbj # outputs some_name.bst
```

## Remove numbers or citation labels from reference list

[SE Credit](https://tex.stackexchange.com/questions/35369/replace-or-remove-bibliography-numbers)

```latex
\makeatletter
\renewcommand\@biblabel[1]{}
\makeatother
% we can also replace numbers with a common character, like a bullet
\makeatletter
\renewcommand\@biblabel[1]{\textbullet}
\makeatother
```

## Customize figure captions

```latex
\usepackage{caption}
% remove separator between "Figure XYZ" and caption.
% print the figure number, but no caption
% useful for separating figures and captions in journal proofs
% e.g. "Figure 1", the caption text is suppressed
\captionsetup{labelsep=none,textformat=empty}
% use normal caption text, colon figure separator
% e.g. "Figure 1: Caption text here"
\captionsetup{labelsep=colon,textformat=plain}
```

## Suppress graphics

Journals often want captions and figures separated in a final proof.
We can insert captions without graphics by redefining the `includegraphics` command.

```latex
\renewcommand{\includegraphics}[2][]{}
```
