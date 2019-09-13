require("ace-min-noconflict");
require("ace-min-noconflict/mode-javascript");
var Range = ace.require("ace/range").Range;
import { Port } from "./Types";
import Repl from "./Repl";
import RenderView from "./RenderView";
import { TweenLite } from "gsap";

class Editor {
  editor = ace.edit("editor");
  renderView: RenderView;
  repl: Repl;

  constructor(renderView: RenderView) {
    this.repl = new Repl(renderView.port);
    this.renderView = renderView;
    this.init();
    this.repl.onResponse(this.onResponse.bind(this));
    this.repl.onResponseError(this.onResponseError.bind(this));
  }

  init() {
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.$blockScrolling = Infinity;
    this.editor.container.classList.add("editor");
    this.editor.commands.addCommand({
      name: "showKeyboardShortcuts",
      bindKey: { win: "Ctrl-e", mac: "Ctrl-e" },
      exec: this.execCompile.bind(this)
    });
    this.editor.commands.addCommand({
      name: "showKeyboardShortcutsSelect",
      bindKey: { win: "Ctrl-a", mac: "Ctrl-a" },
      exec: this.highlightSelection.bind(this)
    });
    this.editor.session.setOptions({ tabSize: 2, useSoftTabs: true });
    this.editor.setOption("highlightActiveLine", false);

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

  openFile(file: string) {
    require("fs").readFile(file, "utf8", data => {
      this.editor.setValue(data, -1);
    });
  }
}

export default Editor;
