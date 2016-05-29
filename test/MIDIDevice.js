"use strict";

const assert = require("power-assert");
const sinon = require("sinon");
const events = require("events");
const MIDIDevice = require("../src/MIDIDevice");

describe("MIDIDevice", () => {
  describe("constructor(opts = {})", () => {
    const device = new MIDIDevice();

    assert(device instanceof MIDIDevice);
  });
  describe("#state: string", () => {
    it("works", () => {
      const device = new MIDIDevice();

      assert(device.state === "connected");

      device.disconnect();
      assert(device.state === "disconnected");

      device.connect();
      assert(device.state === "connected");
    });
  });
  describe("#numberOfInputs: number", () => {
    it("works", () => {
      const device = new MIDIDevice();

      assert(device.numberOfInputs === 1);
    });
  });
  describe("#numberOfOutputs: number", () => {
    it("works", () => {
      const device = new MIDIDevice();

      assert(device.numberOfOutputs === 1);
    });
  });
  describe("#inputs: MIDIDevice.MessagePort[]", () => {
    it("works", () => {
      const device = new MIDIDevice({ numberOfInputs: 2 });

      assert(device.inputs !== device.inputs);
      assert.deepEqual(device.inputs, device.inputs);
      assert(device.inputs[0] !== device.inputs[1]);
      assert(device.inputs[0] instanceof MIDIDevice.MessagePort);
      assert(device.inputs[1] instanceof MIDIDevice.MessagePort);
    });
  });
  describe("#outputs: MIDIDevice.MessagePort[]", () => {
    it("works", () => {
      const device = new MIDIDevice({ numberOfOutputs: 2 });

      assert(device.outputs !== device.outputs);
      assert.deepEqual(device.outputs, device.outputs);
      assert(device.outputs[0] !== device.outputs[1]);
      assert(device.outputs[0] instanceof MIDIDevice.MessagePort);
      assert(device.outputs[1] instanceof MIDIDevice.MessagePort);
    });
  });
  describe("#connect(): void", () => {
    it("works", () => {
      const device = new MIDIDevice();
      const onconnected = sinon.spy();

      device.on("connected", onconnected);
      device.disconnect();
      assert(!onconnected.called);

      device.connect();
      assert(onconnected.calledOnce);
      onconnected.reset();

      device.connect();
      assert(!onconnected.called);
    });
  });
  describe("#disconnect(): void", () => {
    it("works", () => {
      const device = new MIDIDevice();
      const ondisconnected = sinon.spy();

      device.on("disconnected", ondisconnected);

      device.disconnect();
      assert(ondisconnected.calledOnce);
      ondisconnected.reset();

      device.disconnect();
      assert(!ondisconnected.called);
    });
  });
});

describe("MIDIDevice.MessageChannel", () => {
  let device = null;

  beforeEach(() => {
    device = { manufacturer: "manufacturer", version: "version", state: "connected" };
  });

  describe("constructor(device: MIDIDevice)", () => {
    it("works", () => {
      const channel = new MIDIDevice.MessageChannel(device);

      assert(channel instanceof MIDIDevice.MessageChannel);
      assert(channel.device === device);
      assert(typeof channel.id === "string");
      assert(typeof channel.name === "string");
      assert(typeof channel.version === "string");
      assert(channel.input instanceof MIDIDevice.MessagePort);
      assert(channel.output instanceof MIDIDevice.MessagePort);
      assert(channel.input.target === channel.output);
      assert(channel.output.target === channel.input);
    });
  });
  describe("#state", () => {
    it("works", () => {
      const channel = new MIDIDevice.MessageChannel(device);

      assert(channel.state === "connected");

      device.state = "disconnected";
      assert(channel.state === "disconnected");
    });
  });
});

describe("MIDIDevice/MessagePort", () => {
  let channel = null;

  beforeEach(() => {
    channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  });

  describe("constructor(channel: MIDIDevice.MessageChannel)", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert(port instanceof MIDIDevice.MessagePort);
      assert(port.channel === channel);
    });
  });
  describe("#id: string", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert(port.id === "00000000");
    });
  });
  describe("#manufacturer: string", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert(port.manufacturer === "manufacturer");
    });
  });
  describe("#name: string", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert(port.name === "name");
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert(port.type === "input");
    });
  });
  describe("#version: string", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert(port.version === "version");
    });
  });
  describe("#state", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert(port.state === "connected");

      channel.state = "disconnected";
      assert(port.state === "disconnected");
    });
  });
  describe("#onmidimessage: EventHandler", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");
      const onmidimessage = sinon.spy();
      const event = {};

      port.onmidimessage = onmidimessage;
      port.onmidimessage = {};
      assert(port.onmidimessage === onmidimessage);

      port.emit("midimessage", event);
      assert(onmidimessage.calledOnce);
      assert(onmidimessage.args[0][0] === event);
    });
    it("null", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");
      const event = {};

      port.onmidimessage = null;
      port.onmidimessage = {};

      assert(port.onmidimessage === null);
      assert.doesNotThrow(() => {
        port.emit("midimessage", event);
      });
    });
  });
  describe("#send(data: number[], timestamp: number): void", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");
      const onmidimessage = sinon.spy();

      port.target = new events.EventEmitter();
      port.target.on("midimessage", onmidimessage);

      port.send([ 0x90, 0x30, 0x64 ]);

      return Promise.resolve().then(() => {
        assert(onmidimessage.calledOnce);
        assert(typeof onmidimessage.args[0][0].receivedTime === "number");
        assert.deepEqual(onmidimessage.args[0][0].data, new Uint8Array([ 0x90, 0x30, 0x64 ]));
        onmidimessage.reset();

        channel.state = "disconnected";
        port.send([ 0x90, 0x30, 0x64 ]);
        assert(!onmidimessage.called);

        assert.throws(() => {
          port.send([ 0x00, 0x00, 0x00 ]);
        }, TypeError);
      });
    });
  });
  describe("#clear(): void", () => {
    it("works", () => {
      const port = new MIDIDevice.MessagePort(channel, "input");

      assert.doesNotThrow(() => {
        port.clear();
      });
    });
  });
});
