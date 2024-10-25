import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import { assertTypeEquality, it } from '@/testUtilities'

/**
 * Categorizes a number literal type into one of the following categories:
 * 9: Infinity
 * 8: Positive numbers in exponential notation with positive exponents (e.g., 1e+30)
 * 7: Positive number not in exponential notation (e.g., 1, 0.5)
 * 6: Positive numbers in exponential notation with negative exponents (e.g., 1e-30)
 * 5: Zero
 * 4: Negative numbers in exponential notation with negative exponents (e.g., -1e-30)
 * 3: Negative number not in exponential notation (e.g., -1, -0.5)
 * 2: Negative numbers in exponential notation with positive exponents (e.g., -1e+30)
 * 1: -Infinity
 *
 * Time complexity: O(1)
 */
export type NumberOrderRankOf<T extends number> = T extends T
  ? number extends T
    ? 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    : T extends NegativeInfinity
      ? 1
      : `${T}` extends `-${string}e+${string}`
        ? 2
        : `${T}` extends `-${string}e-${string}`
          ? 4
          : `${T}` extends `-${string}`
            ? 3
            : T extends 0
              ? 5
              : T extends Infinity
                ? 9
                : `${T}` extends `${string}e+${string}`
                  ? 8
                  : `${T}` extends `${string}e-${string}`
                    ? 6
                    : 7
  : never

it('returns the order rank of a number literal type', () => {
  assertTypeEquality<NumberOrderRankOf<Infinity>, 9>()
  assertTypeEquality<NumberOrderRankOf<1e30>, 8>()
  assertTypeEquality<NumberOrderRankOf<9.5e30>, 8>()
  assertTypeEquality<NumberOrderRankOf<1>, 7>()
  assertTypeEquality<NumberOrderRankOf<0.5>, 7>()
  assertTypeEquality<NumberOrderRankOf<1e-30>, 6>()
  assertTypeEquality<NumberOrderRankOf<9.5e-30>, 6>()
  assertTypeEquality<NumberOrderRankOf<0>, 5>()
  assertTypeEquality<NumberOrderRankOf<-1e-30>, 4>()
  assertTypeEquality<NumberOrderRankOf<-9.5e-30>, 4>()
  assertTypeEquality<NumberOrderRankOf<-1>, 3>()
  assertTypeEquality<NumberOrderRankOf<-0.5>, 3>()
  assertTypeEquality<NumberOrderRankOf<-1e30>, 2>()
  assertTypeEquality<NumberOrderRankOf<-9.5e30>, 2>()
  assertTypeEquality<NumberOrderRankOf<NegativeInfinity>, 1>()
})
it('distributes over union types', () => {
  assertTypeEquality<NumberOrderRankOf<-1 | 0 | 1>, 3 | 5 | 7>()
  assertTypeEquality<NumberOrderRankOf<number>, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>()
  assertTypeEquality<NumberOrderRankOf<any>, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>()
  assertTypeEquality<NumberOrderRankOf<never>, never>()
})
