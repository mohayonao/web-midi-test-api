import EventEmitter from "./EventEmitter";
import MIDIAccess from "./MIDIAccess";
import MIDIDevice from "../src/MIDIDevice";

// partial interface Navigator {
//   Promise<MIDIAccess> requestMIDIAccess(optional MIDIOptions options);
// };

export default class WebMIDITestAPI extends EventEmitter {
  constructor() {
    super();

    this.requestMIDIAccess = this.requestMIDIAccess.bind(this);

    this._devices = [];
  }

  get inputs() {
    return this._devices.reduce((a, b) => {
      return a.concat(b.inputs);
    }, []);
  }

  get outputs() {
    return this._devices.reduce((a, b) => {
      return a.concat(b.outputs);
    }, []);
  }

  createMIDIDevice(opts) {
    let device = new MIDIDevice(opts);

    this._devices.push(device);

    return device;
  }

  requestMIDIAccess(opts) {
    return Promise.resolve(new MIDIAccess(this, opts));
  }
}
