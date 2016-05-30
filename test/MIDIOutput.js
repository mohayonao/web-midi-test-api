"use strict";

const assert = require("power-assert");
const MIDIAccess = require("../src/MIDIAccess");
const MIDIPort = require("../src/MIDIPort");
const MIDIOutput = require("../src/MIDIOutput");
const MIDIDevice = require("../src/MIDIDevice");

describe("MIDIOutput", () => {
  let access, port;

  beforeEach(() => {
    access = new MIDIAccess({});
    port = new MIDIDevice.MessagePort({}, "output");
  });

  describe("constructor(access: MIDIAccess, port: MIDIDevice.MessagePort)", () => {
    it("works", () => {
      const output = new MIDIOutput(access, port);

      assert(output instanceof MIDIPort);
      assert(output instanceof MIDIOutput);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      const output = new MIDIOutput(access, port);

      assert(output.type === "output");
    });
  });
  describe("#send(data: number[]): void", () => {
    it("works", () => {
      const output = new MIDIOutput(access, port);

      assert.doesNotThrow(() => {
        output.send([ 0x90, 0x30, 0x64 ]);
      });

      assert.throws(() => {
        output.send([ 0x00, 0x00, 0x00 ]);
      }, TypeError);
    });
    it("sysex: false", () => {
      const output = new MIDIOutput(access, port);

      assert.throws(() => {
        output.send([ 0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x78 ]);
      }, Error);
    });
    it("sysex: true", () => {
      const access = new MIDIAccess({}, { sysex: true });
      const output = new MIDIOutput(access, port);

      assert.doesNotThrow(() => {
        output.send([ 0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x78 ]);
      });
    });
  });
  describe("#clear(): void", () => {
    it("works", () => {
      const output = new MIDIOutput(access, port);

      assert.doesNotThrow(() => {
        output.clear();
      });
    });
  });
});
