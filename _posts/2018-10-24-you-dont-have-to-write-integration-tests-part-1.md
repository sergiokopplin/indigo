---
title: "You Don't Have to Write Integration Tests, Part 1"
layout: post
date: 2018-10-24
image: /assets/images/markdown.jpg
headerImage: false
tag:
- integration
- testing
category: blog
author: andrew
description: Why integration tests aren't the best and how to avoid them.
---

*Work in Progress*

In his seminal post
[*Integrated Tests are a Scam*](https://blog.thecodewhisperer.com/permalink/integrated-tests-are-a-scam),
J. B. Rainsberger explains how the completeness of integration (or "integrated") tests lure developers into a trap.
Integration tests require a complex development environment, they are slow, and they are imprecise. They cover a broad
swath of your codebase and make it hard to pinpoint buggy code.

However, used sparingly, integration tests are a powerful tool. A limited number of integration tests that ensure the
proper function of your most common use-cases can catch bugs from unexpected changes in a dependency. At the very
least, they serve as sanity checks that give developers confidence in a continuously-deployed (CD) workflow.

In this post I'll explain how you can apply integration tests to your project with minimal impact on your workflow. In a follow-up, I'll showcase a great tool for avoiding integration tests except when absolutely necessary.

# Firstly, What is an Integration Test?

In my own words,

> An integration test ensures your service uses code from another repository to produce expected results.

When testing your own code, you have the freedom to write your code that it is easily testable. E.g., instead of writing a function like

    func NewPersonFromFile(path string) (Person, error)

which can only be tested after creating a file, you could write

    func NewPersonFromFile(contents io.Reader) (Person, error)

which could be tested like

    p, err := NewPersonFromFile(strings.NewReader(`{"name":"Andrew"}`))

Things get tricky when testing the integration of your code with code in another repository. You are not responsible for the design of this code. It may be very unfriendly to testing. Perhaps it only works if you provide a working database instance, or some other complex resource.

These are the important and unavoidable cases when your testing environment must get (uncomfortably) more complicated than what is provided by `go test`. This is when we resort to integration tests.

# Writing Integration Tests for Minimal Impact

While writing integration tests, we must be vigilant in reducing the performance impact these tests have on the execution of our unit tests and the duration of our CI and CD builds as a whole. I'll illustrate some useful tactics to achieve this goal with an example.

**TODO: finish**
