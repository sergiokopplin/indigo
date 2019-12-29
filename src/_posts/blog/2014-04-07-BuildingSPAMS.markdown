---
title: "Building SPAMS"
layout: post
date: 2014-04-07 00:00
tag: 
- post
- build
- software
- Matlab
- optimization
category: blog
author: erictramel
headerImage: false
description: Building the SPAMS Matlab package for sparse modelling.
---

For one of our projects, we wanted to have a nice set of “optimized” software for running a number of different types of sparse reconstruction problems. One nice set of software that runs for both signal reconstruction and for dictionary learning/sparse decomposition is the **SPArse Modeling Software (SPAMS)** package for Matlab developed by J. Mairal, F. Bach, J. Ponce, G. Sapiro, R. Jenatton, and G. Obozinski with additional support from J. Chieze for the R and Python interfaces.

The package is currently hosted on [INRIA’s open platform](http://spams-devel.gforge.inria.fr), where you can download the latest, as of this writing, **v. 2.4**.

Because the heavy-hitting portions of the system are written in C++, a compilation/building step is required to get SPAMS generate the MEX files Matlab will call when using the package. However, I found that there are a number of issues in getting the package running since the release of this last version on OSX – Mavericks. I wanted to detail the steps I had to go through to get the package to work.

## First Attempt
So, after downloading and extracting SPAMS, I went ahead and ran the `compile.m` Matlab script. There are a few options to be aware of inside the compilation script...

```matlab
clear all;
get_architecture;

%%%%%%%%%%%%% COMPILER CONFIGURATION %%%%%%%%%%%%%%%%
% set up the compiler you want to use. Possible choices are
%   - 'mex' (default matlab compiler), this is the easy choice if your matlab
%           is correctly configured. Note that this choice might not compatible
%           with the option 'use_multithread=true'. 
%   - 'icc' (intel compiler), usually produces the fastest code, but the
%           compiler is not free and not installed by default.
%   - 'gcc' (gnu compiler), good choice (for Mac, use gcc >= 4.6 for
%           the multi-threaded version, otherwise set use_multithread=false).
%           For windows, you need to have cygwin installed.
%   - 'open64' (amd compiler), optimized for opteron cpus.
%   - 'vs'  (visual studio compiler) for windows computers (10.0 or more is recommended)
%            for some unknown reason, the performance obtained with vs is poor compared to icc/gcc
compiler='mex';

 %%%%%%%%%%%% BLAS/LAPACK CONFIGURATION %%%%%%%%%%%%%%
% set up the blas/lapack library you want to use. Possible choices are
%   - builtin: blas/lapack shipped with Matlab, 
%           same as mex: good choice if matlab is correctly configured.
%   - mkl: (intel math kernel library), usually the fastest, but not free.
%   - acml: (AMD Core math library), optimized for opteron cpus
%   - blas: (netlib version of blas/lapack), free
%   - atlas: (atlas version of blas/lapack), free,
% ==> you can also tweak this script to include your favorite blas/lapack library
blas='builtin';

%%%%%%%%%%%% MULTITHREADING CONFIGURATION %%%%%%%%%%%%%%
% set true if you want to use multi-threaded capabilities of the toolbox. You
% need an appropriate compiler for that (intel compiler, most recent gcc, or visual studio pro)
use_multithread=false; % (might not compatible with compiler=mex)
% if the compilation fails on Mac, try the single-threaded version.
% to run the toolbox on a cluster, it can be a good idea to deactivate this

use_64bits_integers=true;
% use this option if you have VERY large arrays/matrices 
% this option allows such matrices, but may slightly reduce the speed of the computations.

% if you use the options 'mex' and 'builtin', you can proceed with the compilation by
% typing 'compile' in the matlab shell. Otherwise, you need to set up a few path below.

add_flag='';
% WARNING: on Mac OS  mountain lion, you may have to uncomment the line
%add_flag=' -mmacosx-version-min=10.7'
```

For the initial base compile, I went ahead and left the compiler as `mex` and turned off the multithreaded support. I just want to get something working, so efficiency is not the chief concern at the moment. Running `compile.m` gives the following output...

```matlab
>> compile
compilation of: -I./linalg/ -I./decomp/ -I./prox/ -I./dictLearn/ dictLearn/mex/mexTrainDL.cpp
In file included from dictLearn/mex/mexTrainDL.cpp:36:
In file included from ./linalg/mexutils.h:14:
In file included from /Applications/MATLAB_R2013b.app/extern/include/mex.h:58:
In file included from /Applications/MATLAB_R2013b.app/extern/include/matrix.h:252:
/Applications/MATLAB_R2013b.app/extern/include/tmwtypes.h:831:9: error: unknown type name 'char16_t'
typedef char16_t CHAR16_T;
        ^
In file included from dictLearn/mex/mexTrainDL.cpp:37:
In file included from ./dictLearn/dicts.h:35:
./decomp/decomp.h:2:1: warning: '/*' within block comment [-Wcomment]
/* Software SPAMS v2.2 - Copyright 2009-2011 Julien Mairal 
^
1 warning and 1 error generated.

    mex: compile of ' "dictLearn/mex/mexTrainDL.cpp"' failed.

Unable to complete successfully.

Error in compile (line 390)
    mex(args{:});
```

There appear to be some issues with a core Matlab mex-specific header file. That doesn’t seem good. So a little digging around turned up a [Stack-Exchange thread on this topic](http://stackoverflow.com/questions/22367516/mex-compile-error-unknown-type-name-char16-t). The core issue seems to be that the latest updates to C++ have not yet propagated to Matlab properly. There are two possible work-arounds:

1. Modify your `mexopts.sh` settings script.
2. Modify the offending line in header file, itself (not a great solution).

I went with the first approach. It probably pays to have a healthy fear of messing with the innards of Matlab.

## Updating `mexopts.sh`

This is the most direct approach. All one needs to do is to update the `CXXFLAGS` flag in the script by adding the additional option `-std=c++11`. For me, this was **l. 150** in `mexopts.sh`.

So, we change from

```bash
CXXFLAGS="-fno-common -fexceptions -arch $ARCHS -isysroot $MW_SDKROOT -mmacosx-version-min=$MACOSX_DEPLOYMENT_TARGET"
```

to

```bash
CXXFLAGS="-fno-common -fexceptions -arch $ARCHS -isysroot $MW_SDKROOT -mmacosx-version-min=$MACOSX_DEPLOYMENT_TARGET -std=c++11"
```

Now, re-running `compile.m` I get

```matlab
>> compile
... a bunch of warnings and notes ...

compilation of: -I./linalg/ -I./prox/ prox/mex/mexSimpleGroupTree.cpp
prox/mex/mexSimpleGroupTree.cpp:33:22: error: non-constant-expression cannot be narrowed from type
      'int' to 'mwSize' (aka 'unsigned long') in initializer list [-Wc++11-narrowing]
   mwSize cdims[] = {n};
                     ^
prox/mex/mexSimpleGroupTree.cpp:33:22: note: override this message by inserting an explicit cast
   mwSize cdims[] = {n};
                     ^
                     static_cast<mwSize>( )
1 error generated.

    mex: compile of ' "prox/mex/mexSimpleGroupTree.cpp"' failed.

Unable to complete successfully.

Error in compile (line 390)
    mex(args{:});
```

Now, this appears to be an issue with the way narrowing is handled between the previous and the current version of C++. So, lets take mex’s advice and investigate this line.

## Modifying `prox/mex/mexSimpleGroupTree.cpp`

Taking a look at the compiler error messages, we see that we should take a look at **l. 32** of `prox/mex/mexSimpleGroupTree.cpp`. Here, we see that I’ve commented out the previous version and inserted an updated version which uses the suggested type-conversion rather than an *assumed* narrowing.

```c
int n = dims[1];
// Old way -- This throws errors for c++11
// mwSize cdims[] = {n};
// Updated way -- Maybe no errors ??
mwSize cdims[] = {static_cast<mwSize>(n)};
```

Now, we run `compile.m`...

```matlab
>> compile
... many warnings and notes...

1 warning generated.
compilation of: -I./linalg/ -I./decomp/ decomp/mex/mexSparseProject.cpp
compilation of: -I./linalg/ linalg/mex/mexBayer.cpp
compilation of: -I./linalg/ -I./prox/ prox/mex/mexGraphOfGroupStruct.cpp
compilation of: -I./linalg/ -I./prox/ prox/mex/mexGroupStructOfString.cpp
compilation of: -I./linalg/ -I./prox/ prox/mex/mexReadGroupStruct.cpp
compilation of: -I./linalg/ -I./prox/ prox/mex/mexSimpleGroupTree.cpp
compilation of: -I./linalg/ -I./prox/ prox/mex/mexTreeOfGroupStruct.cpp
>> 
```

And so we have ***success*** :) . At this point, for me, all the SPAMS test scripts in the `test_release` directory work.

## Summary

The basic steps to follow to get SPAMS to build on OSX Maverics:

1. Change `CXXFLAGS` in `mexopts.sh` to include the option `-std=c++11`.
2. Modify line 32 of `prox/mex/mexSimpleGroupTree.cpp` to `mwSize cdims[] = {static_cast<mwSize>(n)};`.
