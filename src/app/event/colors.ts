import { cloneDeep } from 'lodash';

export interface IRGBColor {
  red: number;
  green: number;
  blue: number;
}

export function lightenColor(hexCode: string, amtPercentage: number): string {
  const rgb = hexToRGB(hexCode);

  Object.keys(rgb).forEach((key) => {
    const newVal = rgb[key] * (1 - (amtPercentage / 100));

    if (newVal > 255) {
      rgb[key] = 255;
    } else if (newVal < 0) {
      rgb[key] = 0;
    } else {
      rgb[key] = newVal;
    }
  });

  return `rgb(${rgb.red}, ${rgb.green}, ${rgb.red})`;
}

export function transparentize(hexCode: string, amtPercentage: number): string {
  const rgb = hexToRGB(hexCode);
  const alpha = 1 - (amtPercentage / 100);
  // const alpha = 1;

  return `rgba(${rgb.red}, ${rgb.blue}, ${rgb.green}, ${alpha})`;
}

export function hexToRGB(hexCode: string): IRGBColor {
  let copiedHexCode: string;
  if (hexCode[0] === '#') {
    copiedHexCode = hexCode.slice(1);
  } else {
    copiedHexCode = cloneDeep(hexCode);
  }

  const num = parseInt(copiedHexCode, 16);
  // tslint:disable-next-line:no-bitwise
  let red = (num >> 16);
  if (red > 255) {
    red = 255;
  } else if (red < 0) {
    red = 0;
  }

  // tslint:disable-next-line:no-bitwise
  let blue = ((num >> 8) & 0x00FF);
  if (blue > 255) {
    blue = 255;
  } else if (blue < 0) {
    blue = 0;
  }

  // tslint:disable-next-line:no-bitwise
  let green = (num & 0x0000FF);
  if (green > 255) {
    green = 255;
  } else if (green < 0) {
    green = 0;
  }

  // tslint:disable-next-line:no-bitwise
  return { blue, green, red };
}
