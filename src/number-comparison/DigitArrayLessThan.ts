import type { Equals } from '../Type level predicate/Equals'
import type { Digit } from '../type-alias/Digit'
import type { DigitsToDigitArray } from './DigitsToDigitArray'

/**
 * @example
 * DigitArrayLessThan<['1', '2', '3'], ['4', '5']> // false
 * DigitArrayLessThan<['1', '2', '3'], ['4', '5', '6']> // true
 */
export type DigitArrayLessThan<N extends readonly Digit[], M extends readonly Digit[]> = Equals<N['length'], M['length']> extends true
  ? SameLengthDigitArrayLessThan<N, M>
  : DigitArrayLessThan<DigitsToDigitArray<`${N['length']}`>, DigitsToDigitArray<`${M['length']}`>>

/**
 * @example
 * SameLengthDigitArrayLessThan<'123', '123'> // false
 * SameLengthDigitArrayLessThan<'123', '200'> // true
 */
type SameLengthDigitArrayLessThan<N extends readonly Digit[], M extends readonly Digit[]> = [N, M] extends [
  [infer NH extends Digit, ...infer NT extends Digit[]],
  [infer MH extends Digit, ...infer MT extends Digit[]],
]
  ? Equals<NH, MH> extends true
    ? SameLengthDigitArrayLessThan<NT, MT>
    : DigitLessThan<NH, MH>
  : false

type DigitLessThan<N extends Digit, M extends Digit> = {
  '0': { '0': false; '1': true; '2': true; '3': true; '4': true; '5': true; '6': true; '7': true; '8': true; '9': true }
  '1': { '0': false; '1': false; '2': true; '3': true; '4': true; '5': true; '6': true; '7': true; '8': true; '9': true }
  '2': { '0': false; '1': false; '2': false; '3': true; '4': true; '5': true; '6': true; '7': true; '8': true; '9': true }
  '3': { '0': false; '1': false; '2': false; '3': false; '4': true; '5': true; '6': true; '7': true; '8': true; '9': true }
  '4': { '0': false; '1': false; '2': false; '3': false; '4': false; '5': true; '6': true; '7': true; '8': true; '9': true }
  '5': { '0': false; '1': false; '2': false; '3': false; '4': false; '5': false; '6': true; '7': true; '8': true; '9': true }
  '6': { '0': false; '1': false; '2': false; '3': false; '4': false; '5': false; '6': false; '7': true; '8': true; '9': true }
  '7': { '0': false; '1': false; '2': false; '3': false; '4': false; '5': false; '6': false; '7': false; '8': true; '9': true }
  '8': { '0': false; '1': false; '2': false; '3': false; '4': false; '5': false; '6': false; '7': false; '8': false; '9': true }
  '9': { '0': false; '1': false; '2': false; '3': false; '4': false; '5': false; '6': false; '7': false; '8': false; '9': false }
}[N][M]
