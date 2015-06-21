import assert from "power-assert";
import sinon from "sinon";
import WebMIDITestAPI from "../src/WebMIDITestAPI";
import MIDIPort from "../src/MIDIPort";
import MIDIInput from "../src/MIDIInput";

describe("MIDIInput", () => {
  let api;

  beforeEach(() => {
    api = new WebMIDITestAPI();
  });

  describe("constructor(api: WebMIDITestAPI, opts = {})", () => {
    it("works", () => {
      let input = new MIDIInput(api, {});

      assert(input instanceof MIDIPort);
      assert(input instanceof MIDIInput);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      let input = new MIDIInput(api, {});

      assert(input.type === "input");
    });
  });
  describe("#onmidimessage: EventHandler", () => {
    it("works", () => {
      let input = new MIDIInput(api, {});
      let onmidimessage = sinon.spy();
      let event = {};

      input.onmidimessage = onmidimessage;
      input.onmidimessage = {};
      assert(input.onmidimessage === onmidimessage);

      input.emit("midimessage", event);
      assert(onmidimessage.calledOnce);
      assert(onmidimessage.args[0][0] === event);
    });
    it("null", () => {
      let input = new MIDIInput(api, {});
      let event = {};

      input.onmidimessage = null;
      input.onmidimessage = {};

      assert(input.onmidimessage === null);
      assert.doesNotThrow(() => {
        input.emit("midimessage", event);
      });
    });
  });
});
