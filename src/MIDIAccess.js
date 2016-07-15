"use strict";

const EventTarget = require("./EventTarget");
const MIDIInput = require("./MIDIInput");
const MIDIOutput = require("./MIDIOutput");

// interface MIDIAccess : EventTarget {
//   readonly  attribute MIDIInputMap  inputs;
//   readonly  attribute MIDIOutputMap outputs;
//             attribute EventHandler  onstatechange;
//   readonly  attribute boolean       sysexEnabled;
// };

class MIDIAccess extends EventTarget {
  constructor(api, opts) {
    super();

    this.$api = api;
    this._sysexEnabled = !!(opts && opts.sysex);
    this._onstatechange = null;
    this._inputs = new Map();
    this._outputs = new Map();

    this.$api.outputs.forEach((port) => {
      this._addInput(port);
    });
    this.$api.inputs.map((port) => {
      this._addOutput(port);
    });

    this.$api.on("add", (device) => {
      device.outputs.forEach((port) => {
        this._addInput(port);
      });
      device.inputs.forEach((port) => {
        this._addOutput(port);
      });
    });

    this.$api.on("remove", (device) => {
      device.outputs.forEach((port) => {
        this._removeInput(port);
      });
      device.inputs.forEach((port) => {
        this._removeOutput(port);
      });
    });
  }

  get inputs() {
    return this._inputs;
  }

  get outputs() {
    return this._outputs;
  }

  get onstatechange() {
    return this._onstatechange;
  }

  set onstatechange(callback) {
    if (callback === null || typeof callback === "function") {
      this._onstatechange = callback;
    }
  }

  get sysexEnabled() {
    return this._sysexEnabled;
  }

  _addInput(port) {
    if (!this._inputs.has(port.id)) {
      const input = new MIDIInput(this, port.target);

      input.addEventListener("statechange", (e) => {
        this.emit("statechange", e);
      });

      this._inputs.set(port.id, input);

      if (input.state === "connected") {
        this.emit("statechange", { port: input });
      }
    }
  }

  _addOutput(port) {
    if (!this._outputs.has(port.id)) {
      const output = new MIDIOutput(this, port.target);

      output.addEventListener("statechange", (e) => {
        this.emit("statechange", e);
      });

      this._outputs.set(port.id, output);

      if (output.state === "connected") {
        this.emit("statechange", { port: output });
      }
    }
  }

  _removeInput(port) {
    if (this._inputs.has(port.id)) {
      this._inputs.delete(port.id);
    }
  }

  _removeOutput(port) {
    if (this._outputs.has(port.id)) {
      this._outputs.delete(port.id);
    }
  }
}

module.exports = MIDIAccess;
