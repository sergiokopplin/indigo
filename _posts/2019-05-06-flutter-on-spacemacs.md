---
title: Flutter on Spacemacs
image: /assets/img/blog/20190506/dlanor-s-703975-unsplash.jpg
description: >
   How I tried to reproduce a VSCode-like
   experience for Flutter on Spacemacs.
---

What happens if we mix a really good emacs distribution with a natively-compiled, 
cross-platform app development framework? 

Awesomeness.

Just a little disclaimer first:

I've been developing in Flutter on my own for the last few months and I've only 
picked up Spacemacs recently. I'm just curious, and I wanted to get out of the 
comfort zone. Having tried both VS Code and Android Studio I was wondering how 
emacs would perform.

Despite being a newbie in both Flutter and Spacemacs I was able to pick up both 
relatively quickly, and I was soon developing at the same speed (actually faster)
than I was with VS Code.

Also, this doesn't want to be a Spacemacs guide. Check [the official one](https://github.com/syl20bnr/spacemacs/blob/master/doc/BEGINNERS_TUTORIAL.org)
out if your are looking for that.  This is just a brief guide on how to make 
Flutter development possible on Spacemacs.

## What? VS Code and Android Studio work. Why should I try this?

Well, I guess because you can?

Plus, emacs is awesome.

I've always been intrigued by both vim and emacs. Not having to rely on my mouse
to navigate through code sounded appealing. Flutter is by design inclined to 
lots of nested code, so I thought that having a system to edit and navigate 
through code really fast would especially come in handy.

## What is Spacemacs, anyway?

It's essentially a community-driven emacs config that comes bundled with [evil](https://github.com/emacs-evil/evil). 
It allows you to have immediate access to a usable emacs experience without 
necessarily learning elisp.

* * *

# Install packages

Before installing packages you should make sure that both Flutter and Dart SDKs
are added to your PATH. Flutter's tutorial already goes over how to add Flutter to your 
PATH, but you also have to add Dart's, which comes bundled with Flutter.

```
export PATH="$HOME/.pub-cache/bin:$PATH"
export PATH="$HOME/.../flutter/bin/cache/dart-sdk/bin:$PATH"
export PATH="$HOME/.../flutter/bin:$PATH"
```

## dart 

Spacemacs gives you immediate access to a number of layers that you can
add to your __dotspacemacs-configuration-layers__.

If you switch to spacemacs' develop branch - as you should, anyway - then you'll
be able to add the following under configuration-layers:

```elisp
(dart :variables
      dart-enable-analysis-server t
      dart-format-on-save t)
```

This will enable dart-mode in Spacemacs and allow format on save.

## flutter

Obviously. While there is no Flutter Spacemacs layer as with Dart, there is an
awesome emacs [package](https://github.com/amake/flutter.el) - aptly named 
flutter - on Melpa. In order to use it, you need to simply add __flutter__ 
under __dotspacemacs-additional-packages__ in your .spacemacs config file.

What this package essentially does, is it gives you access to the Flutter commands
that you are already familiar with.

Press __SPC SPC__ or __M-x__ to insert a command in Spacemacs while on a Dart file,
and insert __flutter-run__. This will open a new buffer on your current window
where you can check as your app is being compiled and loaded on the device.
You can now use the inspector (flutter-inspector or just type i), 
check the widget hierarchy (flutter-widget-hierarchy - t), bring up the performance 
overlay (flutter-performance-overlay - P) and so on. Most importantly you can
__hot-reload__ with __r__ and __restart__ with __R__. Needless to say you can
remap all of this.

![Full-width image](/assets/img/blog/20190506/flutter.png){:.lead data-width="800" align="center"}
Yes, I like white themes.
{:.figure}

## LSP

Language Server Protocol (LSP) defines the protocol between an IDE and a language server. 
It provides auto-completion as well as documentation through lsp-ui.

You can look it up [here](http://develop.spacemacs.org/layers/+tools/lsp/README.html).

Add __lsp__ under configuration-layers.

You will also need to create a hook for dart-mode. Add the following under your
__dotspacemacs/user-config__:

```elisp
(add-hook 'dart-mode-hook 'lsp)
```

## highlight-indent-guides

Flutter apps will inevitably contain lots of nested widgets. This package will 
allow you to see at a glance what a closing bracket refers to. Spacemacs by 
default matches opening and closing brackets' colors, sort of like Rainbow
brackets in VS code, but this makes it clearer.

Just add __highlight-indent-guides__ under __dotspacemacs-additional-packages__ and the
following under user-config:

```elisp
(add-hook 'prog-mode-hook 'highlight-indent-guides-mode)
(setq highlight-indent-guides-method 'character)
```

<div align="center">
	<img src="/assets/img/blog/20190506/highlight.png">
</div>

## evil-commentary

This is just a handy package that quickly comments out code. It can automatically
comment an entire paragraph without having to highlight it in visual mode first
(although you can also do that).

Add __evil_commentary__ under __dotspacemacs-additional-packages__.

Type __gcap__ to comment a paragraph, or highlight a text in visual mode and then 
type __gc__.

<div align="center">
	<img src="/assets/img/blog/20190506/evil-commentary.gif">
</div>

## useful config for smartparens

This isn't actually a package, just a config for smartparens, which is already
included in Spacemacs. Add this under your user-config:

```elisp
(with-eval-after-load 'smartparens
  (sp-local-pair 'dart-mode "(" nil :post-handlers
            '(:add (spacemacs/smartparens-pair-newline-and-indent "RET")))
  )
```

It makes it easy to create a new widget by creating and indenting a new line after
you press __RET__ on an opening parenthesis.

* * *

# Useful tricks

There are a bunch of commands that I've found useful when developing in Flutter.

## % to select, move and delete widgets

If you develop in Flutter, you often find yourself having to select an
entire widget tree in order to move it, or delete it.

This is the perfect situation to use __%__. It allows you to jump from an opening
bracket (round, curly or square) to its corresponding closing bracket.

<div align="center">
	<img src="/assets/img/blog/20190506/trickselect.gif">
</div>

You can then type __d__ to delete the widget and then type __p__ to paste it wherever 
you want. After a few tries you'll become really fast.

## SPC v to expand region

This really cool Spacemacs command allows you to select an expanding region of text
very quickly. You could use it as an alternative to __%__, but without having to 
go at the top (or bottom) of the region first.

Type __SPC v__ to enable it, and then keep pressing __v__ to expand the region, or 
__V__ to contract it.

<div align="center">
	<img src="/assets/img/blog/20190506/trickSPCv.gif">
</div>

## > and < to indent and outdent

Pretty simple, but can come in handy. Select your code and then 
type __>__ to indent or __<__ to outdent the code.

<div align="center">
	<img src="/assets/img/blog/20190506/trickindent.gif">
</div>

## , G e to show errors

Remember that Visual Studio Code would let you see all the errors generated
inside your Flutter project, as well as all your todos? Well, you can get that 
on Spacemacs too.

While working on a dart file - which means that you have activated dart's major
mode on emacs - type in sequence __, G e__ (or __, g e__) to open the list of errors. 
You can move through the list buffer just like you would on a normal file, 
and press __RET__ to open that file in the last window used.

<div align="center">
	<img src="/assets/img/blog/20190506/trickerrors.gif">
</div>

## , ? and , g d to look at documentation/implementation

If you need to look at a doc, you can type __, ?__ on the name of the class/function
to open its relevant documentation in a mini-buffer on the bottom. You can 
also open the class implementation on a separate buffer by typing __, g d__.

<div align="center">
	<img src="/assets/img/blog/20190506/trickdoc.gif">
</div>

## , f f to find references

If you need to find all the references of a class or method - for example if you 
want to find what screen is including a specific widget - you can type __, f f__
while keeping the cursor under the name. This will open a new buffer with all its
references.

* * *

# Emulators

VS Code allows you to select what emulator you want to test your app on.

Unfortunately I haven't found any particularly good solutions to reproduce
the same behavior on emacs, so the best option is to use your regular 
terminal to launch either emulators.

## Android

```
emulator @[emulator_name]
```

This simply opens the emulator named [emulator_name]. You can edit, delete and
add new emulators through Android Studio.

Remember to add the following to your path: 

```
$ANDROID_SDK/emulator
$ANDROID_SDK/tools
```

## iPhone

```
open -a Simulator.app 
```

This obviously only works under macOS. 

* * *

## Ok, but how is it compared to VS Code? 

Well, I don't think it brings any revolutionary new feature to the game, but emacs
is a world on its own that I think it's worth exploring.

## Why not straight Emacs then?

Because as I've already pointed out, I'm still a newbie in this and I 
wanted an easier way in the emacs world. 

I'm in the process of switching to vanilla emacs (though, I'll make it as similar
as possible to Spacemacs), and I don't think I would have had the will to jump
straight into emacs if it wasn't for Spacemacs. It showed me what a great
tool emacs is. I would still recommend to developers that are not familiar with 
emacs to try Spacemacs first, and then if they feel comfortable switch to plain 
emacs.

I hope you liked my brief summary!
