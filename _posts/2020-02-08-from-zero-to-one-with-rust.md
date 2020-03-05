---
title: "From Zero to One with Rust"
layout: post
date: 2020-02-08
image: /assets/images/rust.png
headerImage: false
tag:
- development
- rust
category: blog
author: andrew
description: How to write an executable program in Rust.
---

# What is Rust?
[Rust](https://www.rust-lang.org/) is a compiled programming language.

# How Do I Get the Compiler?
Like most compilers, the Rust compiler is available in different versions. Unlike most
compilers, its authors came prepared.

The Rust compiler is installed with a version management tool. The version management tool
is installed with its own installer. Install the installer with:
```bash
brew install rustup
```

Install the version manager with
```bash
rustup-init
```

Use the default installation. Add `$HOME/.cargo/bin` to your path.

You may now use `rustup`, the Rust version manager.

# Which Version Do I Use?
I recommend the latest stable version, which you can install with
```bash
rustup update  # update the version manager
rustup toolchain install stable
```

You can equip it with
```bash
rustup default stable
```

You now have the latest stable Rust package manager on your PATH. It's
called `cargo`.

# How Do I Start a Rust Project?
```bash
cargo new hello-world
cd ./hello-world
```

Note that the command initializes a git repository with a `.gitignore`.

# What Does "Hello, world!" Look Like?
You just created it.

`src/main.rs`:
```rust
fn main() {
    println!("Hello, world!");
}
```

`Cargo.toml`:
```toml
[package]
name = "hello-world"
version = "0.1.0"
authors = ["Andrew Sharp <me@sharpandrew.com>"]
edition = "2020"
```

Then run
```bash
cargo run
```

If this is your first time running the app, you'll get a new
file at `./Cargo.lock`. Version-control it.

# How Do I Split My Project Into Multiple Files?
In Rust parlance, we create a new *module*. We're going to call it `helper`.
`src/helper.rs`:
```rust
pub fn get() -> String {
    return "Hello, world!".to_string();
}
```

`src/main.rs`:
```rust
mod helper;

fn main() {
    println!("{}", helper::get());
}
```

# How Do I Split My Project Into Multiple Directories?
Just like before, we're going to create another *module*. But this one will be one
file in its own directory.
`src/another_helper/get.rs`:
```rust
pub fn get() -> String {
    return "Goodbye, world!".to_string();
}
```

`src/another_helper/mod.rs`:
```rust
pub mod get;
```

`src/main.rs`:
```rust
mod helper;
mod another_helper;

fn main() {
    println!("{}", helper::get());
    println!("{}", another_helper::get::get());
}
```

# How Do I Use a Dependency?
Rust calls its packages *crates*. You can find crates on [crates.io](https://crates.io/).
A crate's page will include a line for your `Cargo.toml`. Install the [`log`](https://crates.io/crates/log)
crate like so:

```toml
[package]
...

[dependencies]
log = "0.4.8"
```

Then update the lockfile with
```bash
cargo build
```

You can use a crate in your source like:

`src/helper.rs`:
```rust
pub fn get() -> String {
    log::info!("helper::get");
    return "Hello, world!".to_string();
}
```

Note there's no import statement.

# How Do I Format My Code?
```bash
cargo fmt
```

# How Do I Run Unit Tests?
```bash
npm i --save-dev jest
```

`package.json`:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

For a file `./src/helper.json`:
```javascript
const f = () => "Hello, world";
module.exports.f = f;
```

Have this test file at `./src/helper.test.json`:
```javascript
const helper = require("./helper");

test('greeting says hello', () => {
  expect(helper.f()).toBe('Hello, world');
});
```

Then run
```bash
npm t
```
