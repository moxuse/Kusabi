# Kusabi

Kusabi is the project that aiming to build an application that provides try and error environment for building 3D graphics in WebGL quickly. Kusabi takes advantage of [PureScript](http://www.purescript.org) AltJS and [Threejs](https://threejs.org) the library for WebGL. Kusabi consists of editor, render view and communication way of PureScript compiling process with. Compose graphics by PureScript functions, you can get rendering result in render view repetitive.

## Yodaka

PureScript functions for using in Kusabi appication. It helps composing threejs rendering.

For more details, see [README of Yodaka's erpo](https://github.com/moxuse/Yodaka)

# Install Kusabi

## Clone Repo

When you need to clone repo with recursive option for to resolve submodule Yodaka.

```
git clone https://github.com/moxuse/Kusabi.git --recursive
```

## Spago PureScript package manager

Kusabi depends PureScript build system and package managment system on [Spago](https://github.com/spacchetti/spago).

Spago could install with npm ro yarn.

```
npm install -g spago
```

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
electron .
```

The Kusabi editor window will launch.

## Test Environment

Mac OSX version :: 10.14.8

Node.js version :: v11.6.0

Electron version :: v6.0.3

Spago version :: v0.9.0.0
