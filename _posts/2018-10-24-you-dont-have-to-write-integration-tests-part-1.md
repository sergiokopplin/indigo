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

When testing your own code, you have the freedom to write code that is easily testable. E.g., instead of writing a function like

    func NewPersonFromFile(path string) (Person, error)

which can only be tested after creating a file, you could write

    func NewPersonFromFile(contents io.Reader) (Person, error)

which could be tested like

    p, err := NewPersonFromFile(strings.NewReader(`{"name":"Andrew"}`))

Things get tricky when testing the integration of your code with code in another repository. You are not responsible for the design of this code. It may be very unfriendly to testing. Perhaps it only works if you provide a working database instance, or some other complex resource.

These are the important and unavoidable cases when your testing environment must get (uncomfortably) more complicated than what is provided by `go test`. This is when we resort to integration tests.

# Writing Integration Tests for Minimal Impact

While writing integration tests, we must be vigilant in maintaining the ease-of-use and performance of our developer workflow. I'll illustrate some strategies with an example.

Let's say we are testing the integration of our service with PostgreSQL, a popular database. Before we added PostgreSQL to our project, we ran our unit tests with this `make` target:

    test:
      go test ./...

To test integration with our new PostgreSQL component, we add a dependency to our `test` target:

    test: db
      go test ./...

    db:
      docker-compose up -d

with the following `docker-compose.yml`:

    db:
      image: postgres:9.6
      ports: [‘5432:5432’]

This provides our tests with a PostgreSQL instance contained in a Docker image.

## Why Docker?

Why are we using a Docker image for this? Why not just run a PostgreSQL server on our development machine? There's a few reasons.

Firstly, we improve developer portability by simplifying development environment setup. If we required a developer to provide a PostgreSQL server running on their development machine, they would need to
1. install PostgreSQL
1. configure PostgreSQL to provide the appropriate roles, passwords, and databases for the test environment
1. launch the server and keep it running

A PostgreSQL Docker container, on the other hand, can be completely configured on the command-line (`docker run ...`) or, in our case, in a `docker-compose.yml`. The user need not install PostgreSQL: Docker will pull the requisite images for them.

Lastly, Docker images are easy to start, stop, destroy, and restart. It's easy to guarantee that the PostgreSQL instance will have a fresh state for a test case to run on.

A PostgreSQL server running on the host, however, may be used by other applications on the developer's machine. It's hard to know what state the server will have before a test case runs.

## Why Docker Compose?

Why do we use `docker-compose` instead of `docker run`? Firstly, a `docker-compose.yml` file is a readable way of configuring Docker containers. For example, if we need our PostgreSQL instance to provide a database with the name `my-database`, we can have

    db:
      image: postgres:9.6
      ports: ['5432:5432']
      environment:
        POSTGRES_DB: my-database

Secondly, Docker containers launched via Docker Compose are named according to the filepath of the `docker-compose.yml` from which they are launched. A `postgres` image launched by your project's `docker-compose.yml` will not conflict with any other `postgres` images running on a development machine.

Thirdly, the `docker-compose` command has subcommands for interacting with containers launched from the respective `docker-compose.yml`. This allows you to get precise results from the containers you care about. For example, while `docker ps` will present information about all of the containers running on your system, `docker-compose ps` only presents the containers in your `docker-compose.yml`.

In this way, launching containers via `docker-compose` provides automatic organization of your containers per-project, and eases the operation and analysis of these containers.

# Back to the example, how do we maintain a rapid develop-test-evaluate loop?

Integration tests are necessary for keeping trust in a CI/CD workflow, but they seriously hamper a developer's ability to iterate on their unit test suite. While a system can run hundreds of unit tests in parallel at a lightning-fast pace, even just a few integration tests can slow testing down to minutes.

The solution is easy: only run the integration tests when you need to:

    test:
      go test $$(go list ./... | grep -v -e integration)

    integration: db
      go test ./integration/...

Here we separate our integration tests into an `integration` package and eliminate that package from our `make test` command.

In this way a developer may run a (hopefully) comprehensive unit test suite with `make test` and get back results immediately. The `integration` target can be saved for the rare moments when we require a new contract from our dependencies, or it could be run exclusively by CI.

# Look forward to Part 2

That's all for now, but in Part 2 I'll explain a useful tactic for avoiding integration tests altogether. Look forward to it!
