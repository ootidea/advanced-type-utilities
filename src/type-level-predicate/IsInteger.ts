import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { NumberOrderRankOf } from '@/number-processing/NumberOrderRankOf'
import { assertTypeEquality, it } from '@/testUtilities'

export type IsInteger<N extends number> = number extends N
  ? boolean
  : N extends N
    ? NumberOrderRankOf<N> extends 2 | 5 | 8
      ? true
      : NumberOrderRankOf<N> extends 3 | 7
        ? `${N}` extends `${number}.${string}`
          ? false
          : true
        : false
    : never

it('returns true for natural numbers', () => {
  assertTypeEquality<IsInteger<0>, true>()
  assertTypeEquality<IsInteger<123>, true>()
  assertTypeEquality<IsInteger<1e21>, true>()
  assertTypeEquality<IsInteger<1.5e21>, true>()
})
it('returns false for negative numbers', () => {
  assertTypeEquality<IsInteger<-9>, true>()
  assertTypeEquality<IsInteger<-1e21>, true>()
  assertTypeEquality<IsInteger<-1.5e21>, true>()
})
it('returns false for non-integer numbers', () => {
  assertTypeEquality<IsInteger<0.5>, false>()
  assertTypeEquality<IsInteger<-0.5>, false>()
  assertTypeEquality<IsInteger<1e-21>, false>()
  assertTypeEquality<IsInteger<-1e-21>, false>()
  assertTypeEquality<IsInteger<Infinity>, false>()
  assertTypeEquality<IsInteger<NegativeInfinity>, false>()
})
it('distributes over union types', () => {
  assertTypeEquality<IsInteger<1 | -2>, true>()
  assertTypeEquality<IsInteger<0.5 | 2.5>, false>()
  assertTypeEquality<IsInteger<-0.5 | 1>, boolean>()
  assertTypeEquality<IsInteger<number>, boolean>()
  assertTypeEquality<IsInteger<any>, boolean>()
  assertTypeEquality<IsInteger<never>, never>()
})
