---
title: "From Zero to One with Node"
layout: post
date: 2020-02-02
image: /assets/images/node.png
headerImage: false
tag:
- development
- node
- nodejs
- javascript
category: blog
author: andrew
description: How to write an executable program in Node.
---

# What is Node?
`node` is an interpreter, like `python`, `bash`, or `ruby`.

It's unique in that it interprets a language with a different name. That is, while `python`
interprets Python and `bash` interprets Bash, `node` interprets JavaScript.

Node is also known as Node.js.

# How Do I Install It?
Like most interpreters, it comes in different versions, so you'll want to install it with
a version manager. I recommend [`n`](https://github.com/tj/n).

# Which Version Do I Use?
I recommend the latest stable version, which you can equip with
```bash
n stable
```

Note that this will also make `npm` available. `npm` is important to managing Node projects.

# How Do I Start a Project With It?
```bash
mkdir project
cd project
npm init  # answer prompts, just use defaults
# You may want to set `license` in `./package.json` to `UNLICENSED`
# Set `main` in `./package.json` to `src/index.js`
```

Now you're ready to start writing code in the program's entrypoint, `src/index.js`. You'll need to
create this file.

# What Does "Hello, world!" Look Like?
`src/index.js`:
```javascript
const main = async () => {
    console.log("Hello, world!");
};

main()
    .then(() => process.exit(0))
    .catch(reason => {
        console.log(reason.message);
        process.exit(1);
    });
```

`package.json`:
```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

Then run
```bash
npm start
```

# How Do I Split My Project Into Multiple Files?
`src/helper.js`:
```javascript
const getGreeting = () => "Hello, world!";
module.exports.getGreeting = getGreeting;
```

`src/index.js`:
```javascript
const helper = require("./helper");

const main = async () => {
    console.log(helper.getGreeting());
};

...
```

# How Do I Use a Dependency?
You can find dependencies on [NPM's website](https://www.npmjs.com/).

You can install one with
```bash
npm i $package_name
```

Like
```bash
npm i node-fetch
```

This will create a `package-lock.json`. Add it to version control.

It will also create `node_modules/`. Do not add it to version control. Add it to your
`.gitignore`.

You can use a dependency in your source like:
```javascript
const fetch = require("node-fetch");
```

# How Do I Format My Code?
```bash
npm i --save-dev prettier
```

`package.json`:
```json
{
  "scripts": {
    "format": "./node_modules/.bin/prettier --write src/**"
  }
}
```

Then run
```bash
npm run format
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
