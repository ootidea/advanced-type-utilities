import type { Digit } from '@/common-type-alias/Digit'
import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { Decrement } from '@/number-processing/Decrement'
import type { Negate } from '@/number-processing/Negate'
import type { NumberOrderRankOf } from '@/number-processing/NumberOrderRankOf'
import { assertTypeEquality, it } from '@/testUtilities'

/**
 * Increments a number literal type by 1.
 *
 * Time complexity: O(n), where n is the number of digits in the number.
 */
export type Increment<N extends number> = NumberOrderRankOf<N> extends 1 | 2 | 8 | 9
  ? N
  : NumberOrderRankOf<N> extends 4 | 5 | 6
    ? 1
    : `${N}` extends `-0.${string}`
      ? number // TODO: implement this case
      : `${N}` extends `-${infer M extends number}`
        ? Negate<Decrement<M>>
        : `${N}` extends `${infer I}.${infer F}`
          ? `${IncrementDigits<I>}.${F}` extends `${infer R extends number}`
            ? R
            : never // Unreachable
          : IncrementDigits<`${N}`> extends `${infer R extends number}`
            ? R
            : never // Unreachable

it('increments a natural number literal type by 1', () => {
  assertTypeEquality<Increment<0>, 1>()
  assertTypeEquality<Increment<1>, 2>()
  assertTypeEquality<Increment<9>, 10>()
  assertTypeEquality<Increment<10>, 11>()
  assertTypeEquality<Increment<10000>, 10001>()
  assertTypeEquality<Increment<99999>, 100000>()
})
it('increments a positive decimal number literal type by 1', () => {
  assertTypeEquality<Increment<0.5>, 1.5>()
  assertTypeEquality<Increment<1.5>, 2.5>()
  assertTypeEquality<Increment<9.5>, 10.5>()
  assertTypeEquality<Increment<10.5>, 11.5>()
  assertTypeEquality<Increment<10000.5>, 10001.5>()
  assertTypeEquality<Increment<99999.5>, 100000.5>()
})
it('increments a negative integer literal type by 1', () => {
  assertTypeEquality<Increment<-1>, 0>()
  assertTypeEquality<Increment<-2>, -1>()
  assertTypeEquality<Increment<-9>, -8>()
  assertTypeEquality<Increment<-10>, -9>()
})
it('returns the regular number type for numbers in the open interval (-1, 0)', () => {
  // FIXME: should be 0.5
  assertTypeEquality<Increment<-0.5>, number>()
  // FIXME: should be 0.7
  assertTypeEquality<Increment<-0.3>, number>()
})
it('increments a negative decimal number literal type by 1', () => {
  assertTypeEquality<Increment<-1.5>, -0.5>()
  assertTypeEquality<Increment<-9.5>, -8.5>()
  assertTypeEquality<Increment<-10.5>, -9.5>()
})
it('returns the same value for numbers in exponential notation with positive exponents', () => {
  assertTypeEquality<Increment<1e21>, 1e21>()
  assertTypeEquality<Increment<-1e21>, -1e21>()
  assertTypeEquality<Increment<1.5e21>, 1.5e21>()
  assertTypeEquality<Increment<-1.5e21>, -1.5e21>()
})
it('returns infinity as is', () => {
  assertTypeEquality<Increment<Infinity>, Infinity>()
  assertTypeEquality<Increment<NegativeInfinity>, NegativeInfinity>()
})
it('converts numbers in exponential notation with negative exponents to 1', () => {
  assertTypeEquality<Increment<1e-21>, 1>()
  assertTypeEquality<Increment<-1e-21>, 1>()
  assertTypeEquality<Increment<1.5e-21>, 1>()
  assertTypeEquality<Increment<-1.5e-21>, 1>()
})

/**
 * @example
 * IncrementDigits<'0'> // '1'
 * IncrementDigits<'9'> // '10'
 * IncrementDigits<'10'> // '11'
 * IncrementDigits<'99'> // '100'
 */
export type IncrementDigits<N extends string> = N extends `${infer H}${Digit}`
  ? N extends `${H}${infer L extends Exclude<Digit, '9'>}`
    ? `${H}${IncrementDigit<L>}`
    : `${IncrementDigits<H>}0`
  : '1'

type IncrementDigit<N extends Digit> = {
  '0': '1'
  '1': '2'
  '2': '3'
  '3': '4'
  '4': '5'
  '5': '6'
  '6': '7'
  '7': '8'
  '8': '9'
  '9': '0'
}[N]
