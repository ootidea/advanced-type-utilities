import type { Infinity } from '../common-type-alias/Infinity'
import { assertTypeEquality, it } from '../testUtilities'
import type { IsNaturalNumber } from '../type-level-predicate/IsNaturalNumber'
import type { FixedLengthArray } from './FixedLengthArray'

export type SequentialNumbersThrough<N extends number> = number extends N
  ? number[]
  : IsNaturalNumber<N> extends false
    ? never
    : `${N}` extends `${string}e+${string}`
      ? number[]
      : [unknown, ...FixedLengthArray<N>] extends infer R extends readonly unknown[]
        ? { [K in keyof R]: K extends `${infer M extends number}` ? M : never }
        : never

it('generates an array of sequential numbers through a given number', () => {
  assertTypeEquality<SequentialNumbersThrough<0>, [0]>()
  assertTypeEquality<SequentialNumbersThrough<1>, [0, 1]>()
  assertTypeEquality<SequentialNumbersThrough<9>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]>()
  assertTypeEquality<SequentialNumbersThrough<10>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]>()
  assertTypeEquality<SequentialNumbersThrough<23>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]>()
  assertTypeEquality<SequentialNumbersThrough<999>['length'], 1000>()
})
it('distributes over union types', () => {
  assertTypeEquality<SequentialNumbersThrough<0 | 1>, [0] | [0, 1]>()
  assertTypeEquality<SequentialNumbersThrough<never>, never>()
  assertTypeEquality<SequentialNumbersThrough<number>, number[]>()
  assertTypeEquality<SequentialNumbersThrough<any>, number[]>()
})
it('returns never type for non-natural numbers', () => {
  assertTypeEquality<SequentialNumbersThrough<0.5>, never>()
  assertTypeEquality<SequentialNumbersThrough<-1>, never>()
  assertTypeEquality<SequentialNumbersThrough<-1.5>, never>()
  assertTypeEquality<SequentialNumbersThrough<-1e21>, never>()
  assertTypeEquality<SequentialNumbersThrough<1e-21>, never>()
  assertTypeEquality<SequentialNumbersThrough<-1e-21>, never>()
  assertTypeEquality<SequentialNumbersThrough<Infinity>, never>()
})
it('returns the number array type for a natural number in exponential notation', () => {
  assertTypeEquality<SequentialNumbersThrough<1e21>, number[]>()
})
