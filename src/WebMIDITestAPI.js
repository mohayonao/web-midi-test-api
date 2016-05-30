"use strict";

const events = require("events");
const MIDIAccess = require("./MIDIAccess");
const MIDIDevice = require("../src/MIDIDevice");

// partial interface Navigator {
//   Promise<MIDIAccess> requestMIDIAccess(optional MIDIOptions options);
// };

class WebMIDITestAPI extends events.EventEmitter {
  constructor() {
    super();

    this.requestMIDIAccess = this.requestMIDIAccess.bind(this);

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
    const device = new MIDIDevice(opts);

    this._devices.push(device);
    
    this.emit('statechange');

    return device;
  }

  requestMIDIAccess(opts) {
    return Promise.resolve(new MIDIAccess(this, opts));
  }
}

module.exports = WebMIDITestAPI;
