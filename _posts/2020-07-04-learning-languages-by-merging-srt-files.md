---
title: Learning Languages by Merging SRTs
image: /assets/img/blog/20200704/bottombig.png
description: >
   How to merge subtitles and improve
   your language skills.
---

I've found that one of the most efficient ways to learn a foreign
language is to watch movies and TV-series with subtitles.
Specifically both foreign audio and subtitles.

After a course on German grammar and lots of [EasyGerman](https://www.youtube.com/channel/UCbxb2fqe9oNgglAoYqsYOtQ)
on YouTube, I decided to start watching German shows with German subtitles.
I felt I was learning a lot, but I could make it better.

What I liked about EasyGerman is that their videos show both German and English
subtitles. Understandably, though, most movies and TV-series offer
one language only. Let me show you a few ways to merge two .srt together in one.

## Before that, where do I find subtitles?

Nowadays there are [multiple](https://www.opensubtitles.org/en/search/subs) databases
online for that. Some even allow you to simply drop your video file unto them and it will
show you all related .srts.

## What if I have an .mkv with embedded subtitles?

You first need to extract your .srt from the .mkv's tracks. You can use [this](https://mkvtoolnix.download/index.html).

## First method: Online Services

There are a lot of [websites](https://pas-bien.net/2srt2ass/) that allow you to upload 
two .srt and merge them. I've tried a bunch, however there are a few problems:

 - Some merge into a different format that is not as nice to work with.
 - Some don't allow you to put both subtitles at the bottom. They just assume that
 one will be on top.
 - Some have trouble with different encodings.
 
You are welcomed to try them, but I've found it easier to just solve this problem on my own.
 
![Full-width image](/assets/img/blog/20200704/topbottom.png){:.lead data-height="800" align="center"}
Not very good. Hard to read both.
{:.figure}

## Second method: A Bit Of Python
 
Our goal is very simple: associate each foreign subtitle with its translation and append
the latter to the former.

Requirements:

 - [Python](https://www.python.org/)
 - [srt](https://pypi.org/project/srt/) which will allow you to import each subtitle in a structured 
 format. Install it by `pip install srt`

```python
# subs.py

# We first need to read from both .srt and create the new file

import srt

ger = open("german.srt", "r")
gerC = ger.read()

eng = open("english.srt", "r")
engC = eng.read()

new = open("germanenglish.srt", "w+")


# Then we need the list of properly structured subtitles data

eng_sub_gen = srt.parse(engC)
eng_subs = list(eng_sub_gen)

ger_sub_gen = srt.parse(gerC)
ger_subs = list(ger_sub_gen)

 
# Now we simply match translations based on the second at which 
# each subtitle appears

for es in eng_subs:
    for gs in ger_subs:
        if es.start.seconds == gs.start.seconds:
            gs.content = f"{gs.content}\n{es.content}"

print(srt.compose(ger_subs))

new.write(srt.compose(ger_subs))
new.close()
```

Now you simply need to rename your srts as shown in code, put both in the same directory
as the python file, and execute `python subs.py` from your command line.

![Full-width image](/assets/img/blog/20200704/bottom.png){:.lead data-height="800" align="center"}
Much better.
{:.figure}

While not perfect and quite rudimentary, it works out pretty well. 

Use it with any language you want to learn with your favorite TV-series!
