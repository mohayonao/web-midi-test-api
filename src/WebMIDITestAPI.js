"use strict";

const EventTarget = require("./EventTarget");
const MIDIAccess = require("./MIDIAccess");
const MIDIDevice = require("../src/MIDIDevice");

// partial interface Navigator {
//   Promise<MIDIAccess> requestMIDIAccess(optional MIDIOptions options);
// };

class WebMIDITestAPI extends EventTarget {
  constructor() {
    super();

    const _this = this;

    this.requestMIDIAccess = this.requestMIDIAccess.bind(this);
    this.MIDIDevice = class MIDIDeviceBinded extends MIDIDevice {
      constructor(opts) { super(_this, opts); }
    };

    this._devices = [];
  }

  get devices() {
    return this._devices.slice();
  }

  get inputs() {
    return this._devices.reduce((a, b) => a.concat(b.inputs), []);
  }

  get outputs() {
    return this._devices.reduce((a, b) => a.concat(b.outputs), []);
  }

  createMIDIDevice(opts) {
    const device = new this.MIDIDevice(opts);

    device.connect();

    return device;
  }

  registerDevice(device) {
    if (device.api === this) {
      if (this._devices.indexOf(device) === -1) {
        this._devices.push(device);
        this.emit("statechange");
      }
    }
  }

  unregisterDevice(device) {
    if (device.api === this) {
      const index = this._devices.indexOf(device);

      if (index !== -1) {
        this._devices.splice(index, 1);
        this.emit("statechange");
      }
    }
  }

  requestMIDIAccess(opts) {
    return Promise.resolve(new MIDIAccess(this, opts));
  }
}

module.exports = WebMIDITestAPI;
