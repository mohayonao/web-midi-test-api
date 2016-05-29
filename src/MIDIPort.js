"use strict";

const events = require("events");

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

class MIDIPort extends events.EventEmitter {
  constructor(access, port) {
    super();

    this.$access = access;
    this.$port = port;

    this._connection = "closed";
    this._onstatechange = null;

    this.on("statechange", (e) => {
      if (this._onstatechange !== null) {
        this._onstatechange.call(this, e);
      }
    });
    port.on("connected", () => {
      if (this.connection === "pending") {
        this._open().then(() => {
          this._connection = "open";

          const event = { port: this };

          this.$access.emit("statechange", event);
          this.emit("statechange", event);
        });
      }
    });
    port.on("disconnected", () => {
      if (this.connection !== "closed") {
        this._close().then(() => {
          this._connection = "closed";

          const event = { port: this };

          this.$access.emit("statechange", event);
          this.emit("statechange", event);
        });
      }
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
      if (this.connection === "open" || this.connection === "pending") {
        return resolve(this);
      }

      if (this.state === "disconnected") {
        this._connection = "pending";

        const event = { port: this };

        this.$access.emit("statechange", event);
        this.emit("statechange", event);

        return resolve(this);
      }

      return this._open().then(() => {
        this._connection = "open";

        const event = { port: this };

        this.$access.emit("statechange", event);
        this.emit("statechange", event);

        resolve(this);
      }, reject);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.connection === "closed") {
        return resolve(this);
      }

      return this._close().then(() => {
        this._connection = "closed";

        const event = { port: this };

        this.$access.emit("statechange", event);
        this.emit("statechange", event);

        resolve(this);
      }, reject);
    });
  }

  _open() {
    return Promise.resolve(this);
  }
  _close() {
    return Promise.resolve(this);
  }
}

module.exports = MIDIPort;
