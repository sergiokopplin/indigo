---
title: "Your first Node.js app with Kotlin"
layout: post
date: 2017-03-19 20:00
image: /assets/images/mastering-firebase.png
headerImage: false
tag:
- kotlin
- node.js
category: blog
author: miquel
description: Create a simple REST API in Kotlin that compiles to JavaScript and runs on Node.js
---

![Title](/assets/images/nodejs.png)

Originally published in [my Medium blog](https://medium.com/@Miqubel/your-first-node-js-app-with-kotlin-30e07baa0bf7#.v8gsms66q).

---

Node is a powerful, JavaScript based, platform for building server side
applications with ease. From a Slack Bot to a lightweight REST API or push
notification services with Firebase.

Kotlin is a next-generation programming language by the great people of
JetBrains, which is gaining popularity with the Android development community
as a replacement for old good Java.

I won’t talk about why you might like to consider Kotlin in your Android
projects, but rather how can you use Kotlin, instead of JavaScript, to build
Node.js applications.

This guide is more aimed for Android developers who want to do a first step
into Node.js development, and it is based on my own experiences building a
Slack bot with it.

Code available here: [https://github.com/miquelbeltran/kotlin-node.js](https://github.com/miquelbeltran/kotlin-node.js)

## Node.js

Your first step will be installing Node in your system. Node comes with a handy
package manager called npm. Once you have installed Node.js follow these steps
to configure your project.

On your empty project folder, create a Node project with:

{% highlight bash %}
npm init
{% endhighlight %}

Install the Kotlin dependency:

{% highlight bash %}
npm install kotlin --save
{% endhighlight %}

Finally, for this example, you will create a small REST API using ExpressJS.
Add the ExpressJS library with:

{% highlight bash %}
npm install express --save
{% endhighlight %}

Your Node.js project is now setup. Time to add the Kotlin part.

## Kotlin

It is always a good idea to [take a look at the official documentation](https://kotlinlang.org/docs/tutorials/javascript/getting-started-gradle/getting-started-with-gradle.html) and see
how you can setup a Kotlin project to target JavaScript. My recommendation is
to use Gradle, rather than an IDEA based project, as we are already familiar
with it thanks to Android development. Remember that you’ll need to install
Gradle manually.

Your `gradle.build` file should look like this:

{% highlight groovy %}
group 'node-example'
version '1.0-SNAPSHOT'

buildscript {
    ext.kotlin_version = '1.1.1'
        repositories {
            mavenCentral()
        }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin2js'

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib-js:$kotlin_version"
}

compileKotlin2Js.kotlinOptions {
    moduleKind = "commonjs"
        outputFile = "node/index.js"
}
{% endhighlight %}

Setting the `kotlinOptions` is essential. `moduleKind` must be set to
`commonjs` to work with Node, and I also recommend to change the outputFile
destination too something easy to type.

Your Kotlin source code should be placed in the directory `src/main/kotlin/`

Let’s create your first Kotlin file here.

external fun require(module:String):dynamic

{% highlight kotlin %}
fun main(args: Array<String>) {
    println("Hello JavaScript!")

        val express = require("express")
        val app = express()

        app.get("/", { req, res ->
                res.type("text/plain")
                res.send("i am a beautiful butterfly")
                })

    app.listen(3000, {
            println("Listening on port 3000")
            })
}
{% endhighlight %}

In this code example, I load the ExpressJS library, I create a GET endpoint
that returns “I am a beautiful butterfly” as response, and listens on port
3000.

## Let’s run

First, you’ll have to compile your Kotlin code to JS with Gradle.

{% highlight bash %}
gradle build
{% endhighlight %}

A JavaScript file will be generated in `node/index.js` which contains your
Kotlin code compiled to JavaScript.

Now, start your Node server.

{% highlight bash %}
node node/index.js
{% endhighlight %}

It works! You can go to [http://localhost:3000](http://localhost:3000) to check
that your server is running.

## In Summary

Kotlin is not the only language that can be compiled to JavaScript, but it’s a
language that you might already know thanks to it’s increasing popularity among
Android developers. If it happens that you are already playing with it, now you
have no excuse to explore other usages.

If you are an independent Android developer, having the power to quickly create
micro-services can help you a lot to enhance your applications.

As you saw by this guide, building a small service took minutes, with barely
any boilerplate code and you can use the same IDE you are already familiar
with.


