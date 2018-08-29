"use strict";

const EventTarget = require("./EventTarget");

// interface MIDIPort : EventTarget {
//   readonly  attribute DOMString               id;
//   readonly  attribute DOMString?              manufacturer;
//   readonly  attribute DOMString?              name;
//   readonly  attribute MIDIPortType            type;
//   readonly  attribute DOMString?              version;
//   readonly  attribute MIDIPortDeviceState     state;
//   readonly  attribute MIDIPortConnectionState connection;
//             attribute EventHandler            onstatechange;
//   Promise<MIDIPort> open();
//   Promise<MIDIPort> close();
// };

class MIDIPort extends EventTarget {
  constructor(access, port) {
    super();

    this.$access = access;
    this.$port = port;

    this._connection = "closed";
    this._onstatechange = null;

    port.on("connected", () => {
      if (this.connection === "pending") {
        this._connection = "open";
      }
      this.emit("statechange", { port: this });
    });
    port.on("disconnected", () => {
      if (this.connection !== "closed") {
        this._connection = "closed";
      }
      this.emit("statechange", { port: this });
    });
  }

  get id() {
    return this.$port.id;
  }

  get manufacturer() {
    return this.$port.manufacturer;
  }

  get name() {
    return this.$port.name;
  }

  get type() {
    return this.$port.type;
  }

  get version() {
    return this.$port.version;
  }

  get state() {
    return this.$port.state;
  }

  get connection() {
    return this._connection;
  }

  get onstatechange() {
    return this._onstatechange;
  }

  set onstatechange(callback) {
    if (callback === null || typeof callback === "function") {
      this._onstatechange = callback;
    }
  }

  open() {
    return new Promise((resolve, reject) => {
      try {
        this._implicitOpen();
        resolve(this);
      } catch(e) {
        reject(e);
      }
    });
  }

  close() {
    return new Promise((resolve) => {
      if (this.connection === "closed") {
        return resolve(this);
      }

      this._connection = "closed";
      this.emit("statechange", { port: this });

      resolve(this);
    });
  }

  _implicitOpen() {
    if (this.connection === "open" || this.connection === "pending") {
      return;
    }

    if (this.state === "disconnected") {
      this._connection = "pending";
      this.emit("statechange", { port: this });
      return;
    }

    this._connection = "open";
    this.emit("statechange", { port: this });
  }
}

module.exports = MIDIPort;
