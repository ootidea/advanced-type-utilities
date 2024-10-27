import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { Increment } from '@/number-processing/Increment'
import type { Negate } from '@/number-processing/Negate'
import type { NumberOrderRankOf } from '@/number-processing/NumberOrderRankOf'
import { assertTypeEquality, it } from '@/testUtilities'

/**
 * Returns the largest integer less than or equal to the given number.
 *
 * Time complexity: O(1)
 * @example
 * Floor<1.5> // 1
 * Floor<2> // 2
 * Floor<-1.5> // -2
 * Floor<-2> // -2
 */
export type Floor<N extends number> = number extends N
  ? number
  : N extends N
    ? NumberOrderRankOf<N> extends 1 | 2 | 5 | 8 | 9
      ? N
      : NumberOrderRankOf<N> extends 6
        ? 0
        : NumberOrderRankOf<N> extends 4
          ? -1
          : `${N}` extends `-${infer I extends number}.${string}`
            ? Negate<Increment<I>>
            : `${N}` extends `${infer I extends number}.${string}`
              ? I
              : N
    : never // Unreachable

it('truncates the decimal part for positive numbers', () => {
  assertTypeEquality<Floor<0.01>, 0>()
  assertTypeEquality<Floor<1.01>, 1>()
  assertTypeEquality<Floor<0.99>, 0>()
  assertTypeEquality<Floor<1.99>, 1>()

  assertTypeEquality<Floor<1e-21>, 0>()
  assertTypeEquality<Floor<1.5e-21>, 0>()
})
it('returns an integer as is', () => {
  assertTypeEquality<Floor<1>, 1>()
  assertTypeEquality<Floor<0>, 0>()
  assertTypeEquality<Floor<-1>, -1>()
  assertTypeEquality<Floor<1e21>, 1e21>()
  assertTypeEquality<Floor<1.5e21>, 1.5e21>()
  assertTypeEquality<Floor<-1e21>, -1e21>()
  assertTypeEquality<Floor<-1.5e21>, -1.5e21>()
})
it('returns the largest integer less than the given negative number', () => {
  assertTypeEquality<Floor<-0.01>, -1>()
  assertTypeEquality<Floor<-0.99>, -1>()
  assertTypeEquality<Floor<-1.01>, -2>()
  assertTypeEquality<Floor<-1.99>, -2>()

  assertTypeEquality<Floor<-1e-21>, -1>()
  assertTypeEquality<Floor<-1.5e-21>, -1>()
})
it('returns infinity as is', () => {
  assertTypeEquality<Floor<Infinity>, Infinity>()
  assertTypeEquality<Floor<NegativeInfinity>, NegativeInfinity>()
})
