"use strict";

function convertMIDIMessageToString(data) {
  if (!data || typeof data.length !== "number") {
    return dec2hex(data);
  }
  return "[" + Array.prototype.slice.call(data).map(dec2hex).join(",") + "]";
}

function dec2hex(value) {
  if (typeof value === "number" && isFinite(value)) {
    return "0x" + ((value|0).toString(16)).substr(-2);
  }
  return "NaN";
}

function defaults(value, defaultValue) {
  return value !== undefined ? value : defaultValue;
}

function validateMidiMessage(data) {
  if (!data || (!Array.isArray(data) && !(data.buffer instanceof ArrayBuffer))) {
    return false;
  }

  function midiValue(value) {
    return typeof value === "number" && 0x00 <= value && value <= 0x7f;
  }

  switch (data[0] & 0xf0) {
    case 0x80: // note off
    case 0x90: // note on
    case 0xa0: // polyphonic aftertouch
    case 0xb0: // control change
    case 0xe0: // pitch bend
      return data.length === 3 && midiValue(data[1]) && midiValue(data[2]);
    case 0xc0: // program change
    case 0xd0: // channel aftertouch
      return data.length === 2 && midiValue(data[1]);
    case 0xf0: // system exclusive message
      return data.length >= 1 && Array.prototype.slice.call(data).every(x => typeof x === "number" && isFinite(x));
  }

  return false;
}

const ChannelNames = {};

function makeChannelName(deviceName) {
  const m = /^(.+?)\s*(\d+)$/.exec(deviceName);

  let name, index, result;

  if (m === null) {
    name = "" + deviceName;
    index = 1;
  } else {
    name = m[1];
    index = m[2];
  }

  ChannelNames[name] = Math.max(1, (index|0), ChannelNames[name] || 0);

  if (ChannelNames[name] === 1) {
    result = name;
  } else {
    result = name + " " + ChannelNames[name];
  }

  ChannelNames[name] += 1;

  return result;
}

module.exports = { convertMIDIMessageToString, dec2hex, defaults, validateMidiMessage, makeChannelName };
