---
title: "Kotlin + Node.js example"
layout: post
date: 2017-03-19 20:00
tag:
- kotlin
- Nodejs
image: /assets/images/kotlin-logo-text.png
headerImage: true
opensource: true
projects: false
hidden: true # don't count this post in blog pagination
description: "Node.js REST API server in Kotlin"
category: project
author: miquel
externalLink: false
---

Source Code: [https://github.com/miquelbeltran/kotlin-node.js](https://github.com/miquelbeltran/kotlin-node.jsi)

This project contains a Node.js application implemented in Kotlin 1.1.

It uses Express and Request Node libraries to implement a REST API that
retreives data from Amazon, while using the Kotlin standard library.

This project is part this blog post: [Your first Node.js app with Kotlin]({{ site.url }}/kotlin-nodejs).

## Code Sample

{% highlight kotlin %}
external fun require(module:String):dynamic

fun main(args: Array<String>) {
    println("Hello JavaScript!")

    val express = require("express")
    val app = express()
    val amazon = Amazon()

    app.get("/", { req, res ->
         res.type("text/plain")
         res.send("i am a beautiful butterfly")
    })
    app.get("/amazon/:asin", { req, res ->
         res.type("text/plain")
         amazon.getAmazonPrice(req.params.asin) {
             res.send("Price is $it")
         }
    })
    app.listen(3000, {
         println("Listening on port 3000")
    })
}
{% endhighlight %}

