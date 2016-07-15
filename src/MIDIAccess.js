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

    this.$api.on("deviceupdate", (device) => {
      device.outputs.forEach((port) => {
        this.emit("statechange", {
          port: new MIDIInput(this, port.target)
        });
      });
      device.inputs.forEach((port) => {
        this.emit("statechange", {
          port: new MIDIOutput(this, port.target)
        });
      });
    });
  }

  get inputs() {
    return new Map(this.$api.outputs.map(port => [ port.id, new MIDIInput(this, port.target) ]));
  }

  get outputs() {
    return new Map(this.$api.inputs.map(port => [ port.id, new MIDIOutput(this, port.target) ]));
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
}

module.exports = MIDIAccess;
