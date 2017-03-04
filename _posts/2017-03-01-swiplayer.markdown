---
title: "SwiPlayer - Swipe Video Player"
layout: post
date: 2017-03-01 20:45
image: /assets/images/markdown.jpg
headerImage: false
tag:
- iPad
- video navigation
star: false
projects: true
category: project
author: kchromik
description: A swipe gesture-based video player for the Apple iPad
---

# A swipe gesture-based video player for the Apple iPad

As part of my master's studies I had to design and implement a video player for the Apple iPad, which uses gestures controls only. The concept of the navigation within a photo library on a smartphone or tablet has been transferred to video navigation. A horizontal swipe gesture allows the user to jump temporary to a next/previous sequence in the video. Depending on the vertical position of the finger, the time interval of the scene jump adapts dynamically, which enables the user to execute fast but less detailed navigation.

![SwiPlayer Image]({{ site.url }}/assets/images/projects/swiplayer.png)

### Features
* long-press on thumbnail triggers a short preview
* left/right swipe gesture for intra-video navigation
* dynamic intra-video navigation, depending on vertical position of the gesture
* two-finger tap to pause/resume video
* horizontal swipe to navigate to next/previous video
* playback of videos synchronized via iTunes
* playback of videos from camera roll

### Implementation
* Objective-C
* iOS SDK
* AVFoundation

### Demovideo

<iframe width="560" height="315" src="https://www.youtube.com/embed/yy1TqMIPIYw" frameborder="0" allowfullscreen></iframe>

---
### Publications:

Klaus Schoeffmann, Kevin Chromik, and Laszlo Boeszoermenyi. **Video navigation on tablets with multi-touch gestures**. In Multimedia and Expo Workshops (IC- MEW), 2014 IEEE International Conference on, pages 1–6. IEEE, 2014.

[IEEE](http://ieeexplore.ieee.org/document/6890560/) - [preprint]({{ site.url }}/files/swiplayer_preprint.pdf)
