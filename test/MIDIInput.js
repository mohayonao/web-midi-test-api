"use strict";

const assert = require("power-assert");
const sinon = require("sinon");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIPort = require("../src/MIDIPort");
const MIDIInput = require("../src/MIDIInput");
const MIDIDevice = require("../src/MIDIDevice");
const events = require('events');

describe("MIDIInput", () => {
  let access, port;

  beforeEach(() => {
    access = new MIDIAccess(new events.EventEmitter());
    port = new MIDIDevice.MessagePort({}, "input");
  });

  describe("constructor(access: MIDIAccess, port: MIDIDevice.MessagePort)", () => {
    it("works", () => {
      const input = new MIDIInput(access, port);

      assert(input instanceof MIDIPort);
      assert(input instanceof MIDIInput);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      const input = new MIDIInput(access, port);

      assert(input.type === "input");
    });
  });
  describe("#onmidimessage: EventHandler", () => {
    it("works", () => {
      const input = new MIDIInput(access, port);
      const onmidimessage = sinon.spy();
      const event = {};

      input.onmidimessage = onmidimessage;
      input.onmidimessage = {};
      assert(input.onmidimessage === onmidimessage);

      return Promise.resolve().then(() => {
        return input.open();
      }).then(() => {
        port.emit("midimessage", event);
        assert(onmidimessage.calledOnce);
        assert(onmidimessage.args[0][0] === event);
        onmidimessage.reset();
      }).then(() => {
        return input.close();
      }).then(() => {
        port.emit("midimessage", event);
        assert(!onmidimessage.called);
      });
    });
    it("null", () => {
      const input = new MIDIInput(access, port);
      const event = {};

      input.onmidimessage = null;
      input.onmidimessage = {};
      assert(input.onmidimessage === null);

      return Promise.resolve().then(() => {
        return input.open();
      }).then(() => {
        assert.doesNotThrow(() => {
          port.emit("midimessage", event);
        });
      });
    });
  });
});
