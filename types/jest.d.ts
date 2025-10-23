declare namespace jest {
  interface Matchers<R> {
    toBeTruthy(): R;
    toBeGreaterThan(expected: number): R;
    toBeCloseTo(expected: number, precision?: number): R;
  }
}
