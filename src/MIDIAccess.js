import EventEmitter from "./EventEmitter";
import MIDIInput from "./MIDIInput";
import MIDIOutput from "./MIDIOutput";

// interface MIDIAccess : EventTarget {
//   readonly  attribute MIDIInputMap  inputs;
//   readonly  attribute MIDIOutputMap outputs;
//             attribute EventHandler  onstatechange;
//   readonly  attribute boolean       sysexEnabled;
// };

export default class MIDIAccess extends EventEmitter {
  constructor(api, opts) {
    super();

    this.$api = api;
    this._sysexEnabled = !!(opts && opts.sysex);
    this._onstatechange = null;

    this.on("statechange", (e) => {
      if (this._onstatechange !== null) {
        this._onstatechange.call(this, e);
      }
    });
  }

  get inputs() {
    return new Map(this.$api.outputs.map(port => [ port.name, new MIDIInput(this, port.target) ]));
  }

  get outputs() {
    return new Map(this.$api.inputs.map(port => [ port.name, new MIDIOutput(this, port.target) ]));
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
