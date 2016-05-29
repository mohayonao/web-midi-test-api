"use strict";

const assert = require("power-assert");
const util = require("../src/util");

describe("util", () => {
  describe("convertMIDIMessageToString(data: any): string", () => {
    it("works", () => {
      assert(util.convertMIDIMessageToString() === "NaN");
      assert(util.convertMIDIMessageToString(100) === "0x64");
      assert(util.convertMIDIMessageToString([ 0x90, 0x30, 0x64 ]) === "[0x90,0x30,0x64]");
      assert(util.convertMIDIMessageToString(new Uint8Array([ 0x90, 0x30, 0x64 ])) === "[0x90,0x30,0x64]");
    });
  });
  describe("dec2hex(value: number): string", () => {
    it("works", () => {
      assert(util.dec2hex(100) === "0x64");
      assert(util.dec2hex(NaN) === "NaN");
    });
  });
  describe("defaults(value: any, defaultValue: any): any", () => {
    it("works", () => {
      assert(util.defaults(0, 1) === 0);
      assert(util.defaults(null, 1) === null);
      assert(util.defaults(false, 1) === false);
      assert(util.defaults("", 1) === "");
      assert(isNaN(util.defaults(NaN, 1)));
      assert(util.defaults(undefined, 1) === 1);
    });
  });
  describe("validateMidiMessage", () => {
    it("works", () => {
      assert(util.validateMidiMessage() === false);
      assert(util.validateMidiMessage([ 0x00, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0x80, 0x00, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0x80, 0xff, 0xff ]) === false);
      assert(util.validateMidiMessage([ 0x80, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0x80, 0x00, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0x90, 0x00, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0x90, 0xff, 0xff ]) === false);
      assert(util.validateMidiMessage([ 0x90, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0x90, 0x00, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xa0, 0x00, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0xa0, 0xff, 0xff ]) === false);
      assert(util.validateMidiMessage([ 0xa0, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xa0, 0x00, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xb0, 0x00, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0xb0, 0xff, 0xff ]) === false);
      assert(util.validateMidiMessage([ 0xb0, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xb0, 0x00, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xc0, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0xc0, 0xff ]) === false);
      assert(util.validateMidiMessage([ 0xc0 ]) === false);
      assert(util.validateMidiMessage([ 0xc0, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xd0, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0xd0, 0xff ]) === false);
      assert(util.validateMidiMessage([ 0xd0 ]) === false);
      assert(util.validateMidiMessage([ 0xd0, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xe0, 0x00, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0xe0, 0xff, 0xff ]) === false);
      assert(util.validateMidiMessage([ 0xe0, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xe0, 0x00, 0x00, 0x00 ]) === false);
      assert(util.validateMidiMessage([ 0xf0 ]) === true);
      assert(util.validateMidiMessage([ 0xf0, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0xf0, 0x00, 0x00 ]) === true);
      assert(util.validateMidiMessage([ 0xf0, 0x00, 0x00, "0x00" ]) === false);

      assert(util.validateMidiMessage(new Uint8Array([ 0x90, 0x00, 0x00 ])) === true);
    });
  });
});
