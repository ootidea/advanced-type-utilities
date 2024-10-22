import type { Digit } from '@/common-type-alias/Digit'
import type { DigitLessThan } from '@/number-comparison/DigitsLessThan'
import { assertTypeEquality, describe, it, test } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type DigitsRangeBetween<
  N extends string,
  M extends string,
  Raw extends [string, string] = [N, M],
  Digits extends string = '',
> = N extends Digit
  ? M extends Digit
    ? SameLengthDigitsRangeBetween<Raw[0], Raw[1]> // N and M are completed.
    : M extends `${infer MR}${Digit}`
      ? SameLengthDigitsRangeAtLeast<Raw[0]> | DigitsRangeBetween<'', MR, Raw, `${Digits}${Digit}`> // N is completed. M is not yet completed.
      : SameLengthDigitsRangeAtMost<Raw[0]> // N is completed. M is already completed.
  : N extends `${infer NR}${Digit}`
    ? M extends Digit
      ? SameLengthDigitsRangeAtLeast<Raw[1]> | DigitsRangeBetween<NR, '', Raw, `${Digits}${Digit}`> // N is not yet completed. M is completed.
      : M extends `${infer MR}${Digit}`
        ? DigitsRangeBetween<NR, MR, Raw, `${Digits}${Digit}`> // N and M are not yet completed.
        : `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${Digits}` | DigitsRangeBetween<NR, '', Raw, `${Digits}${Digit}`> // N is not yet completed. M is already completed.
    : M extends Digit
      ? SameLengthDigitsRangeAtMost<Raw[1]> // N is already completed. M is completed.
      : M extends `${infer MR}${Digit}`
        ? `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${Digits}` | DigitsRangeBetween<'', MR, Raw, `${Digits}${Digit}`> // N is already completed. M is not yet completed.
        : never // N and M are already completed.

describe('DigitsRangeBetween', () => {
  test('single-digit comparison', () => {
    assertTypeEquality<DigitsRangeBetween<'0', '2'>, '0' | '1' | '2'>()
    assertTypeEquality<DigitsRangeBetween<'2', '0'>, '0' | '1' | '2'>()
    assertTypeEquality<DigitsRangeBetween<'0', '9'>, Digit>()
    assertTypeEquality<DigitsRangeBetween<'9', '0'>, Digit>()
    assertTypeEquality<DigitsRangeBetween<'5', '5'>, '5'>()
  })
  test('one-digit difference', () => {
    assertTypeEquality<DigitsRangeBetween<'8', '11'>, '8' | '9' | '10' | '11'>()
    assertTypeEquality<DigitsRangeBetween<'11', '8'>, '8' | '9' | '10' | '11'>()
    assertTypeEquality<
      DigitsRangeBetween<'97', '111'>,
      '97' | '98' | '99' | '100' | '101' | '102' | '103' | '104' | '105' | '106' | '107' | '108' | '109' | '110' | '111'
    >()
    assertTypeEquality<
      DigitsRangeBetween<'111', '97'>,
      '97' | '98' | '99' | '100' | '101' | '102' | '103' | '104' | '105' | '106' | '107' | '108' | '109' | '110' | '111'
    >()
  })
  test('two-digit difference', () => {
    assertTypeEquality<DigitsRangeBetween<'9', '100'>, '9' | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${Digit}` | '100'>()
    assertTypeEquality<DigitsRangeBetween<'8', '101'>, '8' | '9' | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${Digit}` | '100' | '101'>()
    assertTypeEquality<DigitsRangeBetween<'9', '110'>, '9' | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${Digit}` | `10${Digit}` | '110'>()
  })
  test('around 10000', () => {
    assertTypeEquality<DigitsRangeBetween<'10000', '10001'>, '10000' | '10001'>()
    assertTypeEquality<DigitsRangeBetween<'10000', '9999'>, '9999' | '10000'>()
    assertTypeEquality<DigitsRangeBetween<'10001', '10000'>, '10000' | '10001'>()
    assertTypeEquality<DigitsRangeBetween<'9999', '10000'>, '9999' | '10000'>()
  })
  it('distributes over union types', () => {
    assertTypeEquality<DigitsRangeBetween<'0' | '3', '2'>, '0' | '1' | '2' | '3'>()
    assertTypeEquality<DigitsRangeBetween<'2', '0' | '3'>, '0' | '1' | '2' | '3'>()
  })
})

/**
 * Returns the union type of an integer between two integers.
 * N and M must have the same number of digits.
 * @example
 * SameLengthDigitsRangeBetween<'4', '8'> // '4' | '5' | '6' | '7' | '8'
 * SameLengthDigitsRangeBetween<'87', '92'> // '87' | '88' | '89' | '90' | '91' | '92'
 */
type SameLengthDigitsRangeBetween<N extends string, M extends string> = [N, M] extends [
  `${infer NH extends Digit}${infer NL}`,
  `${infer MH extends Digit}${infer ML}`,
]
  ? Equals<NH, MH> extends true
    ? `${NH}${SameLengthDigitsRangeBetween<NL, ML>}`
    : DigitLessThan<NH, MH> extends true
      ?
          | `${NH}${SameLengthDigitsRangeAtLeast<NL>}`
          | `${DigitRangeStrictlyBetween<NH, MH>}${ReplaceAllLetterWithDigit<NL>}`
          | `${MH}${SameLengthDigitsRangeAtMost<ML>}`
      :
          | `${MH}${SameLengthDigitsRangeAtLeast<ML>}`
          | `${DigitRangeStrictlyBetween<NH, MH>}${ReplaceAllLetterWithDigit<NL>}`
          | `${NH}${SameLengthDigitsRangeAtMost<NL>}`
  : ''

/**
 * @example
 * SameLengthDigitsRangeAtLeast<'4'> // '4' | '5' | '6' | '7' | '8' | '9'
 * SameLengthDigitsRangeAtLeast<'87'> // '87' | '88' | '89' | '90' | '91' | '92' | '93' | '94' | '95' | '96' | '97' | '98' | '99'
 */
type SameLengthDigitsRangeAtLeast<N extends string> = N extends `${infer H extends Digit}${infer L}`
  ? `${H}${SameLengthDigitsRangeAtLeast<L>}` | `${DigitRangeGreaterThan<H>}${ReplaceAllLetterWithDigit<L>}`
  : ''

/**
 * @example
 * SameLengthDigitsRangeAtMost<'21'> // '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21'
 */
type SameLengthDigitsRangeAtMost<N extends string> = N extends `${infer H extends Digit}${infer L}`
  ? `${Exclude<DigitRangeLessThan<H>, '0'>}${ReplaceAllLetterWithDigit<L>}` | `${H}${SameLengthDigitsRangeAtMostAfterFirstDigit<L>}`
  : ''
type SameLengthDigitsRangeAtMostAfterFirstDigit<N extends string> = N extends `${infer H extends Digit}${infer L}`
  ? `${DigitRangeLessThan<H>}${ReplaceAllLetterWithDigit<L>}` | `${H}${SameLengthDigitsRangeAtMostAfterFirstDigit<L>}`
  : ''

/**
 * @example
 * ReplaceAllLetterWithDigit<'abc'> // `${Digit}${Digit}${Digit}`
 */
type ReplaceAllLetterWithDigit<T extends string> = T extends `${string}${infer L}` ? `${Digit}${ReplaceAllLetterWithDigit<L>}` : ''

type DigitRangeGreaterThan<N extends Digit> = {
  '0': '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  '1': '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  '2': '3' | '4' | '5' | '6' | '7' | '8' | '9'
  '3': '4' | '5' | '6' | '7' | '8' | '9'
  '4': '5' | '6' | '7' | '8' | '9'
  '5': '6' | '7' | '8' | '9'
  '6': '7' | '8' | '9'
  '7': '8' | '9'
  '8': '9'
  '9': never
}[N]

type DigitRangeLessThan<N extends Digit> = {
  '0': never
  '1': '0'
  '2': '0' | '1'
  '3': '0' | '1' | '2'
  '4': '0' | '1' | '2' | '3'
  '5': '0' | '1' | '2' | '3' | '4'
  '6': '0' | '1' | '2' | '3' | '4' | '5'
  '7': '0' | '1' | '2' | '3' | '4' | '5' | '6'
  '8': '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'
  '9': '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
}[N]

type DigitRangeStrictlyBetween<N extends Digit, M extends Digit> = {
  '0': {
    '0': never
    '1': never
    '2': '1'
    '3': '1' | '2'
    '4': '1' | '2' | '3'
    '5': '1' | '2' | '3' | '4'
    '6': '1' | '2' | '3' | '4' | '5'
    '7': '1' | '2' | '3' | '4' | '5' | '6'
    '8': '1' | '2' | '3' | '4' | '5' | '6' | '7'
    '9': '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  }
  '1': {
    '0': never
    '1': never
    '2': never
    '3': '2'
    '4': '2' | '3'
    '5': '2' | '3' | '4'
    '6': '2' | '3' | '4' | '5'
    '7': '2' | '3' | '4' | '5' | '6'
    '8': '2' | '3' | '4' | '5' | '6' | '7'
    '9': '2' | '3' | '4' | '5' | '6' | '7' | '8'
  }
  '2': {
    '0': '1'
    '1': never
    '2': never
    '3': never
    '4': '3'
    '5': '3' | '4'
    '6': '3' | '4' | '5'
    '7': '3' | '4' | '5' | '6'
    '8': '3' | '4' | '5' | '6' | '7'
    '9': '3' | '4' | '5' | '6' | '7' | '8'
  }
  '3': {
    '0': '1' | '2'
    '1': '2'
    '2': never
    '3': never
    '4': never
    '5': '4'
    '6': '4' | '5'
    '7': '4' | '5' | '6'
    '8': '4' | '5' | '6' | '7'
    '9': '4' | '5' | '6' | '7' | '8'
  }
  '4': {
    '0': '1' | '2' | '3'
    '1': '2' | '3'
    '2': '3'
    '3': never
    '4': never
    '5': never
    '6': '5'
    '7': '5' | '6'
    '8': '5' | '6' | '7'
    '9': '5' | '6' | '7' | '8'
  }
  '5': {
    '0': '1' | '2' | '3' | '4'
    '1': '2' | '3' | '4'
    '2': '3' | '4'
    '3': '4'
    '4': never
    '5': never
    '6': never
    '7': '6'
    '8': '6' | '7'
    '9': '6' | '7' | '8'
  }
  '6': {
    '0': '1' | '2' | '3' | '4' | '5'
    '1': '2' | '3' | '4' | '5'
    '2': '3' | '4' | '5'
    '3': '4' | '5'
    '4': '5'
    '5': never
    '6': never
    '7': never
    '8': '7'
    '9': '7' | '8'
  }
  '7': {
    '0': '1' | '2' | '3' | '4' | '5' | '6'
    '1': '2' | '3' | '4' | '5' | '6'
    '2': '3' | '4' | '5' | '6'
    '3': '4' | '5' | '6'
    '4': '5' | '6'
    '5': '6'
    '6': never
    '7': never
    '8': never
    '9': '8'
  }
  '8': {
    '0': '1' | '2' | '3' | '4' | '5' | '6' | '7'
    '1': '2' | '3' | '4' | '5' | '6' | '7'
    '2': '3' | '4' | '5' | '6' | '7'
    '3': '4' | '5' | '6' | '7'
    '4': '5' | '6' | '7'
    '5': '6' | '7'
    '6': '7'
    '7': never
    '8': never
    '9': never
  }
  '9': {
    '0': '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
    '1': '2' | '3' | '4' | '5' | '6' | '7' | '8'
    '2': '3' | '4' | '5' | '6' | '7' | '8'
    '3': '4' | '5' | '6' | '7' | '8'
    '4': '5' | '6' | '7' | '8'
    '5': '6' | '7' | '8'
    '6': '7' | '8'
    '7': '8'
    '8': never
    '9': never
  }
}[N][M]
