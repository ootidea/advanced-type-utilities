import type { Infinity } from '../common-type-alias/Infinity'
import type { NegativeInfinity } from '../common-type-alias/NegativeInfinity'
import { assertTypeEquality, it } from '../testUtilities'

export type IsNaturalNumber<N extends number> = number extends N
  ? boolean
  : N extends N
    ? `${N}` extends `-${string}`
      ? false
      : `${N}` extends 'Infinity'
        ? false
        : `${N}` extends `${string}e-${string}`
          ? false
          : `${N}` extends `${string}e+${string}`
            ? true
            : `${N}` extends `${string}.${string}`
              ? false
              : true
    : never

it('returns true for natural numbers', () => {
  assertTypeEquality<IsNaturalNumber<1>, true>()
  assertTypeEquality<IsNaturalNumber<1e21>, true>()
})
it('returns false for non-natural numbers', () => {
  assertTypeEquality<IsNaturalNumber<0.5>, false>()
  assertTypeEquality<IsNaturalNumber<1e-21>, false>()
  assertTypeEquality<IsNaturalNumber<Infinity>, false>()
})
it('returns false for negative numbers', () => {
  assertTypeEquality<IsNaturalNumber<-1>, false>()
  assertTypeEquality<IsNaturalNumber<-0.5>, false>()
  assertTypeEquality<IsNaturalNumber<-1e21>, false>()
  assertTypeEquality<IsNaturalNumber<NegativeInfinity>, false>()
})
it('distributes over union types', () => {
  assertTypeEquality<IsNaturalNumber<1 | 2>, true>()
  assertTypeEquality<IsNaturalNumber<0.5 | 1>, boolean>()
  assertTypeEquality<IsNaturalNumber<-1 | 0.5>, false>()
  assertTypeEquality<IsNaturalNumber<number>, boolean>()
  assertTypeEquality<IsNaturalNumber<any>, boolean>()
})
