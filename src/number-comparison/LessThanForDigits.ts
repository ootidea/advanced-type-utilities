import type { Digit } from '@/common-type-alias/Digit'
import type { Equals } from '@/type-level-predicate/Equals'

/**
 * Checks if N < M for natural numbers in string format.
 * Time complexity: O(n), where n is the minimum of the lengths of N and M.
 * @example
 * LessThanForDigits<'123', '456'> // true
 * LessThanForDigits<'123', '123'> // false
 * LessThanForDigits<'123', '50'> // false
 */
export type LessThanForDigits<N extends string, M extends string> = StringLengthEquals<N, M> extends true
  ? LessThanForSameLengthDigits<N, M>
  : StringLengthLessThan<N, M>

/**
 * @example
 * StringLengthEquals<'1', '2'> // true
 * StringLengthEquals<'1', '11'> // false
 * StringLengthEquals<'11', '1'> // false
 */
type StringLengthEquals<N extends string, M extends string> = N extends `${string}${infer NL}`
  ? M extends `${string}${infer ML}`
    ? StringLengthEquals<NL, ML>
    : false
  : M extends ''
    ? true
    : false

/**
 * @example
 * StringLengthLessThan<'1', '11'> // true
 * StringLengthLessThan<'11', '1'> // false
 * StringLengthLessThan<'11', '11'> // false
 */
type StringLengthLessThan<N extends string, M extends string> = N extends `${string}${infer NL}`
  ? M extends `${string}${infer ML}`
    ? StringLengthLessThan<NL, ML>
    : false
  : M extends ''
    ? false
    : true

/**
 * Returns true if N < M.
 * N and M must have the same number of digits.
 * @example
 * LessThanForSameLengthDigits<'123', '456> // true
 */
type LessThanForSameLengthDigits<N extends string, M extends string> = [N, M] extends [
  `${infer NH extends Digit}${infer NL}`,
  `${infer MH extends Digit}${infer ML}`,
]
  ? Equals<NH, MH> extends true
    ? LessThanForSameLengthDigits<NL, ML>
    : LessThanForDigit<NH, MH>
  : false

export type LessThanForDigit<N extends Digit, M extends Digit> = {
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
