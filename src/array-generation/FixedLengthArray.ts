import type { Digit } from '../common-type-alias/Digit'
import type { Infinity } from '../common-type-alias/Infinity'
import { assertTypeEquality, it } from '../testUtilities'
import type { IsNaturalNumber } from '../type-level-predicate/IsNaturalNumber'

export type FixedLengthArray<N extends number, T = unknown> = N extends N
  ? number extends N
    ? T[]
    : IsNaturalNumber<N> extends false
      ? never
      : `${N}` extends `${string}e+${string}`
        ? T[]
        : DigitsToFixedLengthArray<`${N}`, T>
  : never

it('generates an array type with the specified length', () => {
  assertTypeEquality<FixedLengthArray<0>, []>()
  assertTypeEquality<FixedLengthArray<1>, [unknown]>()
  assertTypeEquality<FixedLengthArray<2>, [unknown, unknown]>()
})
it('allows specifying the element type with the second argument', () => {
  assertTypeEquality<FixedLengthArray<3, bigint>, [bigint, bigint, bigint]>()
  assertTypeEquality<FixedLengthArray<0, string>, []>()
})
it('returns never type for non-natural numbers', () => {
  assertTypeEquality<FixedLengthArray<0.5>, never>()
  assertTypeEquality<FixedLengthArray<-1>, never>()
  assertTypeEquality<FixedLengthArray<-1.5>, never>()
  assertTypeEquality<FixedLengthArray<-1e21>, never>()
  assertTypeEquality<FixedLengthArray<1e-21>, never>()
  assertTypeEquality<FixedLengthArray<-1e-21>, never>()
  assertTypeEquality<FixedLengthArray<Infinity>, never>()
})
it('returns an array type for a huge number', () => {
  assertTypeEquality<FixedLengthArray<1e21>, unknown[]>()
})
it('distributes over union types', () => {
  assertTypeEquality<FixedLengthArray<0 | 1>, [] | [unknown]>()
  assertTypeEquality<FixedLengthArray<never>, never>()
  assertTypeEquality<FixedLengthArray<number>, unknown[]>()
  assertTypeEquality<FixedLengthArray<any>, unknown[]>()
})

type DigitsToFixedLengthArray<S extends string, T = unknown, Acc extends T[] = []> = S extends `${infer H extends Digit}${infer L}`
  ? DigitsToFixedLengthArray<L, T, [...RepeatTupleTenTimes<Acc>, ...DigitToFixedLengthArray<H, T>]>
  : Acc

type RepeatTupleTenTimes<T extends readonly unknown[]> = [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T]

type DigitToFixedLengthArray<N extends Digit, T = unknown> = {
  '0': []
  '1': [T]
  '2': [T, T]
  '3': [T, T, T]
  '4': [T, T, T, T]
  '5': [T, T, T, T, T]
  '6': [T, T, T, T, T, T]
  '7': [T, T, T, T, T, T, T]
  '8': [T, T, T, T, T, T, T, T]
  '9': [T, T, T, T, T, T, T, T, T]
}[N]
