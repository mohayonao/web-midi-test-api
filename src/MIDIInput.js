import MIDIPort from "./MIDIPort";

// interface MIDIInput : MIDIPort {
//                 attribute EventHandler onmidimessage;
// };

export default class MIDIInput extends MIDIPort {
  constructor(api, opts) {
    super(api, opts);

    this.on("midimessage", (e) => {
      if (this._onmidimessage !== null) {
        this._onmidimessage.call(this, e);
      }
    });
  }

  get type() {
    return "input";
  }

  get onmidimessage() {
    return this._onmidimessage;
  }

  set onmidimessage(callback) {
    if (callback === null || typeof callback === "function") {
      this._onmidimessage = callback;
    }
  }
}
