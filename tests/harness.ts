export type TestFn = () => void | Promise<void>;

const tests: { name: string; fn: TestFn }[] = [];
let suiteStack: string[] = [];

export const describe = (name: string, fn: () => void) => {
  suiteStack.push(name);
  try {
    fn();
  } finally {
    suiteStack.pop();
  }
};

export const it = (name: string, fn: TestFn) => {
  const fullName = [...suiteStack, name].join(' › ');
  tests.push({ name: fullName, fn });
};

export const expect = (value: any) => ({
  toBeTruthy: () => {
    if (!value) {
      throw new Error(`Expected value to be truthy but received ${value}`);
    }
  },
  toBeCloseTo: (expected: number, precision = 2) => {
    const actual = Number(value);
    const factor = Math.pow(10, precision);
    if (Math.round(Math.abs(actual - expected) * factor) / factor > 0) {
      throw new Error(`Expected ${actual} to be close to ${expected} with precision ${precision}`);
    }
  },
  toBeGreaterThan: (expected: number) => {
    const actual = Number(value);
    if (!(actual > expected)) {
      throw new Error(`Expected ${actual} to be greater than ${expected}`);
    }
  },
});

export const run = async () => {
  let passed = 0;
  for (const test of tests) {
    try {
      await test.fn();
      console.log(`✓ ${test.name}`);
      passed += 1;
    } catch (error) {
      console.error(`✗ ${test.name}`);
      console.error(error);
      process.exitCode = 1;
    }
  }
  console.log(`\n${passed}/${tests.length} tests passed`);
};
