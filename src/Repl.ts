// import { createHash } from "crypto";
import { EventEmitter } from "typed-event-emitter";
import io from "socket.io-client";
const config = require("../config.json");

class Repl extends EventEmitter {
  private socket: any;
  private renderView: HTMLIFrameElement;
  public onResponse = this.registerEvent<(message: string) => any>();

  constructor() {
    super();
    // this.lastScriptID = this.updateHash();
    this.renderView = document.getElementById(
      "renderView"
    ) as HTMLIFrameElement;
    this.socket = io("http://localhost:" + config.replSocketPort);

    this.socket.on("response", this.response.bind(this));
    this.socket.on("replLoaded", this.onReplReady.bind(this));
  }

  response(message: string) {
    this.emit(this.onResponse, message);
  }

  onReplReady() {
    console.log("on ready repl");
    console.log("load render view :: " + config.psciPort);
    this.renderView.src = "http://localhost:" + config.psciPort;
  }

  compile(input: string): void {
    this.socket.emit("repl", input);
  }

  // removeScript(hash: string) {
  //   const target = document.getElementById(hash);
  //   if (target) {
  //     document.body.removeChild(target);
  //   }
  // }
}

export default Repl;
