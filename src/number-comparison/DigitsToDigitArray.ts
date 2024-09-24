import type { Digit } from '../type-alias/Digit'

/**
 * @example
 * DigitsToDigitArray<'123'> equals ['1', '2', '3']
 * DigitsToDigitArray<'0'> equals ['0']
 * DigitsToDigitArray<''> equals []
 */
export type DigitsToDigitArray<N extends string> = N extends `${infer H extends Digit}${infer T}` ? [H, ...DigitsToDigitArray<T>] : []
