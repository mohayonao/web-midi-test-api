import EventEmitter from "./EventEmitter";
import util from "./util";

let MidiPortIndex = 0;
let ChannelNames = {};

export class MIDIDevice extends EventEmitter {
  constructor(opts = {}) {
    super();

    let numberOfInputs = util.defaults(opts.numberOfInputs, 1);
    let numberOfOutputs = util.defaults(opts.numberOfOutputs, 1);

    this._manufacturer = util.defaults(opts.manufacturer, "");
    this._name = util.defaults(opts.name, "Web MIDI Test API");
    this._version = util.defaults(opts.version, "");
    this._inputs = new Array(numberOfInputs);
    this._outputs = new Array(numberOfOutputs);

    for (let i = 0; i < numberOfInputs; i++) {
      this._inputs[i] = new MIDIDeviceMessageChannel(this);
    }
    for (let i = 0; i < numberOfOutputs; i++) {
      this._outputs[i] = new MIDIDeviceMessageChannel(this);
    }

    this._state = "connected";
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

export class MIDIDeviceMessageChannel extends EventEmitter {
  constructor(device) {
    super();

    this.device = device;
    this.id = "" + (MidiPortIndex++);
    this.manufacturer = this.device.manufacturer;
    this.name = makeChannelName(device.name);
    this.version = this.device.version;
    this.input = new MIDIDeviceMessagePort(this, "input");
    this.output = new MIDIDeviceMessagePort(this, "output");

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
}

export class MIDIDeviceMessagePort extends EventEmitter {
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
        data: new Uint8Array(data),
      });
    }
  }

  clear() {}
}

export function makeChannelName(deviceName) {
  let m = /^(.+?)\s*(\d+)$/.exec(deviceName);
  let name, index, result;

  if (m === null) {
    name = "" + deviceName;
    index = 1;
  } else {
    name = m[1];
    index = m[2];
  }

  ChannelNames[name] = Math.max(1, (index|0), ChannelNames[name] || 0);

  if (ChannelNames[name] === 1) {
    result = name;
  } else {
    result = name + " " + ChannelNames[name];
  }

  ChannelNames[name] += 1;

  return result;
}

export default MIDIDevice;
