require("ace-min-noconflict");
require("ace-min-noconflict/mode-javascript");

import { Port } from "./Types";
import Repl from "./Repl";

class Editor {
  editor = ace.edit("editor");
  repl: Repl;
  port: Port;

  constructor(port: Port) {
    this.repl = new Repl(port);
    this.init();
  }

  init() {
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.$blockScrolling = Infinity;
    this.editor.container.classList.add("editor");
    this.editor.commands.addCommand({
      name: "showKeyboardShortcuts",
      bindKey: { win: "Ctrl-r", mac: "Ctrl-r" },
      exec: this.execCompile.bind(this)
    });

    window.postError = error => {
      const post = document.querySelector("#post form .text-area");
      post.innerHTML += "\n\n" + error;
      post.scrollTop = post.scrollHeight;
    };
  }

  execCompile() {
    if (!this.editor || !this.editor.session) {
      return;
    }

    if (0 < this.editor.session.getRowLength()) {
      var currline = this.editor.getSelectionRange().start.row;
      var wholelinetxt = this.editor.session.getLine(currline);

      const res = this.repl.execInScriptTag(wholelinetxt);
      // console.log("res....", wholelinetxt, res);
      if (0 < res.length) {
        this.postWindow(res);
      }
    }
  }

  postWindow(msg: string) {
    const post = document.querySelector("#post form .text-area");
    post.innerHTML += "\n\n" + msg;
    post.scrollTop = post.scrollHeight;
  }

  concat(lines: Array<string>): string {
    let arr: string = "";
    for (let line in lines) {
      arr.concat(line);
    }
    return arr;
  }

  openFile(file: string) {
    require("fs").readFile(file, "utf8", data => {
      this.editor.setValue(data, -1);
    });
  }
}

export default Editor;
