import EventEmitter from "./EventEmitter";
import util from "./util";

// interface MIDIPort : EventTarget {
//     readonly    attribute DOMString               id;
//     readonly    attribute DOMString?              manufacturer;
//     readonly    attribute DOMString?              name;
//     readonly    attribute MIDIPortType            type;
//     readonly    attribute DOMString?              version;
//     readonly    attribute MIDIPortDeviceState     state;
//     readonly    attribute MIDIPortConnectionState connection;
//                 attribute EventHandler            onstatechange;
//     Promise<MIDIPort> open ();
//     Promise<MIDIPort> close ();
// };

export default class MIDIPort extends EventEmitter {
  constructor(api, opts = {}) {
    super();

    this.$api = api;

    this._id = util.defaults(opts.id, Date.now().toString());
    this._manufacturer = util.defaults(opts.manufacturer, "");
    this._name = util.defaults(opts.name, "");
    this._version = util.defaults(opts.version, "");
    this._state = "connected";
    this._connection = "closed";
    this._onstatechange = null;

    this.on("statechange", (e) => {
      if (this._onstatechange !== null) {
        this._onstatechange.call(this, e);
      }
    });
  }

  get id() {
    return this._id;
  }

  get manufacturer() {
    return this._manufacturer;
  }

  get name() {
    return this._name;
  }

  get type() {
    // subclass responsibility
  }

  get version() {
    return this._version;
  }

  get state() {
    return this._state;
  }

  get connection() {
    return this._connection;
  }

  get onstatechange() {
    return this._onstatechange;
  }

  set onstatechange(callback) {
    if (callback === null || typeof callback === "function") {
      this._onstatechange = callback;
    }
  }

  open() {
    return new Promise((resolve, reject) => {
      if (this.connection === "open" || this.connection === "pending") {
        return resolve(this);
      }

      if (this.state === "disconnected") {
        this._connection = "pending";

        let event = {};
        this.$api.emit("statechange", event);
        this.emit("statechange", event);

        return resolve(this);
      }

      return this._open().then(resolve, reject);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.connection === "closed") {
        return resolve(this);
      }

      return this._close().then(() => {
        this._connection = "closed";

        let event = {};
        this.$api.emit("statechange", event);
        this.emit("statechange", event);

        resolve(this);
      }, reject);
    });
  }

  _open() {
    return Promise.resolve(this);
  }
  _close() {
    return Promise.resolve(this);
  }
}
