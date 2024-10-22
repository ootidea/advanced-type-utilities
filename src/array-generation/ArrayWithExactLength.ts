import type { Digit } from '@/common-type-alias/Digit'
import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import { assertTypeEquality, it } from '@/testUtilities'
import type { IsNaturalNumber } from '@/type-level-predicate/IsNaturalNumber'

export type ArrayWithExactLength<N extends number, T = unknown> = number extends N
  ? T[]
  : N extends N
    ? `${N}` extends `-${string}`
      ? never
      : IsNaturalNumber<N> extends false
        ? T[]
        : `${N}` extends `${string}e+${string}`
          ? T[]
          : DigitsToArrayWithExactLength<`${N}`, T>
    : never // Unreachable

it('generates an array type with the specified length', () => {
  assertTypeEquality<ArrayWithExactLength<0>, []>()
  assertTypeEquality<ArrayWithExactLength<1>, [unknown]>()
  assertTypeEquality<ArrayWithExactLength<2>, [unknown, unknown]>()
})
it('allows specifying the element type with the second argument', () => {
  assertTypeEquality<ArrayWithExactLength<3, bigint>, [bigint, bigint, bigint]>()
  assertTypeEquality<ArrayWithExactLength<0, string>, []>()
})
it('returns the never type for negative numbers', () => {
  assertTypeEquality<ArrayWithExactLength<-1>, never>()
  assertTypeEquality<ArrayWithExactLength<-1.5>, never>()
  assertTypeEquality<ArrayWithExactLength<-1e21>, never>()
  assertTypeEquality<ArrayWithExactLength<-1e-21>, never>()
  assertTypeEquality<ArrayWithExactLength<NegativeInfinity>, never>()
})
it('returns a regular array type for natural numbers in exponential notation', () => {
  assertTypeEquality<ArrayWithExactLength<1e21>, unknown[]>()
})
it('returns a regular array type for other numbers', () => {
  assertTypeEquality<ArrayWithExactLength<0.5>, unknown[]>()
  assertTypeEquality<ArrayWithExactLength<1e-21>, unknown[]>()
  assertTypeEquality<ArrayWithExactLength<Infinity>, unknown[]>()
})
it('distributes over union types', () => {
  assertTypeEquality<ArrayWithExactLength<0 | 1>, [] | [unknown]>()
  assertTypeEquality<ArrayWithExactLength<never>, never>()
  assertTypeEquality<ArrayWithExactLength<number>, unknown[]>()
  assertTypeEquality<ArrayWithExactLength<any>, unknown[]>()
})

type DigitsToArrayWithExactLength<S extends string, T = unknown, Acc extends T[] = []> = S extends `${infer H extends Digit}${infer L}`
  ? DigitsToArrayWithExactLength<L, T, [...RepeatTupleTenTimes<Acc>, ...DigitToArrayWithExactLength<H, T>]>
  : Acc

type RepeatTupleTenTimes<T extends readonly unknown[]> = [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T]

type DigitToArrayWithExactLength<N extends Digit, T = unknown> = {
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
