import EventEmitter from "./EventEmitter";
import MIDIAccess from "./MIDIAccess";
import MIDIInput from "./MIDIInput";
import MIDIOutput from "./MIDIOutput";

// partial interface Navigator {
//   Promise<MIDIAccess> requestMIDIAccess (optional MIDIOptions options);
// };

export default class WebMIDITestAPI extends EventEmitter {
  constructor() {
    super();

    this.requestMIDIAccess = this.requestMIDIAccess.bind(this);

    this._accesses = [];
    this._inputs = [];
    this._outputs = [];

    this.on("statechange", (e) => {
      this._accesses.forEach((access) => {
        access.emit("statechange", e);
      });
    });
  }

  requestMIDIAccess(opts) {
    let access = new MIDIAccess(this, opts);

    this._accesses.push(access);

    return Promise.resolve(access);
  }

  getMIDIInputs() {
    return this._inputs.slice();
  }

  getMIDIOutputs() {
    return this._outputs.slice();
  }

  createMIDIInput(opts) {
    return new MIDIInput(this, opts);
  }

  createMIDIOutput(opts) {
    return new MIDIOutput(this, opts);
  }

  addMIDIInput(port) {
    if (this._inputs.indexOf(port) === -1) {
      if (port instanceof MIDIInput && port.$api === this) {
        this._inputs.push(port);
      }
    }
  }

  addMIDIOutput(port) {
    if (this._outputs.indexOf(port) === -1) {
      if (port instanceof MIDIOutput && port.$api === this) {
        this._outputs.push(port);
      }
    }
  }

  removeMIDIInput(port) {
    let index = this._inputs.indexOf(port);
    if (index !== -1) {
      this._inputs.splice(index, 1);
    }
  }

  removeMIDIOutput(port) {
    let index = this._outputs.indexOf(port);
    if (index !== -1) {
      this._outputs.splice(index, 1);
    }
  }
}
