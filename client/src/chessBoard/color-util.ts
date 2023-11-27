export const getMix = (hex: string) => {};

function colorChannelMixer(
  colorChannelA: number,
  colorChannelB: number,
  amountToMix: number
) {
  var channelA = colorChannelA * amountToMix;
  var channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
}

function colorMixer(rgbA: number[], rgbB: number[], amountToMix: number) {
  var r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  var g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  var b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function componentToHex(c: number) {
  var hex = Number(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
