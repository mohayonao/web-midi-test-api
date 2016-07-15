"use strict";

const events = require("events");

class EventTarget extends events.EventEmitter {
  addEventListener(type, listener) {
    this.on(type, listener);
  }

  removeEventListener(type, listener) {
    this.removeListener(type, listener);
  }

  emit(type, event) {
    if (typeof this[`on${ type }`] === "function") {
      this[`on${ type }`].call(this, event);
    }
    super.emit.apply(this, arguments);
  }
}

module.exports = EventTarget;
