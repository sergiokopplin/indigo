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

## logging

The python `logging` module offers granular control over user facing feedback.

Generally, we want to create a `logger` object for each module with the convention:

```python
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO) # or logging.DEBUG etc. to set logger priority

logger.debug("This is a low priority statement, useful for debugging.")
logger.info("This is a medium priority statement, issued during normal program behavior.")
logger.warn("This is a high priority statement, not emitted during normal behavior.")
```

Using `logging` with IPython kernels can get tricky. 
In general, the following settings are sufficient to override any kernel defaults and give you the expected behavior.

```python
import logging
import sys
logging.basicConfig(level=logging.INFO, stream=sys.stdout) # note level can be set as desired
```

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

## Connect two points with a curve

To connect two points in a plot with a curved line, we use `scipy.interpolate.CubicSpline` to interpolate a continuous series of points along a cubic function between the two points.

```python
from scipy.interpolate import CubicSpline

points = np.array(
  [
    [0, 0],
    [1, 0],
  ],
)

# draw curve connecting start and destinations
xvals = np.linspace(x[0], x[1], 100)
# generate a coordinate at the midpoint to set the middle
# position of our arc
x_coords = [
  points[0, 0],
  points[0,0] + (points[1,0]-points[0,0])/2,
  points[1,0],
]

# ensure that the x_coords sequence is increasing
if x_coords[-1] < x_coords[0]:
    x_coords = x_coords[::-1]

# set a midpoint a bit above the two lower points
y = [0, 0.1, 0]

# generate smoothed values
spline = CubicSpline(x_coords, y)
y_smooth = spline(xvals)

# plot the original points
ax.scatter(points[:, 0], points[:, 1])

# plot the smooth curve
ax.plot(xvals, y_smooth, color='lightgray', linestyle='--', alpha=0.5,)
ax.set_ylim(bottom=0.05, top=0.15)
ax.set_xlim(-0.1, 1.1)
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

# note that the usual .ax_col_dendrogram.set_visible(False)
# will also hide our new legend.
#
# hides the dendrogram while preserving the legend.
cm.ax_col_dendrogram.set_ylim(0,0)
cm.ax_col_dendrogram.set_xlim(0,0)
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

## Generate box plots where outline colors match the fill hue

It's often hard to see the colors of a `hue` in a boxplot if the data distribution is compact.
We can change the outline color for the boxes to match the inner fill to make the colors easier to see.

[StackOverflow](https://stackoverflow.com/questions/55656683/change-seaborn-boxplot-line-rainbow-color)

```python
import matplotlib.pyplot as plt
import matplotlib.colors as mc
import colorsys
import seaborn as sns

def lighten_color(color, amount=0.5):  
    """
    Generate a slightly lighter version of a specified color.
    These often look nice as outlines.
    credit: @IanHincks
    """
    try:
        c = mc.cnames[color]
    except:
        c = color
    c = colorsys.rgb_to_hls(*mc.to_rgb(c))
    return colorsys.hls_to_rgb(c[0], 1 - amount * (1 - c[1]), c[2])

# make a box plot
sns.boxplot(
    data=some_df,
    x='something',
    y='something_else',
    hue='third_thing',
    ax=ax
)

# iterate over every artist in the axis and change the outline colors
# to match the fill colors
for i,artist in enumerate(ax.artists):
    # Set the linecolor on the artist to the facecolor, and set the facecolor to None
    # omit `lighten_color` to make the outline flush with the box
    col = lighten_color(artist.get_facecolor(), 1.2)
    artist.set_edgecolor(col)    

    # Each box has 6 associated Line2D objects (to make the whiskers, fliers, etc.)
    # Loop over them here, and use the same colour as above
    for j in range(i*6,i*6+6):
        line = ax.lines[j]
        line.set_color(col)
        line.set_mfc(col)
        line.set_mec(col)
        line.set_linewidth(0.5)
```

# Jupyter 

These snippets make life easier inside Jupyter notebooks.

## Add a python `virtualenv` as a Jupyter kernel

```bash
# install ipykernel if it is not installed already
pip install ipykernel
# add the kernel to the jupyter kernelspec
export KERNEL_NAME="my_virtualenv"
python -m ipykernel install --user --name=${KERNEL_NAME}
```

# Virtual Environments

You should probably set up all projects with their own `python` virtual environment for reproducibility.
Unfortunately, these don't always play nicely with cluster environments if you need multiple `python` versions.
Here are a few tips to make life easier.

## Generate a hard-copy virtual environment

If you want to use a `python` version that's not installed globally on every node in a cluster, you'll want to copy rather than link the necessary base python binaries and libraries.  
This is simple enough using `venv` in `python>=3.3`.

```bash
export PY_VER="some_python_version"
export ENV_NAME="some_environment_name"
# `--copies` with copy the relevant python binaries
${PY_VER} -m venv --copies ${ENV_NAME}
# however, it *won't* copy the standard library!
# so you'll get funny `ModuleNotFoundError`s if you run on
# a node that doesn't have ${PY_VER} in `/usr/lib` et. al.
cp -Rv /usr/lib/${PY_VER}/* ${ENV_NAME}/lib/${PY_VER}/
# you'll also have to set the PYTHONPATH and PYTHONHOME manually
# when you activate the venv on cluster nodes
# e.g.
export PYTHONPATH="$(realpath ${ENV_NAME})/lib/${PY_VER}:$(realpath ${ENV_NAME})/lib/${PY_VER}/lib-dynload"
export PYTHONHOME=${PYTHONPATH}
# we can add these to `bin/activate` to make life easier
export TEST='# set PYTHONPATH and PYTHONHOME to account for copied standard library\nexport PYTHONPATH="/home/jacob/bin/envs/scvi-tools-0.9/lib/python3.9"\nexport PYTHONPATH="/home/jacob/bin/envs/scvi-tools-0.9/lib/python3.9/lib-dynload"\nexport PYTHONHOME=${PYTHONPATH}\n#these will be reset to the original values by `deactivate()` above'
cp ${ENV_NAME}/bin/activate ${ENV_NAME}/bin/activate.backup
sed -i s/export\ PS1\nfi/export\ PS1\nfi\n\n${TEST}/g ${ENV_NAME}/bin/activate
```

# Genomics Tools

Genomics has its own set of standard tools, and it can be baffling to remember all the useful one-liners each tool offers.
Here are some useful snippets to bring some sanity to bioinformatics workflows.

## NCBI Datasets

Acquiring information about genes of interest (e.g. expressed sequences, encoded proteins) is a common task in genomics.
Going from a list of gene symbols to a set of relevant sequences in FASTA file used to be a bit of a pain.

The new NCBI Datasets tool is surprisingly easy to use and delivers all the information you could want on a given gene symbol.

For example, if we want to get the proteins endoded by the myogenic regulatory factors, we can do so in a couple lines of `bash`.

```bash
datasets download gene symbol --taxon mouse \
	Myod1 Myog Myf5 Myf6
unzip ncbi_dataset.zip
less ncbi_dataset/data/protein.faa
```

## GSE/SRA-tools

Most next-generation sequencing data generated in the USA is submitted to the Gene Expression Omnibus.
Getting access to the raw sequencing reads is a bit trickier than you'd think.
For collecting data from GEO, we largely rely on `sra-tools`.

### Download FASTQs associated with a GEO submission

This one-liner will find all the FASTQ files associated with a project in GEO then use `fastq-dump` to download associated reads as `.fastq.gz` files.

[Biostars Credit](https://www.biostars.org/p/111040/#113204)

```bash
 # set a project ID
PROJECT_ID=PRJNA600730
esearch -db sra -query $PROJECT_ID  | efetch --format runinfo | cut -d ',' -f 1 | grep SRR | xargs fastq-dump --split-files --gzip
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

## Ensure figures and tables only appear after the insert position

The `flafter` package prevents any floats (figures, tables) from being presented above the position in the code where they are inserted.
This is useful for ensuring a float appears below the relevant section title, or to ensure it doesn't insert too early in the paper and give away your punchline before you're ready.

```latex
\usepackage{flafter}
```

## Shrink pdflatex output size

`pdflatex` tends to render huge PDF outputs.
My understanding is that `pdflatex` is very conservative and applies no compression scheme.
Substantial improvements in the file size can be found with loseless or modest lossy compression.

Ghostscript is installed by default on most Unix systems and does a good job of reducing file size on its own.

```bash
gs \
  -sDEVICE=pdfwrite \
  -dCompatibilityLevel=1.5 \
  -dPDFSETTINGS=/printer \
  -dNOPAUSE -dQUIET \
  -dBATCH \
  -sOutputFile=small.pdf big.pdf
```

The `/printer` argument will render 300 dpi compressed images that generally look great.
If you need more compression, try swapping `/ebook` in place of printer.
The images will still be legible, but you'll almost certainly notice compression artifacts.

Another approach is to use a third-party tool [`pdfsizeopt`](https://github.com/pts/pdfsizeopt).

After installation, compression is a one-liner.

```bash
/path/to/pdfsizeopt big.pdf
```

`pdfsizeopt` tends to get a smaller file size with better Ghostscript with the `/printer` setting, but it takes much longer to execute.
