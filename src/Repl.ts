import { EventEmitter } from "typed-event-emitter";
import { createHash } from "crypto";
import { timerFlush } from "d3-timer";
import WebSocket from "./WebSocket";

class Repl extends EventEmitter {
  private socket: WebSocket;
  private lastScriptID: string;
  onResponse = this.registerEvent<(message: string) => any>();
  onResponseError = this.registerEvent<(message: string) => any>();

  constructor() {
    super();
    this.lastScriptID = this.updateHash();
    this.socket = new WebSocket();

    this.socket.on("response", this.response.bind(this));
    this.socket.on("responseError", this.responseError.bind(this));
    // this.socket.on("replLoaded", this.onReplReady.bind(this));
  }

  response(message: ArrayBuffer) {
    const decoder = new TextDecoder("utf8");
    const encoded = decoder.decode(new Uint8Array(message));
    timerFlush();
    this.emit(this.onResponse, encoded);
    this.execInScriptTag(encoded);
  }

  responseError(message: string) {
    console.log("on response...");
    this.emit(this.onResponseError, message);
  }

  compile(input: string): void {
    this.socket.emit("repl", input);
  }

  updateHash(): string {
    return (this.lastScriptID = createHash("md5")
      .update(Math.random() + "")
      .digest("hex"));
  }

  execInScriptTag(code: string) {
    this.removeScript(this.lastScriptID);
    const script = document.createElement("script");
    this.lastScriptID = this.updateHash();

    script.id = this.lastScriptID;
    script.text = code;
    try {
      document.body.appendChild(script);
    } catch (e) {
      return e;
    }
  }

  async wait(sec) {
    return new Promise(resolve => {
      setTimeout(resolve, sec * 1000);
    });
  }

  removeScript(hash: string) {
    const target = document.getElementById(hash);
    if (target) {
      document.body.removeChild(target);
    }
  }
}

export default Repl;
