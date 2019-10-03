require("ace-min-noconflict");
require("ace-min-noconflict/mode-haskell");
// require("ace-min-noconflict/theme-xcode");
var Range = ace.require("ace/range").Range;
import Repl from "./Repl";
import RenderView from "./RenderView";
import { TweenLite } from "gsap";
const fs = window.require("fs");
const { remote } = window.require("electron");
const config = require("../config.json");

class Editor {
  editor = ace.edit("editor");
  renderView: RenderView;
  repl: Repl;
  path: string;

  constructor(renderView: RenderView) {
    this.repl = new Repl();
    this.renderView = renderView;
    this.renderView.port.osc = this.repl.socket;
    this.init();
    this.repl.onResponse(this.onResponse.bind(this));
    this.repl.onResponseError(this.onResponseError.bind(this));

    console.log(
      "Loaded Render View\nKusbi Port :: " +
        config.kusabiPort +
        "\nRepl Socket Port :: " +
        config.replSocketPort
    );
  }

  init() {
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.$blockScrolling = Infinity;
    this.editor.container.classList.add("editor");
    this.editor.commands.addCommand({
      name: "keyboardShortcutsExec",
      bindKey: { win: "Ctrl-e", mac: "Ctrl-e", linux: "Ctrl-e" },
      exec: this.execCompile.bind(this)
    });
    this.editor.commands.addCommand({
      name: "keyboardShortcutsSelect",
      bindKey: { win: "Ctrl-a", mac: "Ctrl-a" },
      exec: this.highlightSelection.bind(this)
    });
    this.editor.commands.addCommand({
      name: "keyboardShortcutsFileOpen",
      bindKey: { win: "Command-o", mac: "Command-o", linux: "Command-o" },
      exec: this.open.bind(this)
    });
    this.editor.commands.addCommand({
      name: "keyboardShortcutsFileSave",
      bindKey: { win: "Command-s", mac: "Command-s", linux: "Command-s" },
      exec: this.save.bind(this, false)
    });
    this.editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
    this.editor.setOptions({
      highlightActiveLine: false,
      // theme: "ace/theme/xcode",
      mode: "ace/mode/haskell",
      showPrintMargin: false
    });

    window.postError = error => {
      const post = document.querySelector("#post form .text-area");
      post.innerHTML += "\n\n" + error;
      post.scrollTop = post.scrollHeight;
    };
  }

  onResponse(message: string) {
    let text: string = message;
    if (100 < message.split("\n").length) {
      let textArr = text.split("\n").slice(0, 10);
      text = textArr.reduce((a, c) => {
        return a.concat(c + "\n");
      });
      text += " ...";
    }
    this.renderView.cleanPort();
    this.repl.socket.removeAllEvents();
    this.postWindow(text);
  }

  onResponseError(message: string) {
    this.postWindow(message);
  }

  execCompile() {
    if (!this.editor || !this.editor.session) {
      return;
    }
    this.highlightSelection();

    if (0 < this.editor.session.getRowLength()) {
      const lines = this.editor.getSession().getValue();
      this.repl.compile(lines);
    }
  }

  /**
   * code blink at execution
   */
  highlightSelection() {
    const current = this.editor.getCursorPosition().row;
    let up = current;
    let bottom = current;
    while (true) {
      if (this.editor.session.getLine(up).length > 0) {
        up = up - 1;
        if (up < 0) {
          break;
        }
      } else {
        break;
      }
    }
    while (true) {
      if (this.editor.session.getLine(bottom).length > 0) {
        bottom = bottom + 1;
      } else {
        break;
      }
    }
    let marker = this.editor.session.addMarker(
      new Range(up + 1, 0, bottom - 1, 1),
      "execMarker",
      "fullLine"
    );
    setTimeout(() => {
      const elems = document.getElementsByClassName("execMarker");
      if (elems && elems.length > 0) {
        const array = Array.from(elems);
        array.forEach(element => {
          TweenLite.to(element, 0.5, {
            opacity: 0,
            onComplete: () => {
              this.editor.session.removeMarker(marker);
            }
          });
        });
      }
    }, 20);
  }

  postWindow(msg: string) {
    const post = document.querySelector("#post form .text-area");
    post.innerHTML += "\n\n" + msg;
    post.scrollTop = post.scrollHeight;
  }

  load(data) {
    this.editor.session.replace(
      new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE),
      data
    );
  }

  open() {
    console.log("Open a file..");
    remote.dialog.showOpenDialog(
      remote.app.win,
      {
        properties: ["openFile"],
        filters: [{ name: "Kusabi", extensions: ["purs"] }]
      },
      path => {
        if (!path) {
          console.log("Nothing to load");
          return;
        }
        this.read(path);
      }
    );
  }

  save(quitAfter) {
    console.log("Save a file..");
    if (this.path) {
      this.write(this.path, this.editor.getSession().getValue(), quitAfter);
    } else {
      this.saveAs(quitAfter);
    }
  }

  saveAs(quitAfter) {
    console.log("Save a file as..");
    remote.dialog.showSaveDialog(loc => {
      if (loc === undefined) {
        return;
      }
      if (loc.indexOf(".purs") < 0) {
        loc += ".purs";
      }
      this.write(loc, this.editor.getSession().getValue(), quitAfter);
      this.path = loc;
    });
  }

  write(loc, data, quitAfter) {
    console.log("Writing " + loc);
    fs.writeFileSync(loc, data);

    if (quitAfter === true) {
      remote.app.exit();
    }
  }

  read(loc) {
    if (!loc) {
      return;
    }
    console.log("Reading location: " + loc);
    this.path = loc[0];
    try {
      this.load(fs.readFileSync(this.path, "utf8"));
    } catch (err) {
      console.warn(" not exist", err);
    }
  }
}

export default Editor;
