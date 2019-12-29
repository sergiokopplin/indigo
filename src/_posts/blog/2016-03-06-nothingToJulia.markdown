---
title: "Nothing to Julia in Minutes"
layout: post
date: 2016-04-06 00:00
tag: 
- post
- build
- software
- Julia
- Jupyter
- Python
category: blog
author: erictramel
description: Starting up with Julia for the first time.
---

# Nothing to Julia in Minutes

## OS X Command Line Tools
The first step before doing anything else will be to make sure that we have our OS X basic command-lined dev tools. You probably won't use these tools far into the future, but having these will allow us to bootstrap into the software we want later.

### Install
Run the following command in `Terminal`.

```bash
computer-name:~ xcode-select --install
```

## Homebrew
The starting point for managing our installs will be Homebrew. Homebrew is a 
great tool for finding, installing, and upgrading open source tools on OS X. 

### Install
The easiest way to install this is via the terminal. Just copy paste the 
following into the terminal.

```bash
computer-name:~ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Subsequently, we'll need to make sure that everything is updated.

```
computer-name:~ brew update; brew upgrade;
```

The call to `update` should make sure that our current list of packages managed by Brew is updated. Subsequently, `upgrade` will update all currently installed packages.

## Julia
Julia...what can we say. A thing of beauty. Let get her running. 

### Install
For my part, I've had some historical problems building Julia from source on OS X. I think that most of these issues have been resolved. However, the build process can also be quite slow. So, instead, lets take a look at grabbing the pre-built binaries and linking to those as needed. 

[**Get the Julia v.0.4.5 DMG here**](http://julialang.org/downloads/).

Double click the DMG and drag `Julia-0.4.5.` into your applications folder.

### Running (Easy)
The easiest thing to do at this point is to double click the `Julia-0.4.5.` 
application. It should open up a REPL window saying something like the following
at the top:

```
   _       _ _(_)_     |  A fresh approach to technical computing
  (_)     | (_) (_)    |  Documentation: http://docs.julialang.org
   _ _   _| |_  __ _   |  Type "?help" for help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 0.4.5 (2016-03-18 00:58 UTC)
 _/ |\__'_|_|_|\__'_|  |  Official http://julialang.org/ release
|__/                   |  x86_64-apple-darwin13.4.0

julia> 
```

Much like Python and Matlab, Julia ships with an interactive scripting 
environment which allows you run commands one at a time and investigate the 
results to your hearts content. Matlab-like options such as `whos()` also exist. There are some other advanced features of the REPL that we'll cover later (such as running bash commands).

## Jupyter
Jupyter is a visual environment for composing Julia, Python, and R scripts. 
One can write code in line with figures and TeX text, which makes it a really 
nice for sharing results back and forth with others as well as for keeping notes for yourself.

### Install

#### 1. `python`
We want to make sure that we have a version of Python that we can actually play
with. Unfortunately, the one given to us by the OS X devtools does not like to 
place nice with others. Lets get Python 3  as well as some buildtools 
via Homebrew.

```bash
computer-name:~ brew install python3
(...build output...)
```

#### 2. `jupyter`
From here we should be able to use `pip3` to install `jupyter`.

```bash
computer-name:~ pip3 install jupyter
```

### Usage
Now we should have jupyter installed on the system. To run Jupyter and create a notebook from terminal, you should now be able to simply run

```bash
computer-name:~ jupyter notebook
```

which will open up a browser window to the home directory for Jupyter.

### Julia Kernel for Jupyter
Since Jupyter is general across a number of different possible languages, we need to configure Jupyter for using our current instally of Julia. To do this, we will open up Julia and install the [IJulia.jl](https://github.com/JuliaLang/IJulia.jl) package. We can do this from Julia by running

```julia
julia> Pkg.add("IJulia")
julia> Pkg.build("IJulia")
```

## Plotting Libraries

### `matplotlib`
Certainly one of the most important libraries to install. We can install the Python package `matplotlib` and use it in Julia in the following manner. First, lets make sure that we have a copy external to Julia by installing `matplotlib` via `pip3`.

```bash
computer-name:~ pip3 install matplotlib
```

Next, lets install a couple of packages within Julia to call `matplotlib` from within a Julia script. 

```julia
julia> Pkg.add("PyCall")
julia> Pkg.build("PyCall")
julia> Pkg.add("PyPlot")
julia> Pkg.build("PyPlot")
```

And voilà, we're done! Julia has a nice interface for interacting with Python libraries, which we will see in the future. 


## Scikit-Learn
We will also be taking advantage of some features of Scikit-Learn, so lets install that as well. Again, we can install Scikit-Learn both exeternally on our system, and also allowing for internal references to the Scikit libraries from within Julia. First, lets install Scikit via `pip3`...

```bash
    computer-name:~ pip3 install scikit-learn
```

So now we have a Scikit for use from our Python3 build. But also, lets install a copy for Julia. We will make use of the [ScikitLearn.jl](https://github.com/cstjean/ScikitLearn.jl) wrapper to ease calling Scikit funcitons from within Julia (though we could also do this directly via PyCall.jl). To ease some common build problems, we will use the `Conda.jl` wrapper of the python Conda package manager to create a Julia-local copy of Scikit-learn. Then we'll install the wrapper package and be done.

```julia
julia> Pkg.add("Conda")
julia> Pkg.build("Conda")
julia> Conda.add("scikit-learn")
julia> Pkg.add("ScikitLearn")
julia> Pkg.build("ScikitLearn")
```

We can test to make sure that we have it working via

```julia
julia> using ScikitLearn
julia> @sk_import datasets: load_digits
julia> data = load_digits()
Dict{Any,Any} with 5 entries:
  "images"       => 1797x8x8 Array{Float64,3}:…
  "target_names" => [0,1,2,3,4,5,6,7,8,9]
  "data"         => 1797x64 Array{Float64,2}:…
  "DESCR"        => "Optical Recognition of Handwritten Digits Data Set\n===========================…
  "target"       => [0,1,2,3,4,5,6,7,8,9  …  5,4,8,8,4,9,0,8,9,8]
```

Lets have some fun and use ASCII Plots to show us an image of some digits

```julia
julia> Pkg.add("ASCIIPlots")
julia> using ASCIIPlots
julia> imagesc(squeeze(data["images"][1,:,:],1))


        + @## +
        @#@## @#+
      + @#+   @##
      + @#    # #
      + #     # #
      + @#  + @##
      + @#+ # @#
        # @##


julia> imagesc(squeeze(data["images"][8,:,:],1))


        # # @#@#@#+
        # # + # @#
            # @#+
      + # # @#@##
      + # @#@#+
          @##
        # @#+
        @##

```

Seems to work!