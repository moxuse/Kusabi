# Kusabi

Kusabi is the project that aiming to build an application that provides try and error environment for building 3D graphics in WebGL quickly. Kusabi takes advantage of [PureScript](http://www.purescript.org) AltJS and [Three.js](https://threejs.org) the library for WebGL. Kusabi consists of editor, render view and communication way of PureScript's compiling process with. Compose graphics by PureScript functions on the editor, you can get rendering result in the render view repetitive.

## Yodaka

PureScript functions for using in Kusabi appication. It helps composing threejs rendering.

For more details, see [README of Yodaka's repo](https://github.com/moxuse/Yodaka)

# Install

## Clone Repo

When you need to clone repo with recursive option for to resolve submodule Yodaka.

```
git clone https://github.com/moxuse/Kusabi.git --recursive
```

## Install Spago

Kusabi depends PureScript package managment system on [Spago](https://github.com/spacchetti/spago) and its build system.

Spago could install with npm.

```
npm i -g spago
```

Then execute `spago` command and make sure that installed correctly.

If you installed to other directory, you can customize it by `spagoCommand` setting in `config.json`.

## Build

```
cd /where/you/cloned/kusabi

yarn
```

## Run

```
yarn run start
```

in another command prompt,

```
yarn run electron
```

Kusabi's editor window will launch.

## Execute Code

Upper half of the window is editor view. Write code and execute whole lines by `Ctrl + E` key.

```
add $ torus {}
```

## Keyboard shortcuts

Editor keybboard shortcuts

| key      | function      |
| -------- | ------------- |
| Ctrl + E | Evaluate code |
| Cmd + S | Scave file    |
| Cmd + O | Open file     |

## Test Environment

Mac OSX version :: 10.14.8

Node.js version :: v11.6.0

Electron version :: v6.0.3

Spago version :: v0.9.0.0
