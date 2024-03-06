
export const lowColor: Color = [50, 200, 50];
export const highColor: Color = [255, 100, 100];

export type Color = [number, number, number];

export const colorLerp = (c1: Color, c2: Color, v: number): Color => {
  if (v < 0.0) {
    v = 0.0;
  } else if (v > 1) {
    v = 1.0;
  }
  const r = c1[0] * (1.0 - v) + c2[0] * v;
  const g = c1[1] * (1.0 - v) + c2[1] * v;
  const b = c1[2] * (1.0 - v) + c2[2] * v;
  return [r, g, b];
};

export const toCSSColor = (c: Color): string => {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};