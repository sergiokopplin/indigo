---
title: "FlickPlayer - Master's Thesis"
layout: post
date: 2017-03-02 20:45
image: /assets/images/markdown.jpg
headerImage: false
tag:
- iPad
- video
star: false
projects: true
category: project
author: kchromik
description: Video navigation with gesture-based interaction
---

The scope of my master's thesis project was the implementation and evaluation of a gesture-based video player. By definition the user should be able to navigation within a video by using flick gestures, which means a fast slide across the screen. This behaviour is already used by mobile devices to navigate within a list. By using flick gestures, the video playback accelerates, same as scrolling of a list does. Compared to the [SwiPlayer]({{ site.baseurl }}{% post_url 2017-03-01-swiplayer %}) the user doesn't loose visual information by navigating to a different position in the video.

![Flickplayer Image]({{ site.url }}/assets/images/projects/flickplayer.png)

### Features
* dynamic playback speed
* indication for current playback speed
* up to 32x faster than regular playback
* reversed playback

### Implementation
* Objective-C
* iOS SDK
* AVFoundation
* FFmpeg

### Demovideo

<iframe width="560" height="315" src="https://www.youtube.com/embed/aEx7hCEQA2c" frameborder="0" allowfullscreen></iframe>

---
### Master's Thesis
I successfully defended my master's thesis in April 2016. A copy of my thesis can be downloaded here: [Master's Thesis]({{ site.url }}/files/thesis.pdf)

### Publications:

Klaus Schoeffmann, Marco A. Hudelist, Bonifaz Kaufmann and Kevin Chromik, **“Interactive Search in Video: Navigation With Flick Gestures vs. Seeker-Bars”**, In Proceedings of the 2016 International Conference on Multimedia Modeling (MMM ’16). Springer, Switzerland.

[link](http://link.springer.com/chapter/10.1007%2F978-3-319-27671-7_31) - [preprint]({{ site.url }}/files/flickplayer_preprint.pdf)
