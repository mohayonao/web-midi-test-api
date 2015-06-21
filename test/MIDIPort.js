import assert from "power-assert";
import sinon from "sinon";
import WebMIDITestAPI from "../src/WebMIDITestAPI";
import MIDIPort from "../src/MIDIPort";

describe("MIDIPort", () => {
  let api;

  beforeEach(() => {
    api = new WebMIDITestAPI();
  });

  describe("constructor(api: WebMIDITestAPI, opts = {})", () => {
    it("works", () => {
      let port = new MIDIPort(api);

      assert(port instanceof MIDIPort);
      assert(port.$api === api);
    });
  });
  describe("#id: string", () => {
    it("works", () => {
      let port = new MIDIPort(api, { id: "id" });

      assert(port.id === "id");
    });
  });
  describe("#manufacturer: string", () => {
    it("works", () => {
      let port = new MIDIPort(api, { manufacturer: "manufacturer" });

      assert(port.manufacturer === "manufacturer");
    });
  });
  describe("#name: string", () => {
    it("works", () => {
      let port = new MIDIPort(api, { name: "name" });

      assert(port.name === "name");
    });
  });
  describe("#type: string", () => {
    it("works", () => {
      let port = new MIDIPort(api, {});

      assert(port.type === undefined);
    });
  });
  describe("#version: string", () => {
    it("works", () => {
      let port = new MIDIPort(api, { version: "version" });

      assert(port.version === "version");
    });
  });
  describe("#state: string", () => {
    it("works", () => {
      let port = new MIDIPort(api, {});

      assert(port.state === "connected");
    });
  });
  describe("#connection: string", () => {
    it("works", () => {
      let port = new MIDIPort(api, {});

      assert(port.connection === "closed");
    });
  });
  describe("#onstatechange: EventHandler", () => {
    it("works", () => {
      let port = new MIDIPort(api, {});
      let onstatechange = sinon.spy();
      let event = {};

      port.onstatechange = onstatechange;
      port.onstatechange = {};
      assert(port.onstatechange === onstatechange);

      port.emit("statechange", event);
      assert(onstatechange.calledOnce);
      assert(onstatechange.args[0][0] === event);
    });
    it("null", () => {
      let port = new MIDIPort(api, {});
      let event = {};

      port.onstatechange = null;
      port.onstatechange = {};

      assert(port.onstatechange === null);
      assert.doesNotThrow(() => {
        port.emit("statechange", event);
      });
    });
  });
  describe("#open(): Promise<MIDIPort>", () => {
    it("works", () => {
      let port = new MIDIPort(api, {});

      return port.open().then((value) => {
        assert(value === port);
      });
    });
  });
  describe("#close(): Promise<MIDIPort>", () => {
    it("works", () => {
      let port = new MIDIPort(api, {});

      return port.close().then((value) => {
        assert(value === port);
      });
    });
  });
});
