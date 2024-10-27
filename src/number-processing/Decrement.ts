import type { Digit } from '@/common-type-alias/Digit'
import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { Increment } from '@/number-processing/Increment'
import type { Negate } from '@/number-processing/Negate'
import type { NumberOrderRankOf } from '@/number-processing/NumberOrderRankOf'
import { assertTypeEquality, it } from '@/testUtilities'

/**
 * Decrements a number literal type by 1.
 *
 * Time complexity: O(n), where n is the number of digits in the number.
 */
export type Decrement<N extends number> = NumberOrderRankOf<N> extends 1 | 2 | 8 | 9
  ? N
  : NumberOrderRankOf<N> extends 4 | 5 | 6
    ? -1
    : `${N}` extends `0.${string}`
      ? number // TODO: implement this case
      : `${N}` extends `-${infer M extends number}`
        ? Negate<Increment<M>>
        : `${N}` extends `${infer I}.${infer F}`
          ? `${DecrementDigits<I>}.${F}` extends `${infer R extends number}`
            ? R
            : never // Unreachable
          : N extends 1
            ? 0
            : DecrementDigits<`${N}`> extends `${infer R extends number}`
              ? R
              : never // Unreachable

it('decrements a natural number literal type by 1', () => {
  assertTypeEquality<Decrement<0>, -1>()
  assertTypeEquality<Decrement<1>, 0>()
  assertTypeEquality<Decrement<9>, 8>()
  assertTypeEquality<Decrement<10>, 9>()
  assertTypeEquality<Decrement<10000>, 9999>()
  assertTypeEquality<Decrement<10001>, 10000>()
})
it('returns the regular number type for numbers in the open interval (0, 1)', () => {
  // FIXME: should be -0.5
  assertTypeEquality<Decrement<0.5>, number>()
  // FIXME: should be -0.7
  assertTypeEquality<Decrement<0.3>, number>()
})
it('decrements a positive decimal number literal type by 1', () => {
  assertTypeEquality<Decrement<1.5>, 0.5>()
  assertTypeEquality<Decrement<9.5>, 8.5>()
  assertTypeEquality<Decrement<10.5>, 9.5>()
  assertTypeEquality<Decrement<10000.5>, 9999.5>()
})
it('decrements a negative integer literal type by 1', () => {
  assertTypeEquality<Decrement<-1>, -2>()
  assertTypeEquality<Decrement<-2>, -3>()
  assertTypeEquality<Decrement<-9>, -10>()
  assertTypeEquality<Decrement<-10>, -11>()
})
it('decrements a negative decimal number literal type by 1', () => {
  assertTypeEquality<Decrement<-1.5>, -2.5>()
  assertTypeEquality<Decrement<-9.5>, -10.5>()
  assertTypeEquality<Decrement<-10.5>, -11.5>()
})
it('returns the same value for numbers in exponential notation with positive exponents', () => {
  assertTypeEquality<Decrement<1e21>, 1e21>()
  assertTypeEquality<Decrement<-1e21>, -1e21>()
  assertTypeEquality<Decrement<1.5e21>, 1.5e21>()
  assertTypeEquality<Decrement<-1.5e21>, -1.5e21>()
})
it('returns infinity as is', () => {
  assertTypeEquality<Decrement<Infinity>, Infinity>()
  assertTypeEquality<Decrement<NegativeInfinity>, NegativeInfinity>()
})
it('converts numbers in exponential notation with negative exponents to 1', () => {
  assertTypeEquality<Decrement<1e-21>, -1>()
  assertTypeEquality<Decrement<-1e-21>, -1>()
  assertTypeEquality<Decrement<1.5e-21>, -1>()
  assertTypeEquality<Decrement<-1.5e-21>, -1>()
})

/**
 * @example
 * DecrementDigits<'1'> // '0'
 * DecrementDigits<'9'> // '8'
 * DecrementDigits<'10'> // '9'
 * DecrementDigits<'11'> // '10'
 * DecrementDigits<'0'> // '9'
 */
export type DecrementDigits<N extends string> = N extends '1' ? '0' : DecrementDigitsLoop<N>

type DecrementDigitsLoop<N extends string> = N extends '1'
  ? ''
  : N extends `${infer H}${Digit}`
    ? N extends `${H}${infer L extends Exclude<Digit, '0'>}`
      ? `${H}${DecrementDigit<L>}`
      : `${DecrementDigitsLoop<H>}9`
    : ''

type DecrementDigit<N extends Digit> = {
  '0': '9'
  '1': '0'
  '2': '1'
  '3': '2'
  '4': '3'
  '5': '4'
  '6': '5'
  '7': '6'
  '8': '7'
  '9': '8'
}[N]
