# Kusabi

Kusabi is the project that aiming to build an application provides try and error environment for building 3D graphics in WebGL quickly. Kusabi takes advantage of [PureScript](http://www.purescript.org) AltJS and [Three.js](https://threejs.org) the library for WebGL. Kusabi consists of editor, render view and communication way of PureScript's compiling process with. Compose graphics by PureScript functions on the editor, you can get result of rendering on the render view repetitively.

<img src='https://raw.githubusercontent.com/moxuse/Kusabi/master/resources/kusabi_cap.jpg' width="650"/>

## Yodaka

PureScript functions for using in Kusabi appication. It helps composing WebGL scene rendering with threejs.

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

Then execute `spago` command and make sure it works.

In linux environment, if you got `purs not found` error, you'll need insstall purescript.


```
npm i -g purescript
```

If you installed to other directory, you can customize it by `spagoCommand` setting in `config.json`.


if you got other probrems about installation, [official document](https://github.com/spacchetti/spago#installation) will helps you.

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

Editor keyboard shortcuts

| key (win/linux) | key (Mac)      | function      |
| -------- | -------- | ------------- |
| Ctrl + E | Ctrl + E | Execute code |
| Ctrl + S | Cmd + S | Save file    |
| Ctrl + O | Cmd + O | Open file     |

## Test Environment

Mac OSX version : 10.14.8

Node.js version : v11.6.0

Electron version : v6.0.3

Spago version : v0.9.0.0
