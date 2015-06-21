import assert from "power-assert";
import MIDIAccess from "../src/MIDIAccess";
import MIDIPort from "../src/MIDIPort";
import MIDIOutput from "../src/MIDIOutput";
import { MIDIDeviceMessagePort } from "../src/MIDIDevice";

describe("MIDIOutput", () => {
  let access, port;

  beforeEach(() => {
    access = new MIDIAccess({});
    port = new MIDIDeviceMessagePort({}, "output");
  });

  describe("constructor(access: MIDIAccess, port: MIDIDeviceMessagePort)", () => {
    it("works", () => {
      let output = new MIDIOutput(access, port);

      assert(output instanceof MIDIPort);
      assert(output instanceof MIDIOutput);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      let output = new MIDIOutput(access, port);

      assert(output.type === "output");
    });
  });
  describe("#send(data: number[]): void", () => {
    it("works", () => {
      let output = new MIDIOutput(access, port);

      assert.doesNotThrow(() => {
        output.send([ 0x90, 0x30, 0x64 ]);
      });

      assert.throws(() => {
        output.send([ 0x00, 0x00, 0x00 ]);
      }, TypeError);
    });
    it("sysex: false", () => {
      let output = new MIDIOutput(access, port);

      assert.throws(() => {
        output.send([ 0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x78 ]);
      }, Error);
    });
    it("sysex: true", () => {
      let access = new MIDIAccess({}, { sysex: true });
      let output = new MIDIOutput(access, port);

      assert.doesNotThrow(() => {
        output.send([ 0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x78 ]);
      });
    });
  });
  describe("#clear(): void", () => {
    it("works", () => {
      let output = new MIDIOutput(access, port);

      assert.doesNotThrow(() => {
        output.clear();
      });
    });
  });
});
