import assert from "power-assert";
import sinon from "sinon";
import MIDIAccess from "../src/MIDIAccess";
import EventEmitter from "../src/EventEmitter";
import MIDIPort from "../src/MIDIPort";
import MIDIDevice from "../src/MIDIDevice";

describe("MIDIPort", () => {
  let access, device, port;

  beforeEach(() => {
    access = new MIDIAccess({});
    device = new MIDIDevice();
    port = device.inputs[0];
  });

  describe("constructor(access: MIDIAccess, port: MIDIDeviceMessagePort)", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input instanceof EventEmitter);
      assert(input instanceof MIDIPort);
      assert(input.$access === access);
      assert(input.$port === port);
    });
  });
  describe("#id: string", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input.id === port.id);
    });
  });
  describe("#manufacturer: string", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input.manufacturer === port.manufacturer);
    });
  });
  describe("#name: string", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input.name === port.name);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input.type === port.type);
    });
  });
  describe("#version: string", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input.version === port.version);
    });
  });
  describe("#state: string", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input.state === port.state);
    });
  });
  describe("#connection: string", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);

      assert(input.connection === "closed");
    });
  });
  describe("#onstatechange: EventHandler", () => {
    it("works", () => {
      let input = new MIDIPort(access, port);
      let onstatechange = sinon.spy();
      let event = {};

      input.onstatechange = onstatechange;
      input.onstatechange = {};
      assert(input.onstatechange === onstatechange);

      input.emit("statechange", event);
      assert(onstatechange.calledOnce);
      assert(onstatechange.args[0][0] === event);
    });
    it("null", () => {
      let input = new MIDIPort(access, port);
      let event = {};

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
      let input = new MIDIPort(access, port);

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
      let input = new MIDIPort(access, port);

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
      let input = new MIDIPort(access, port);

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
      let input = new MIDIPort(access, port);

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
      let input = new MIDIPort(access, port);

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
