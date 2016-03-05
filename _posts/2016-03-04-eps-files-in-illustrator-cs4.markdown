---
title: "Opening EPS files on Adobe Illustrator CS4 (Mac)"
layout: post
date: 2016-03-04 09:00
tag: tips-and-tricks
blog: true
draft: true
summary: "A trick to opening EPS files in Adobe Illustrator CS4 on a Mac"
permalink: eps-files-in-illustrator-cs4
---

Today, I ended up having to take a 2 hour detour for something I thought would be a simple process - download a free 'swoosh' vector graphic I found online (it's a long story why I needed a swoosh graphic, but suffice it to say I did), split it up into individual graphics and export it to a .png for use in a project.

I found a perfect swoosh graphic set ([this one](http://www.vecteezy.com/vector-art/106447-different-type-of-business-banners). I clicked the 'Free Download' button, which downloaded a zip file containing an EPS file and a JPEG screenshot of the graphic.

Now, I own a copy of Adobe CS4 suite from a long, long time ago, and have both Illustrator and PhotoShop installed on my Mac for one-off projects that might suddenly need a fully featured photo or vector editor. I figured it would be a simple matter of double-clicking the EPS file, it would open in Illustrator, and life would be good.

I double-clicked the file, and it opened the file in the Preview application, giving me a flat, unusable image that I couldn't edit in a vector format.

To force the file to open in Illustrator, I fired up the application, browsed over to the location of the EPS file, and opened it. That's when I encountered this error.

<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/eps-illustrator/illustrator-error.png" /></div>

I breathed deep, and proceeded to google this error.

Let's just say that the general tone of the advice I found online was "Get Creative Cloud, you cheapskate!".

Well.

This was for one tiny project, that ought to have taken me an hour or two, max, to get done. I definitely wasn't going to buy Creative Cloud for that.

Then I remembered a trick I'd picked up from Nathan Yau of Flowing Data in this post on [Making Bubble Charts](https://flowingdata.com/2010/11/23/how-to-make-bubble-charts/) in R and cleaning them up in Illustrator. In Step 5, Nathan mentions saving his R export as a PDF and opening it up in Illustrator for further editing.

When I initially double-clicked the EPS file, Preview seemed to 'convert' it, which I assumed was just a way of saying it was struggling to show me the contents, but all this while, it was converting the EPS to PDF!

<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/eps-illustrator/converting-eps.png" /></div>

<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/eps-illustrator/converted-to-pdf.png" /></div>

**Perfect.**

So, here's how to get around the problem of opening EPS files in CS4 (Mac only). 

1. Open the EPS file in Preview. This should be as simple as double-clicking it, but if you have EPS assigned to open in Illustrator, just make sure you get it to open in Preview instead.

2. Wait for Preview to convert the file to PDF format.
<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/eps-illustrator/converting-eps.png" /></div>

3. Save the file as a PDF
<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/eps-illustrator/save-as.png" /></div>

4. Fire up the Illustrator application, and open the newly saved PDF in Illustrator.

5. You may see this error. This conversion may be causing some loss of color or shading, but it wasn't too significant.
3. Save the file as a PDF
<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/eps-illustrator/open-error.png" /></div>

5. And there you have it. From an EPS file, to an editable vector graphic in Illustrator CS4.
<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/eps-illustrator/editable.png" /></div>
