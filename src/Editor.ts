require("ace-min-noconflict");
require("ace-min-noconflict/mode-javascript");
import { Port } from "./Types";
import Repl from "./Repl";

class Editor {
  editor = ace.edit("editor");
  repl: Repl;

  constructor(port: Port) {
    this.repl = new Repl(port);
    this.init();
    this.repl.onResponse(this.onResponse.bind(this));
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

  onResponse(message: string) {
    let text: string = message;
    if (100 < message.split("\n").length) {
      let textArr = text.split("\n").slice(0, 10);
      text = textArr.reduce((a, c) => {
        return a.concat(c + "\n");
      });
      text += " ...";
    }
    this.postWindow(text);
  }

  execCompile() {
    if (!this.editor || !this.editor.session) {
      return;
    }

    if (0 < this.editor.session.getRowLength()) {
      const lines = this.editor.getSession().getValue();
      // var currline = this.editor.getSelectionRange().start.row;
      // var wholelinetxt = this.editor.session.getLine(currline);
      this.repl.compile(lines);
    }
  }

  postWindow(msg: string) {
    const post = document.querySelector("#post form .text-area");
    post.innerHTML += "\n\n" + msg;
    post.scrollTop = post.scrollHeight;
  }

  openFile(file: string) {
    require("fs").readFile(file, "utf8", data => {
      this.editor.setValue(data, -1);
    });
  }
}

export default Editor;
