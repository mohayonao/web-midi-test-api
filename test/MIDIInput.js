import assert from "power-assert";
import sinon from "sinon";
import MIDIAccess from "../src/MIDIAccess";
import MIDIPort from "../src/MIDIPort";
import MIDIInput from "../src/MIDIInput";
import { MIDIDeviceMessagePort } from "../src/MIDIDevice";

describe("MIDIInput", () => {
  let access, port;

  beforeEach(() => {
    access = new MIDIAccess({});
    port = new MIDIDeviceMessagePort({}, "input");
  });

  describe("constructor(access: MIDIAccess, port: MIDIDeviceMessagePort)", () => {
    it("works", () => {
      let input = new MIDIInput(access, port);

      assert(input instanceof MIDIPort);
      assert(input instanceof MIDIInput);
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      let input = new MIDIInput(access, port);

      assert(input.type === "input");
    });
  });
  describe("#onmidimessage: EventHandler", () => {
    it("works", () => {
      let input = new MIDIInput(access, port);
      let onmidimessage = sinon.spy();
      let event = {};

      input.onmidimessage = onmidimessage;
      input.onmidimessage = {};
      assert(input.onmidimessage === onmidimessage);

      return Promise.resolve().then(() => {
        return input.open();
      }).then(() => {
        port.emit("midimessage", event);
        assert(onmidimessage.calledOnce);
        assert(onmidimessage.args[0][0] === event);
        onmidimessage.reset();
      }).then(() => {
        return input.close();
      }).then(() => {
        port.emit("midimessage", event);
        assert(!onmidimessage.called);
      });
    });
    it("null", () => {
      let input = new MIDIInput(access, port);
      let event = {};

      input.onmidimessage = null;
      input.onmidimessage = {};
      assert(input.onmidimessage === null);

      return Promise.resolve().then(() => {
        return input.open();
      }).then(() => {
        assert.doesNotThrow(() => {
          port.emit("midimessage", event);
        });
      });
    });
  });
});
