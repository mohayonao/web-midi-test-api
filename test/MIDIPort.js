"use strict";

const assert = require("power-assert");
const sinon = require("sinon");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIPort = require("../src/MIDIPort");
const MIDIDevice = require("../src/MIDIDevice");

describe("MIDIPort", () => {
  let access, device, port;

  beforeEach(() => {
    access = new MIDIAccess({});
    device = new MIDIDevice();
    port = device.inputs[0];
  });

  describe("constructor(access: MIDIAccess, port: MIDIDevice.MessagePort)", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input instanceof MIDIPort);
      assert(input.$access === access);
      assert(input.$port === port);
    });
  });
  describe("#id: string", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input.id === port.id);
    });
  });
  describe("#manufacturer: string", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input.manufacturer === port.manufacturer);
    });
  });
  describe("#name: string", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input.name === port.name);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input.type === port.type);
    });
  });
  describe("#version: string", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input.version === port.version);
    });
  });
  describe("#state: string", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input.state === port.state);
    });
  });
  describe("#connection: string", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      assert(input.connection === "closed");
    });
  });
  describe("#onstatechange: EventHandler", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);
      const onstatechange = sinon.spy();
      const event = {};

      input.onstatechange = onstatechange;
      input.onstatechange = {};
      assert(input.onstatechange === onstatechange);

      input.emit("statechange", event);
      assert(onstatechange.calledOnce);
      assert(onstatechange.args[0][0] === event);
    });
    it("null", () => {
      const input = new MIDIPort(access, port);
      const event = {};

      input.onstatechange = null;
      input.onstatechange = {};

      assert(input.onstatechange === null);
      assert.doesNotThrow(() => {
        input.emit("statechange", event);
      });
    });
  });
  describe("#open(): Promise<MIDIPort>", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      access.onstatechange = sinon.spy();
      input.onstatechange = sinon.spy();

      return Promise.resolve().then(() => {
        return device.connect();
      }).then(() => {
        return input.open();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "open");
        assert(access.onstatechange.calledOnce);
        assert(access.onstatechange.args[0][0].port === input);
        assert(input.onstatechange.calledOnce);
        assert(input.onstatechange.args[0][0].port === input);

        access.onstatechange.reset();
        input.onstatechange.reset();

        return input.open();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "open");
        assert(!access.onstatechange.called);
        assert(!input.onstatechange.called);
      });
    });
    it("pending", () => {
      const input = new MIDIPort(access, port);

      access.onstatechange = sinon.spy();
      input.onstatechange = sinon.spy();

      return Promise.resolve().then(() => {
        return device.disconnect();
      }).then(() => {
        return input.open();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "pending");
        assert(access.onstatechange.calledOnce);
        assert(access.onstatechange.args[0][0].port === input);
        assert(input.onstatechange.calledOnce);
        assert(input.onstatechange.args[0][0].port === input);

        access.onstatechange.reset();
        input.onstatechange.reset();

        return input.open();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "pending");
        assert(!access.onstatechange.called);
        assert(!input.onstatechange.called);
      });
    });
    it("pending -> open", () => {
      const input = new MIDIPort(access, port);

      access.onstatechange = sinon.spy();
      input.onstatechange = sinon.spy();

      return Promise.resolve().then(() => {
        return device.disconnect();
      }).then(() => {
        return input.open();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "pending");
        assert(access.onstatechange.calledOnce);
        assert(access.onstatechange.args[0][0].port === input);
        assert(input.onstatechange.calledOnce);
        assert(input.onstatechange.args[0][0].port === input);

        access.onstatechange.reset();
        input.onstatechange.reset();

        return device.connect();
      }).then(() => {
        assert(input.connection === "open");
        assert(access.onstatechange.calledOnce);
        assert(access.onstatechange.args[0][0].port === input);
        assert(input.onstatechange.calledOnce);
        assert(input.onstatechange.args[0][0].port === input);
      });
    });
  });
  describe("#close(): Promise<MIDIPort>", () => {
    it("works", () => {
      const input = new MIDIPort(access, port);

      access.onstatechange = sinon.spy();
      input.onstatechange = sinon.spy();

      return Promise.resolve().then(() => {
        return device.connect();
      }).then(() => {
        return input.open();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "open");

        access.onstatechange.reset();
        input.onstatechange.reset();

        return input.close();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "closed");
        assert(access.onstatechange.calledOnce);
        assert(access.onstatechange.args[0][0].port === input);
        assert(input.onstatechange.calledOnce);
        assert(input.onstatechange.args[0][0].port === input);

        access.onstatechange.reset();
        input.onstatechange.reset();

        return input.close();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "closed");
        assert(!access.onstatechange.called);
        assert(!input.onstatechange.called);
      });
    });
    it("open -> closed", () => {
      const input = new MIDIPort(access, port);

      access.onstatechange = sinon.spy();
      input.onstatechange = sinon.spy();

      return Promise.resolve().then(() => {
        return device.connect();
      }).then(() => {
        return input.open();
      }).then((value) => {
        assert(value === input);
        assert(input.connection === "open");

        access.onstatechange.reset();
        input.onstatechange.reset();

        return device.disconnect();
      }).then(() => {
        assert(input.connection === "closed");
        assert(access.onstatechange.calledOnce);
        assert(access.onstatechange.args[0][0].port === input);
        assert(input.onstatechange.calledOnce);
        assert(input.onstatechange.args[0][0].port === input);

        access.onstatechange.reset();
        input.onstatechange.reset();

        return device.connect();
      }).then(() => {
        assert(input.connection === "closed");
        assert(!access.onstatechange.called);
        assert(!input.onstatechange.called);
      });
    });
  });
});
