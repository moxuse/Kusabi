import { Port } from "./Types";
import { createHash } from "crypto";
import Context from "./Context";

import livescript from "livescript";

class Repl {
  lastScriptID: string;
  port: Port;
  constructor(port: Port) {
    this.lastScriptID = this.updateHash();

    //make context
    const c_ = Context(port);
    Object.keys(c_).map(k => {
      console.log(k, "hasbean exported..");
      window[k] = c_[k];
    });
  }

  updateHash(): string {
    return (this.lastScriptID = createHash("md5")
      .update(Math.random() + "")
      .digest("hex"));
  }

  livesdcriptCompile(input: string): string {
    const compiler = livescript["compile"];
    const res = compiler(input);
    console.log(res);
    return res;
  }

  execInScriptTag(code: string) {
    let error = null;
    this.removeScript(this.lastScriptID);
    const script = document.createElement("script");
    this.lastScriptID = this.updateHash();

    script.id = this.lastScriptID;
    script.text = this.livesdcriptCompile(code);
    try {
      document.body.appendChild(script);
      return script.text;
    } catch (e) {
      return e;
    }
  }

  removeScript(hash: string) {
    const target = document.getElementById(hash);
    if (target) {
      document.body.removeChild(target);
    }
  }
}

export default Repl;
