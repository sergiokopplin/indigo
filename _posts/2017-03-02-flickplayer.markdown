---
title: "FlickPlayer - Master's Thesis"
layout: post
date: 2017-03-02 20:45
image: /assets/images/markdown.jpg
headerImage: false
tag:
- iPad
- video
- thesis
star: false
projects: true
category: project
author: kchromik
description: Video navigation with flick-based interaction
---

The scope of my Master thesis' project was the implementation and evaluation of a gesture-based video player. By definition, the user should be able to navigate within a video by using flick gestures, which means a fast slide across the screen. This behaviour is already used by mobile devices to navigate within a list. By using flick gestures, the video playback accelerates, in the same way the scrolling of a list would do. Compared to the [SwiPlayer]({{ site.baseurl }}{% post_url 2017-03-01-swiplayer %}) the user doesn't lose visual information by navigating to a different position in the video.

Through a user study, the prototype has been evaluated and compared to a standard video player. The results of this study can be found in my [thesis](#thesis) or reading the [paper](#paper) about this project, which has been published in the International Conference on Multimedia Modeling in 2016.

![Flickplayer Image]({{ site.url }}/assets/images/projects/flickplayer.png)

### Features
* dynamic playback speed
* indication for current playback speed
* up to 32x faster than regular playback
* maximum playback without visible frame drops
* reversed playback
* indication of current position

### Implementation
* Objective-C
* iOS SDK
* AVFoundation
* FFmpeg

### Demovideo

<iframe width="560" height="315" src="https://www.youtube.com/embed/aEx7hCEQA2c" frameborder="0" allowfullscreen></iframe>

---
### Master's Thesis <a name="thesis"></a>
I successfully defended my master's thesis in April 2016. A copy of my thesis can be downloaded here: [Master's Thesis]({{ site.url }}/files/thesis.pdf)

### Publications: <a name="paper"></a>

Klaus Schoeffmann, Marco A. Hudelist, Bonifaz Kaufmann and Kevin Chromik, **“Interactive Search in Video: Navigation With Flick Gestures vs. Seeker-Bars”**, In Proceedings of the 2016 International Conference on Multimedia Modeling (MMM ’16). Springer, Switzerland.

[link](http://link.springer.com/chapter/10.1007%2F978-3-319-27671-7_31) - [preprint]({{ site.url }}/files/flickplayer_preprint.pdf)
