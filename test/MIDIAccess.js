import assert from "power-assert";
import sinon from "sinon";
import WebMIDITestAPI from "../src/WebMIDITestAPI";
import MIDIAccess from "../src/MIDIAccess";

function iter2array(iter) {
  let result = [];

  for (let item = iter.next(); !item.done; item = iter.next()) {
    result.push(item.value);
  }

  return result;
}

describe("MIDIAccess", () => {
  let api;

  beforeEach(() => {
    api = new WebMIDITestAPI();
  });

  describe("constructor(api: WebMIDITestAPI, opts = {})", () => {
    it("works", () => {
      let access = new MIDIAccess(api);

      assert(access instanceof MIDIAccess);
      assert(access.$api === api);
    });
  });
  describe("#inputs: Map<string, MIDIInput>", () => {
    it("works", () => {
      let input1 = api.createMIDIInput({ name: "foo" });
      let input2 = api.createMIDIInput({ name: "bar" });

      api.addMIDIInput(input1);
      api.addMIDIInput(input2);

      let access = new MIDIAccess(api);

      assert(access.inputs instanceof Map);

      let keys = iter2array(access.inputs.keys());
      let vals = iter2array(access.inputs.values());

      assert.deepEqual(keys, [ "foo", "bar" ]);
      assert.deepEqual(vals, [ input1, input2 ]);
    });
  });
  describe("#outputs: Map<string, MIDIOutput>", () => {
    it("works", () => {
      let output1 = api.createMIDIOutput({ name: "foo" });
      let output2 = api.createMIDIOutput({ name: "bar" });

      api.addMIDIOutput(output1);
      api.addMIDIOutput(output2);

      let access = new MIDIAccess(api);

      assert(access.outputs instanceof Map);

      let keys = iter2array(access.outputs.keys());
      let vals = iter2array(access.outputs.values());

      assert.deepEqual(keys, [ "foo", "bar" ]);
      assert.deepEqual(vals, [ output1, output2 ]);
    });
  });
  describe("#onstatechange: EventHandler", () => {
    it("works", () => {
      let access = new MIDIAccess(api);
      let onstatechange = sinon.spy();
      let event = {};

      access.onstatechange = onstatechange;
      access.onstatechange = {};
      assert(access.onstatechange === onstatechange);

      access.emit("statechange", event);
      assert(onstatechange.calledOnce);
      assert(onstatechange.args[0][0] === event);
    });
    it("null", () => {
      let access = new MIDIAccess(api);
      let event = {};

      access.onstatechange = null;
      access.onstatechange = {};

      assert(access.onstatechange === null);
      assert.doesNotThrow(() => {
        access.emit("statechange", event);
      });
    });
  });
  describe("#sysexEnabled: boolean", () => {
    it("works", () => {
      let access1 = new MIDIAccess(api);
      let access2 = new MIDIAccess(api, { sysex: true });

      assert(access1.sysexEnabled === false);
      assert(access2.sysexEnabled === true);
    });
  });
});
