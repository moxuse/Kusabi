import io from "socket.io-client";
const config = require("../config.json");

class WebSocket {
  public socket;

  constructor() {
    this.socket = io("http://localhost:" + config.replSocketPort);
  }

  on(name, target) {
    this.socket.on(name, target);
  }

  emit(name, value) {
    this.socket.emit(name, value);
  }

  removeAllEvents() {
    if (this.socket.io.connecting.length < 1) {
      return;
    }
    const events = Object.keys(this.socket._callbacks);
    events.forEach(e => {
      if (
        e != "$connecting" &&
        e != "$response" &&
        e != "$responseError" &&
        e != "$connect"
      ) {
        this.socket.io.connecting[0].removeEventListener(
          e,
          this.socket._callbacks[e]
        );
        // console.log("removeAllEvents", e, this.socket._callbacks[e]);
      }
    });
  }
}

export default WebSocket;
