import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { Increment } from '@/number-processing/Increment'
import type { Negate } from '@/number-processing/Negate'
import type { NumberOrderRankOf } from '@/number-processing/NumberOrderRankOf'
import { assertTypeEquality, it } from '@/testUtilities'

/**
 * Returns the smallest integer greater than or equal to the given number.
 *
 * Time complexity: O(1)
 * @example
 * Ceil<1.5> // 2
 * Ceil<2> // 2
 * Ceil<-1.5> // -1
 * Ceil<-2> // -2
 */
export type Ceil<N extends number> = number extends N
  ? number
  : N extends N
    ? NumberOrderRankOf<N> extends 1 | 2 | 5 | 8 | 9
      ? N
      : NumberOrderRankOf<N> extends 6
        ? 1
        : NumberOrderRankOf<N> extends 4
          ? 0
          : `${N}` extends `-${infer I extends number}.${string}`
            ? Negate<I>
            : `${N}` extends `${infer I extends number}.${string}`
              ? Increment<I>
              : N
    : never // Unreachable

it('returns the smallest integer greater than or equal to the given number', () => {
  assertTypeEquality<Ceil<0.01>, 1>()
  assertTypeEquality<Ceil<0.99>, 1>()
  assertTypeEquality<Ceil<1.01>, 2>()
  assertTypeEquality<Ceil<1.99>, 2>()

  assertTypeEquality<Ceil<1e-21>, 1>()
  assertTypeEquality<Ceil<1.5e-21>, 1>()
})
it('returns an integer as is', () => {
  assertTypeEquality<Ceil<1>, 1>()
  assertTypeEquality<Ceil<0>, 0>()
  assertTypeEquality<Ceil<-1>, -1>()
  assertTypeEquality<Ceil<1e21>, 1e21>()
  assertTypeEquality<Ceil<1.5e21>, 1.5e21>()
  assertTypeEquality<Ceil<-1e21>, -1e21>()
  assertTypeEquality<Ceil<-1.5e21>, -1.5e21>()
})
it('truncates the decimal part for positive numbers', () => {
  assertTypeEquality<Ceil<-0.01>, 0>()
  assertTypeEquality<Ceil<-0.99>, 0>()
  assertTypeEquality<Ceil<-1.01>, -1>()
  assertTypeEquality<Ceil<-1.99>, -1>()

  assertTypeEquality<Ceil<-1e-21>, 0>()
  assertTypeEquality<Ceil<-1.5e-21>, 0>()
})
it('returns infinity as is', () => {
  assertTypeEquality<Ceil<Infinity>, Infinity>()
  assertTypeEquality<Ceil<NegativeInfinity>, NegativeInfinity>()
})
