import MIDIPort from "./MIDIPort";

// interface MIDIInput : MIDIPort {
//   attribute EventHandler onmidimessage;
// };

export default class MIDIInput extends MIDIPort {
  constructor(access, port) {
    super(access, port);

    port.on("midimessage", (e) => {
      if (this._onmidimessage !== null && this.connection === "open") {
        this._onmidimessage.call(this, e);
      }
    });
  }

  get onmidimessage() {
    return this._onmidimessage;
  }

  set onmidimessage(callback) {
    if (callback === null || typeof callback === "function") {
      this._onmidimessage = callback;
      if (callback && this.connection !== "open") {
        this.open();
      }
    }
  }
}
