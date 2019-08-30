import { Port } from "./Types";
import { createHash } from "crypto";
import Context from "./Yodaka/src/Context";
import { EventEmitter } from "typed-event-emitter";
import io from "socket.io-client";

class Repl extends EventEmitter {
  // private lastScriptID: string;
  // private port: Port;
  private socket: any;
  public onResponse = this.registerEvent<(message: string) => any>();
  constructor(port: Port) {
    super();
    // this.lastScriptID = this.updateHash();

    // make context
    // TODO transfar making context to Yodaka
    // TODO include prelude in Yodaka

    // const c_ = Context(port);
    // Object.keys(c_).map(k => {
    //   console.log(k, "hasbean exported..");
    //   window[k] = c_[k];
    // });
    this.socket = io("http://localhost:9000");

    this.socket.on("response", this.response.bind(this));
  }

  response(message: string) {
    this.emit(this.onResponse, message);
  }

  // updateHash(): string {
  //   return (this.lastScriptID = createHash("md5")
  //     .update(Math.random() + "")
  //     .digest("hex"));
  // }

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
