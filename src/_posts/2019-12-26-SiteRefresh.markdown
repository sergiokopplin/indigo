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

- [ ] Finish converting codeblocks to Nord theme (finish the SASS)
- [ ] Fix codeblock border
- [ ] Convert site color scheme into Nord.
- [ ] Figure out why SASS won't accept variables imported from SCSS?
- [x] Get code blocks centered
- [ ] Figure out why Jekyll/Kramdown is not converting fence blocks and only relying on Liquid-defined code blocks.


## Code Blocks

One thing that I find myself more particular about these days is the humble
code block. I want these things to look _good_, so I'm going to do my best
to make that happen. I'm going to put down an example code block here
just for visualization purposes.

I wanted to introduce a Nord-themed syntax highlighting into the site. For this
I needed to make reference to the following repo whose author has already 
done a great work in implementing the theme as CSS for Rogue/Pygments.

I make the slight variation on theme theme by going with dark backgrounds,
instead of white, for legibility. 

{% highlight python %}
import os
import sys

from torch immport nn
import torch.nn.functional as F

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
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

```python
import os
import sys

from torch immport nn
import torch.nn.functional as F

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
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
```

## Double Checking Math Again

Is my math working? I really hope so. For instance, if $a \in \mathbb{R}$,
then we can hope for
$$ |a| \leq |a+a|.$$