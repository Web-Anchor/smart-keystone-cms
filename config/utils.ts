/**
 * Converts a value (string or number) to a number.
 * If conversion fails (i.e. NaN), logs an error and returns 0.
 *
 * @param value - The input value (string or number)
 * @returns The parsed number, or 0 if invalid.
 */
export function toSafeNumber(value: string | number): number {
  const num = Number(value);

  if (isNaN(num)) {
    console.error(`Invalid number value: ${value}`);
    return 0;
  }
  return num;
}

/**
 * Subtracts two values safely.
 * Uses toSafeNumber to convert each value to a number.
 *
 * @param valueOne - The minuend (string or number)
 * @param valueTwo - The subtrahend (string or number)
 * @returns The difference, or 0 if any input is invalid.
 */
export function safeSubtract(
  valueOne: string | number,
  valueTwo: string | number
): number {
  const numOne = toSafeNumber(valueOne);
  const numTwo = toSafeNumber(valueTwo);
  return numOne - numTwo;
}
