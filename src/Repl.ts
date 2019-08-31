// import { createHash } from "crypto";
import { EventEmitter } from "typed-event-emitter";
import io from "socket.io-client";
const config = require("../config.json");

class Repl extends EventEmitter {
  private socket: any;
  public onResponse = this.registerEvent<(message: string) => any>();
  constructor() {
    super();
    // this.lastScriptID = this.updateHash();

    this.socket = io("http://localhost:" + config.replSocketPort);

    this.socket.on("response", this.response.bind(this));
  }

  response(message: string) {
    this.emit(this.onResponse, message);
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
