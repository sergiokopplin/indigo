---
title: "Site Refresh, 2019"
layout: post
date: 2019-12-26 00:00
tag:
  - post
  - site
category: blog
author: erictramel
description: Refreshing the personal site after a few years.
---

It has come time, **once again**, to revisit the personal site. Now, with a few 
more years of experience, and some more time for the tools to develop, it seems
a nice time to refresh the content, make sure things are up to date, and to
tweak the presentation a bit so that it is more to my liking.

## TODOS

- [x] Finish converting codeblocks to Nord theme (finish the SASS)
- [x] Fix codeblock border
- [x] Convert site color scheme into Nord.
- ~~[ ] Figure out why SASS won't accept variables imported from SCSS?~~
- [x] Get code blocks centered
- ~~[ ] Figure out why Jekyll/Kramdown is not converting fence blocks and only relying on Liquid-defined code blocks.~~
- [x] Fix MathJax header script to use the right AMS formatting.


## Building & Previewing Site

I ran into a big barrier on Day 1 of this expedition: I simply _could not_ get
a working version of Ruby on my local machine to behave and build the site. There
were many version conflicts, and then my Brew-installed Ruby was fighting and 
conflicting with the MacOS system Ruby, and Gems were getting installed in 
unknown locations, etc.

To overcome this, I went with a docker solution. Specifically, running the 
`jekyll/builder` image with the right ports exposed. 

{% highlight bash %}
$ cd path/to/repo
$ docker run --rm \
 --publish 35729:35729 \
 --publish=4000:4000 \
 --volume="$PWD:/srv/jekyll" \
 -it jekyll/builder:$JEKYLL_VERSION \
 jekyll serve --config _config.yml,_config-dev.yml
{% endhighlight %}

I put this together in the new `serve` script.

## Code Blocks

One thing that I find myself more particular about these days is the humble
code block. I want these things to look _good_, so I'm going to do my best
to make that happen. I'm going to put down an example code block here
just for visualization purposes.

I wanted to introduce a Nord-themed syntax highlighting into the site. For this
I needed to make reference to the [following repo](https://github.com/nnooney/jekyll-theme-nn) where
Nicolas Nooney has already done a great work in implementing the theme as CSS for Rogue/Pygments.
However, I wasn't able to get the SCSS->SASS importing of variables to work
properly, so I migrated this content into `_sass/base/variables.sass` in order
to make the color settings global to the entire site (and not just to the
syntax highlighter!)

I make the slight variation on theme theme by going with dark backgrounds,
instead of white, for legibility. To be able to control the styling of the 
code block backgrounds, the colors need to be changed within the 
global SASS, `_sass/base/general.sass`.

{% highlight python %}
import os
import sys

from torch immport nn
import torch.nn.functional as F

class Net(nn.Module):
    """A Network
    
    A Neural Network that does something.
    """ 
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        # This is a single line comment
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 16 * 5 * 5)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

net = Net()
if __name__ == "__main__":
    print(Net())
{% endhighlight %}


### Getting Fence Blocks to Work?

Somewhere along the way, we have lost the ability to be able
to get proper syntax highlighting when using markdown code fence
blocks. This means that one has to use the Liquid notation format
(which is a big bummer)! So, why are Jekyll and Kramdown not
working together to process down these fenced code blocks properly?

Notably, the documentation for Jekyll is pretty bad, as well as
that of Kramdown. So we are left with searching around on the
internet to see if we can find anything at all to help us answer
this question. I found [this reference](https://github.com/jekyll/jekyll/issues/4619#issuecomment-191267346) in a closed
issue. Perhaps it will be informative?

After a lot of work, I really couldn't find the reason why it isn't playing
nice. This means that I just can't use fenced code blocks for the time being :(
Is this a problem with the Jekyll version? For some reason when running 
bundler, it insists on an older `jekyll==3.8.5`. Perhaps there is some version
clash going on and I'm missing some patches?

For now, as I want to move on, I'll use the liquid settings :(

## Double Checking Math Again

Is my math working? I really hope so. For instance, if $$a \in \mathbb{R}$$,
then we can hope for

$$ |a| \leq |a+a|.$$

It seems like MathJax is a little bit broken in its original formulation. Specifically,
it seems like the `\mathbb` is not working, but this is probably due to the wrong
script being used for the MathJaX configuration in the header.

## Revisiting Publications

In the original implementation of the site, I used the same `post` layout
for blog posts _as well as_ publication pages. Since most of the publication
page is boilerplate, this meant a lot of by-hand editing of the individual
pages to make them conform. This is painful and a bad idea! This is exactly
why Jekyll has **layouts**.

Honestly, I don't know why I didn't do this in the first place. Probably I was
just too new to the entire process to be able make a good decision about it
in the first place.

Now the majority of the publication pages are auto-generated from some 
preamble YAML. It still leaves open the possibility of also including some 
custom content on each page, which will be included after the abstract if desired.

To be able to do this, I needed to also start using the `category` property
from Jekyll, making sure that these pages are separated out distinctly and 
handled distinctly from the general blog posts.

### Adding More Content

Additionally, I had a number of works to include into the list since the 
last time I refreshed the publication list in 2016. Finally, I also have tried
to do my best to dig up all of the slides, presentations, papers, etc. that I
could for these different works. My hope is that this page can serve to finally
tie up all of these loose ends. If not for anyone else, then at least for 
_myself_. Honestly, it is hard to be able to dig up my own content to be 
able to refer back to later!

## Nord Theme & SASS

This time around, I have spent _a lot_ of time with the SASS/SCSS of the site.
Previously, I never touched this stuff. Especially back in 2016, when the entire
formatting ran off of CSS, it seemed just a nightmare to be able to dig into.
Especially for me as a front-end neophyte.

However, with the more recent inclusion of SASS support into Jekyll, it has been
a little bit fun, actually, to learn more about CSS and how to format content
properly. I also have grown to appreciate the SASS structure layout that the
Indigo theme authors put together.