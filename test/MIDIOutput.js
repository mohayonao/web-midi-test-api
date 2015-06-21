import assert from "power-assert";
import WebMIDITestAPI from "../src/WebMIDITestAPI";
import MIDIPort from "../src/MIDIPort";
import MIDIOutput from "../src/MIDIOutput";

describe("MIDIOutput", () => {
  let api;

  beforeEach(() => {
    api = new WebMIDITestAPI();
  });

  describe("constructor(api: WebMIDITestAPI, opts = {})", () => {
    it("works", () => {
      let port = new MIDIOutput(api, {});

      assert(port instanceof MIDIPort);
      assert(port instanceof MIDIOutput);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      let input = new MIDIOutput(api, {});

      assert(input.type === "output");
    });
  });
  describe("#send(data: number[]): void", () => {
    it("works", () => {
      let port = new MIDIOutput(api, {});

      assert.doesNotThrow(() => {
        port.send([ 0x90, 0x30, 0x64 ]);
      });
    });
  });
  describe("#clear(): void", () => {
    it("works", () => {
      let port = new MIDIOutput(api, {});

      assert.doesNotThrow(() => {
        port.clear();
      });
    });
  });
});
