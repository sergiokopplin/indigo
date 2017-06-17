---
title: "The costs of Kotlin Android Extensions"
layout: post
date: 2017-06-17 17:00
image: /assets/images/kotlin-android-extensions.png
headerImage: false
tag:
- kotlin
- android
category: blog
author: miquel
description: The new Kotlin Android Extensions simply binding views on Android but with a cost
---

![Title](/assets/images/kotlin-android-extensions.png)

I am a big fan of the Kotlin Android Extensions as they helped me to get rid of
copious amounts of boilerplate code.

[Kotlin Android Extensions - Kotlin Programming Language](https://kotlinlang.org/docs/tutorials/android-plugin.html)

Thanks to it you can access to views directly referencing them by the Id.

However while I was implementing a ViewHolder I wanted to check how efficient
is to use these extensions inside the bind method.

Here’s an example of a ViewHolder that uses a TextView using the Kotlin Android
Extensions directly.

<script src="https://gist.github.com/miquelbeltran/27206811864ab2efbb224570888d76a9.js"></script>

This apparently simple ViewHolder becomes very expensive without realization.
We can decompile the Kotlin code to Java to see what is happening under the
hood.

`Go to Tools > Kotlin > Show Kotlin Bytecode and then click on Decompile`

<script src="https://gist.github.com/miquelbeltran/4147089a9bea0fcc2938456eeacb74f3.js"></script>

Accessing to itemView.title is actually performing
itemView.findViewById(R.id.title) and this is exactly what you want to avoid in
a ViewHolder.

Let’s move the call to itemView.title to the class construction:

<script src="https://gist.github.com/miquelbeltran/a3475649772587531d49eb37ff900d24.js"></script>

Now let’s take a look at the new Java decompiled code:

<script src="https://gist.github.com/miquelbeltran/bf7dd91fae28b7a19e497ac43ecb34ae.js"></script>

As you can see, the findViewById is done on the constructor method and not on
each bind call.

It wasn’t 100% for me on the documentation if findViewById was
being called once, always or never. Compared to ButterKnife, where the View
binding only happens once, the Kotlin Android Extensions can be a source of
performance issues if used incorrectly.

Be careful (“ten cuidao”) on those
parts of code where performance matters, don’t be afraid of decompiling the
Bytecode to Java to understand it better.
