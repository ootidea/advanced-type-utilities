import type { Digit } from '@/common-type-alias/Digit'
import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { Trunc } from '@/number-processing/Trunc'
import { assertTypeEquality, it } from '@/testUtilities'

export type DescendingSequentialNumbersThrough<N extends number> = number extends N
  ? number[]
  : `${N}` extends `-${string}`
    ? never
    : `${N}` extends `${string}e+${string}` | 'Infinity'
      ? number[]
      : DescendingSequentialDigitsesThrough<`${Trunc<N>}`> extends infer R extends readonly string[]
        ? { [K in keyof R]: R[K] extends `${infer M extends number}` ? M : never }
        : never

it('generates an array type of sequential numbers descending from a given number to 0', () => {
  assertTypeEquality<DescendingSequentialNumbersThrough<0>, [0]>()
  assertTypeEquality<DescendingSequentialNumbersThrough<1>, [1, 0]>()
  assertTypeEquality<DescendingSequentialNumbersThrough<9>, [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]>()
  assertTypeEquality<DescendingSequentialNumbersThrough<10>, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]>()
  assertTypeEquality<
    DescendingSequentialNumbersThrough<23>,
    [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  >()
  assertTypeEquality<DescendingSequentialNumbersThrough<999>['length'], 1000>()
})
it('returns the never type for negative numbers', () => {
  assertTypeEquality<DescendingSequentialNumbersThrough<-1>, never>()
  assertTypeEquality<DescendingSequentialNumbersThrough<-1.5>, never>()
  assertTypeEquality<DescendingSequentialNumbersThrough<-1e21>, never>()
  assertTypeEquality<DescendingSequentialNumbersThrough<-1e-21>, never>()
  assertTypeEquality<DescendingSequentialNumbersThrough<NegativeInfinity>, never>()
})
it('ignores fractional parts of given numbers', () => {
  assertTypeEquality<DescendingSequentialNumbersThrough<1.5>, [1, 0]>()
  assertTypeEquality<DescendingSequentialNumbersThrough<1e-21>, [0]>()
})
it('returns the regular number array type for natural numbers in exponential notation', () => {
  assertTypeEquality<DescendingSequentialNumbersThrough<1e21>, number[]>()
})
it('returns the regular number array type for Infinity', () => {
  assertTypeEquality<DescendingSequentialNumbersThrough<Infinity>, number[]>()
})
it('distributes over union types', () => {
  assertTypeEquality<DescendingSequentialNumbersThrough<0 | 1>, [0] | [1, 0]>()
  assertTypeEquality<DescendingSequentialNumbersThrough<never>, never>()
  assertTypeEquality<DescendingSequentialNumbersThrough<number>, number[]>()
  assertTypeEquality<DescendingSequentialNumbersThrough<any>, number[]>()
})

/**
 * @example
 * DescendingSequentialDigitsesThrough<'0'> // ['0']
 * DescendingSequentialDigitsesThrough<'1'> // ['1', '0']
 * DescendingSequentialDigitsesThrough<'99'> // ['99', '98', ..., '0']
 */
type DescendingSequentialDigitsesThrough<N extends string> = N extends Digit
  ? DescendingSequentialDigitsThrough<N>
  : N extends `${infer H extends Digit}${infer L}`
    ? [
        ...PrependStringToTupleElements<AfterSecondDigitDescendingSequentialDigitsesThrough<L>, H>,
        ...FillLowerBlockDescendingSequentialDigitses<H, L>,
        ...DescendingSequentialSameLengthAllDigitses<L>,
      ]
    : []
type AfterSecondDigitDescendingSequentialDigitsesThrough<N extends string> = N extends Digit
  ? DescendingSequentialDigitsThrough<N>
  : N extends `${infer H extends Digit}${infer L}`
    ? [
        ...PrependStringToTupleElements<AfterSecondDigitDescendingSequentialDigitsesThrough<L>, H>,
        ...FillLowerBlockDescendingSequentialDigitses<H, L>,
        ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '0'>,
      ]
    : []

type DescendingSequentialDigitsThrough<N extends Digit> = {
  '0': ['0']
  '1': ['1', '0']
  '2': ['2', '1', '0']
  '3': ['3', '2', '1', '0']
  '4': ['4', '3', '2', '1', '0']
  '5': ['5', '4', '3', '2', '1', '0']
  '6': ['6', '5', '4', '3', '2', '1', '0']
  '7': ['7', '6', '5', '4', '3', '2', '1', '0']
  '8': ['8', '7', '6', '5', '4', '3', '2', '1', '0']
  '9': ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0']
}[N]

/**
 * @example
 * FillLowerBlockDescendingSequentialDigitses<'1', '56'> // []
 * FillLowerBlockDescendingSequentialDigitses<'2', '56'> // ['199', '198', ..., '100']
 * FillLowerBlockDescendingSequentialDigitses<'3', '56'> // ['299', '298', ..., '100']
 * FillLowerBlockDescendingSequentialDigitses<'1', '1'> // []
 * FillLowerBlockDescendingSequentialDigitses<'2', '1'> // ['19', '18', ..., '10']
 * FillLowerBlockDescendingSequentialDigitses<'3', '1'> // ['29', '28', ..., '10']
 */
type FillLowerBlockDescendingSequentialDigitses<H extends Digit, L extends string> = {
  '0': []
  '1': []
  '2': PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>
  '3': [
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '2'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>,
  ]
  '4': [
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '3'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '2'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>,
  ]
  '5': [
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '4'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '3'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '2'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>,
  ]
  '6': [
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '5'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '4'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '3'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '2'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>,
  ]
  '7': [
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '6'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '5'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '4'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '3'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '2'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>,
  ]
  '8': [
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '7'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '6'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '5'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '4'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '3'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '2'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>,
  ]
  '9': [
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '8'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '7'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '6'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '5'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '4'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '3'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '2'>,
    ...PrependStringToTupleElements<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>, '1'>,
  ]
}[H]

/**
 * @example
 * DescendingSequentialSameLengthAllDigitsesWithLeadingZero<'3'> // ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0']
 * DescendingSequentialSameLengthAllDigitsesWithLeadingZero<'63'> // ['99', '98', ..., '00']
 * DescendingSequentialSameLengthAllDigitsesWithLeadingZero<'111'> // ['999', '998', ..., '000']
 */
type DescendingSequentialSameLengthAllDigitsesWithLeadingZero<N extends string> = N extends Digit
  ? ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0']
  : N extends `${Digit}${infer L}`
    ? DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L> extends infer R extends readonly string[]
      ? [
          ...{ [K in keyof R]: `9${R[K]}` },
          ...{ [K in keyof R]: `8${R[K]}` },
          ...{ [K in keyof R]: `7${R[K]}` },
          ...{ [K in keyof R]: `6${R[K]}` },
          ...{ [K in keyof R]: `5${R[K]}` },
          ...{ [K in keyof R]: `4${R[K]}` },
          ...{ [K in keyof R]: `3${R[K]}` },
          ...{ [K in keyof R]: `2${R[K]}` },
          ...{ [K in keyof R]: `1${R[K]}` },
          ...{ [K in keyof R]: `0${R[K]}` },
        ]
      : never // Unreachable
    : []

/**
 * @example
 * DescendingSequentialSameLengthAllDigitses<'3'> // ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0']
 * DescendingSequentialSameLengthAllDigitses<'63'> // ['99', '98', ..., '00']
 * DescendingSequentialSameLengthAllDigitses<'111'> // ['999', '998', ..., '000']
 */
type DescendingSequentialSameLengthAllDigitses<N extends string> = N extends Digit
  ? DescendingSequentialSameLengthAllDigitsesWithLeadingZero<N>
  : N extends `${Digit}${infer L}`
    ? [...Prepend9To1ToTuple<DescendingSequentialSameLengthAllDigitsesWithLeadingZero<L>>, ...DescendingSequentialSameLengthAllDigitses<L>]
    : []

type Prepend9To1ToTuple<T extends readonly string[]> = [
  ...{ [K in keyof T]: `9${T[K]}` },
  ...{ [K in keyof T]: `8${T[K]}` },
  ...{ [K in keyof T]: `7${T[K]}` },
  ...{ [K in keyof T]: `6${T[K]}` },
  ...{ [K in keyof T]: `5${T[K]}` },
  ...{ [K in keyof T]: `4${T[K]}` },
  ...{ [K in keyof T]: `3${T[K]}` },
  ...{ [K in keyof T]: `2${T[K]}` },
  ...{ [K in keyof T]: `1${T[K]}` },
]

/**
 * @example
 * PrependStringToTupleElements<['0', '1', '2'], '5'> // ['50', '51', '52']
 * PrependStringToTupleElements<['50', '51', '52'], '2'> // ['250', '251', '252']
 */
type PrependStringToTupleElements<T extends readonly string[], S extends string> = { [P in keyof T]: `${S}${T[P]}` }
