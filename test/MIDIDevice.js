import assert from "power-assert";
import sinon from "sinon";
import EventEmitter from "../src/EventEmitter";
import { MIDIDevice, MIDIDeviceMessageChannel, MIDIDeviceMessagePort, makeChannelName } from "../src/MIDIDevice";

describe("MIDIDevice", () => {
  describe("constructor(opts = {})", () => {
    let device = new MIDIDevice();

    assert(device instanceof EventEmitter);
    assert(device instanceof MIDIDevice);
  });
  describe("#state: string", () => {
    it("works", () => {
      let device = new MIDIDevice();

      assert(device.state === "connected");

      device.disconnect();
      assert(device.state === "disconnected");

      device.connect();
      assert(device.state === "connected");
    });
  });
  describe("#numberOfInputs: number", () => {
    it("works", () => {
      let device = new MIDIDevice();

      assert(device.numberOfInputs === 1);
    });
  });
  describe("#numberOfOutputs: number", () => {
    it("works", () => {
      let device = new MIDIDevice();

      assert(device.numberOfOutputs === 1);
    });
  });
  describe("#inputs: MIDIDeviceMessagePort[]", () => {
    it("works", () => {
      let device = new MIDIDevice({ numberOfInputs: 2 });

      assert(device.inputs !== device.inputs);
      assert.deepEqual(device.inputs, device.inputs);
      assert(device.inputs[0] !== device.inputs[1]);
      assert(device.inputs[0] instanceof MIDIDeviceMessagePort);
      assert(device.inputs[1] instanceof MIDIDeviceMessagePort);
    });
  });
  describe("#outputs: MIDIDeviceMessagePort[]", () => {
    it("works", () => {
      let device = new MIDIDevice({ numberOfOutputs: 2 });

      assert(device.outputs !== device.outputs);
      assert.deepEqual(device.outputs, device.outputs);
      assert(device.outputs[0] !== device.outputs[1]);
      assert(device.outputs[0] instanceof MIDIDeviceMessagePort);
      assert(device.outputs[1] instanceof MIDIDeviceMessagePort);
    });
  });
  describe("#connect(): void", () => {
    it("works", () => {
      let device = new MIDIDevice();
      let onconnected = sinon.spy();

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
      let device = new MIDIDevice();
      let ondisconnected = sinon.spy();

      device.on("disconnected", ondisconnected);

      device.disconnect();
      assert(ondisconnected.calledOnce);
      ondisconnected.reset();

      device.disconnect();
      assert(!ondisconnected.called);
    });
  });
});

describe("MIDIDeviceMessageChannel", () => {
  let device = null;

  beforeEach(() => {
    device = { manufacturer: "manufacturer", version: "version", state: "connected" };
  });

  describe("constructor(device: MIDIDevice)", () => {
    it("works", () => {
      let channel = new MIDIDeviceMessageChannel(device);

      assert(channel instanceof MIDIDeviceMessageChannel);
      assert(channel instanceof EventEmitter);
      assert(channel.device === device);
      assert(typeof channel.id === "string");
      assert(typeof channel.name === "string");
      assert(typeof channel.version === "string");
      assert(channel.input instanceof MIDIDeviceMessagePort);
      assert(channel.output instanceof MIDIDeviceMessagePort);
      assert(channel.input.target === channel.output);
      assert(channel.output.target === channel.input);
    });
  });
  describe("#state", () => {
    it("works", () => {
      let channel = new MIDIDeviceMessageChannel(device);

      assert(channel.state === "connected");

      device.state = "disconnected";
      assert(channel.state === "disconnected");
    });
  });
});

describe("MIDIDeviceMessagePort", () => {
  let channel = null;

  beforeEach(() => {
    channel = { id: "00000000", manufacturer: "manufacturer", name: "name", version: "version", state: "connected" };
  });

  describe("constructor(channel: MIDIDeviceMessageChannel)", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert(port instanceof MIDIDeviceMessagePort);
      assert(port instanceof EventEmitter);
      assert(port.channel === channel);
    });
  });
  describe("#id: string", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert(port.id === "00000000");
    });
  });
  describe("#manufacturer: string", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert(port.manufacturer === "manufacturer");
    });
  });
  describe("#name: string", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert(port.name === "name");
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert(port.type === "input");
    });
  });
  describe("#version: string", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert(port.version === "version");
    });
  });
  describe("#state", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert(port.state === "connected");

      channel.state = "disconnected";
      assert(port.state === "disconnected");
    });
  });
  describe("#onmidimessage: EventHandler", () => {
    it("works", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");
      let onmidimessage = sinon.spy();
      let event = {};

      port.onmidimessage = onmidimessage;
      port.onmidimessage = {};
      assert(port.onmidimessage === onmidimessage);

      port.emit("midimessage", event);
      assert(onmidimessage.calledOnce);
      assert(onmidimessage.args[0][0] === event);
    });
    it("null", () => {
      let port = new MIDIDeviceMessagePort(channel, "input");
      let event = {};

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
      let port = new MIDIDeviceMessagePort(channel, "input");
      let onmidimessage = sinon.spy();

      port.target = new EventEmitter();
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
      let port = new MIDIDeviceMessagePort(channel, "input");

      assert.doesNotThrow(() => {
        port.clear();
      });
    });
  });
});

describe("makeChannelName(deviceName: string): string", () => {
  it("works", () => {
    assert(makeChannelName("Test MIDI Device") === "Test MIDI Device");
    assert(makeChannelName("Test MIDI Device") === "Test MIDI Device 2");
    assert(makeChannelName("Test MIDI Device") === "Test MIDI Device 3");

    assert(makeChannelName("Test MIDI Device II 4") === "Test MIDI Device II 4");
    assert(makeChannelName("Test MIDI Device II") === "Test MIDI Device II 5");
    assert(makeChannelName("Test MIDI Device II 8") === "Test MIDI Device II 8");
    assert(makeChannelName("Test MIDI Device II") === "Test MIDI Device II 9");
  });
});
