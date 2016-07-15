"use strict";

const events = require("events");
const util = require("./util");

let MidiPortIndex = 0;

class MIDIDevice extends events.EventEmitter {
  constructor(api, opts) {
    opts = opts || {};

    const numberOfInputs = util.defaults(opts.numberOfInputs, 1);
    const numberOfOutputs = util.defaults(opts.numberOfOutputs, 1);

    super();

    this._api = api;
    this._manufacturer = util.defaults(opts.manufacturer, "");
    this._name = util.defaults(opts.name, "Web MIDI Test API");
    this._version = util.defaults(opts.version, "");
    this._inputs = Array.from({ length: numberOfInputs }, () => new MIDIDevice.MessageChannel(this));
    this._outputs = Array.from({ length: numberOfOutputs }, () => new MIDIDevice.MessageChannel(this));
    this._state = "connected";
  }

  get api() {
    return this._api;
  }

  get manufacturer() {
    return this._manufacturer;
  }

  get name() {
    return this._name;
  }

  get version() {
    return this._version;
  }

  get state() {
    return this._state;
  }

  get numberOfInputs() {
    return this._inputs.length;
  }

  get numberOfOutputs() {
    return this._outputs.length;
  }

  get inputs() {
    return this._inputs.map(port => port.input);
  }

  get outputs() {
    return this._outputs.map(port => port.output);
  }

  connect() {
    if (this._state === "disconnected") {
      this._state = "connected";
      this._inputs.concat(this._outputs).forEach((channel) => {
        channel.emit("connected");
      });
      this.emit("connected");
    }
  }

  disconnect() {
    if (this._state === "connected") {
      this._state = "disconnected";
      this._inputs.concat(this._outputs).forEach((channel) => {
        channel.emit("disconnected");
      });
      this.emit("disconnected");
    }
  }
}

MIDIDevice.MessageChannel = class MIDIDeviceMessageChannel extends events.EventEmitter {
  constructor(device) {
    super();

    this.device = device;
    this.id = "" + (MidiPortIndex++);
    this.manufacturer = this.device.manufacturer;
    this.name = util.makeChannelName(device.name);
    this.version = this.device.version;
    this.input = new MIDIDevice.MessagePort(this, "input");
    this.output = new MIDIDevice.MessagePort(this, "output");

    this.input.target = this.output;
    this.output.target = this.input;

    this.on("connected", () => {
      this.input.emit("connected");
      this.output.emit("connected");
    });
    this.on("disconnected", () => {
      this.input.emit("disconnected");
      this.output.emit("disconnected");
    });
  }

  get state() {
    return this.device.state;
  }
};

MIDIDevice.MessagePort = class MIDIDeviceMessagePort extends events.EventEmitter {
  constructor(channel, type) {
    super();

    this.channel = channel;
    this.target = null;
    this._type = type;
    this._onmidimessage = null;

    this.on("midimessage", (e) => {
      if (this._onmidimessage !== null) {
        this._onmidimessage.call(this, e);
      }
    });
  }

  get id() {
    return this.channel.id;
  }

  get manufacturer() {
    return this.channel.manufacturer;
  }

  get name() {
    return this.channel.name;
  }

  get type() {
    return this._type;
  }

  get version() {
    return this.channel.version;
  }

  get state() {
    return this.channel.state;
  }

  get onmidimessage() {
    return this._onmidimessage;
  }

  set onmidimessage(callback) {
    if (callback === null || typeof callback === "function") {
      this._onmidimessage = callback;
    }
  }

  send(data, timestamp) {
    if (!util.validateMidiMessage(data)) {
      throw new TypeError("Invalid MIDI message: " + util.convertMIDIMessageToString(data));
    }
    if (this.target !== null && this.state === "connected") {
      this.target.emit("midimessage", {
        receivedTime: util.defaults(timestamp, Date.now()),
        data: new Uint8Array(data)
      });
    }
  }

  clear() {}
};

module.exports = MIDIDevice;
