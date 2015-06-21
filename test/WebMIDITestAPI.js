import assert from "power-assert";
import sinon from "sinon";
import EventEmitter from "../src/EventEmitter";
import WebMIDITestAPI from "../src/WebMIDITestAPI";
import MIDIAccess from "../src/MIDIAccess";
import MIDIInput from "../src/MIDIInput";
import MIDIOutput from "../src/MIDIOutput";

describe("WebMIDITestAPI", () => {
  describe("constructor()", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();

      assert(api instanceof WebMIDITestAPI);
      assert(api instanceof EventEmitter);
      assert(typeof api.requestMIDIAccess === "function");
    });
  });
  describe("#requestMIDIAccess(opts = {}): Promise<MIDIAccess>", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();

      return Promise.all([
        api.requestMIDIAccess(),
        api.requestMIDIAccess(),
      ]).then(([ access1, access2 ]) => {
        assert(access1 !== access2);
        assert(access1 instanceof MIDIAccess);
        assert(access1 instanceof MIDIAccess);

        access1.onstatechange = sinon.spy();
        access2.onstatechange = sinon.spy();

        let event = {};
        api.emit("statechange", event);

        assert(access1.onstatechange.calledOnce);
        assert(access1.onstatechange.args[0][0] === event);
        assert(access2.onstatechange.calledOnce);
        assert(access2.onstatechange.args[0][0] === event);
      });
    });
  });
  describe("#getMIDIInputs(): MIDIInput[]", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();

      assert(api.getMIDIInputs() !== api.getMIDIInputs());
      assert.deepEqual(api.getMIDIInputs(), []);
    });
  });
  describe("#getMIDIOutputs(): MIDIOutput[]", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();

      assert(api.getMIDIOutputs() !== api.getMIDIOutputs());
      assert.deepEqual(api.getMIDIOutputs(), []);
    });
  });
  describe("#createMIDIInput(opts = {}): MIDIInput", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let input1 = api.createMIDIInput();
      let input2 = api.createMIDIInput();

      assert(input1 !== input2);
      assert(input1 instanceof MIDIInput);
      assert(input2 instanceof MIDIInput);
    });
  });
  describe("#createMIDIOutput(opts = {}): MIDIOutput", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let output1 = api.createMIDIOutput();
      let output2 = api.createMIDIOutput();

      assert(output1 !== output2);
      assert(output1 instanceof MIDIOutput);
      assert(output2 instanceof MIDIOutput);
    });
  });
  describe("#addMIDIInput(port: MIDIInput): void", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let input1 = api.createMIDIInput();
      let input2 = api.createMIDIInput();
      let output1 = api.createMIDIOutput();

      api.addMIDIInput(input1);
      api.addMIDIInput(input1);
      api.addMIDIInput(input2);
      api.addMIDIInput(output1);

      assert.deepEqual(api.getMIDIInputs(), [ input1, input2 ]);
      assert.deepEqual(api.getMIDIOutputs(), []);
    });
  });
  describe("#addMIDIOutput(port: MIDIOutput): void", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let input1 = api.createMIDIInput();
      let output1 = api.createMIDIOutput();
      let output2 = api.createMIDIOutput();

      api.addMIDIOutput(input1);
      api.addMIDIOutput(output1);
      api.addMIDIOutput(output1);
      api.addMIDIOutput(output2);

      assert.deepEqual(api.getMIDIInputs(), []);
      assert.deepEqual(api.getMIDIOutputs(), [ output1, output2 ]);
    });
  });
  describe("#removeMIDIInput(port: MIDIInput): void", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let input1 = api.createMIDIInput();
      let input2 = api.createMIDIInput();
      let input3 = api.createMIDIInput();

      api.addMIDIInput(input1);
      api.addMIDIInput(input2);
      api.removeMIDIInput(input3);
      api.removeMIDIInput(input1);

      assert.deepEqual(api.getMIDIInputs(), [ input2 ]);
    });
  });
  describe("#removeMIDIOutput(port: MIDIOutput): void", () => {
    it("works", () => {
      let api = new WebMIDITestAPI();
      let output1 = api.createMIDIOutput();
      let output2 = api.createMIDIOutput();
      let output3 = api.createMIDIOutput();

      api.addMIDIOutput(output1);
      api.addMIDIOutput(output2);
      api.removeMIDIOutput(output3);
      api.removeMIDIOutput(output1);

      assert.deepEqual(api.getMIDIOutputs(), [ output2 ]);
    });
  });
});
