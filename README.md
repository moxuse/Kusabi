# Kusabi

Kusabi is the application provides try and error environment for building 3D graphics in WebGL quickly. Kusabi takes advantage of [PureScript](http://www.purescript.org) AltJS and [Three.js](https://threejs.org) the library for WebGL. Kusabi consists of editor, render view and communication way of PureScript's compiling process with. Compose graphics by PureScript functions on the editor, you can get result of rendering on the render view repetitively.

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

PureScript and Spago could install with npm.


```
npm i -g purescript
```

```
npm i -g spago
```

Then execute `spago` command and make sure it works.

If you installed to other directory, you can customize it by `spagoCommand` setting in `config.json`.


if you got other probrems about installation, [official document](https://github.com/spacchetti/spago#installation) will helps you.

## Build

```
cd /where/you/cloned/kusabi

npm install
```

## Run

```
npm run start
```

in another command prompt,

```
npm run electron
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

## Web Export

You can export bundled JavaScript code and HTML from code last you compiled.

Once compile current code and choose Menu `File >> Export`.

`dist` directory will appear and bundled code to `bundle.js` except threejs module (if you want to run and watch result rapidly, you can commentout `<script>` tag which will load threejs from cdn resource in headder)



## Test Environment

Mac OSX version : 10.15.4

Node.js version : v14.3.0

Electron version : v6.0.4

Spago version : v0.15.2
