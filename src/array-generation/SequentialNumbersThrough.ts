import type { ArrayWithExactLength } from '@/array-generation/ArrayWithExactLength'
import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { Trunc } from '@/number-processing/Trunc'
import { assertTypeEquality, it } from '@/testUtilities'

export type SequentialNumbersThrough<N extends number> = number extends N
  ? number[]
  : `${N}` extends `-${string}`
    ? never
    : `${N}` extends `${string}e+${string}` | 'Infinity'
      ? number[]
      : [unknown, ...ArrayWithExactLength<Trunc<N>>] extends infer R extends readonly unknown[]
        ? { [K in keyof R]: K extends `${infer M extends number}` ? M : never }
        : never

it('generates an array of sequential numbers through a given natural number', () => {
  assertTypeEquality<SequentialNumbersThrough<0>, [0]>()
  assertTypeEquality<SequentialNumbersThrough<1>, [0, 1]>()
  assertTypeEquality<SequentialNumbersThrough<9>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]>()
  assertTypeEquality<SequentialNumbersThrough<10>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]>()
  assertTypeEquality<SequentialNumbersThrough<23>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]>()
  assertTypeEquality<SequentialNumbersThrough<999>['length'], 1000>()
})
it('returns never type for negative numbers', () => {
  assertTypeEquality<SequentialNumbersThrough<-1>, never>()
  assertTypeEquality<SequentialNumbersThrough<-1.5>, never>()
  assertTypeEquality<SequentialNumbersThrough<-1e21>, never>()
  assertTypeEquality<SequentialNumbersThrough<-1e-21>, never>()
  assertTypeEquality<SequentialNumbersThrough<NegativeInfinity>, never>()
})
it('ignores fractional parts of given numbers', () => {
  assertTypeEquality<SequentialNumbersThrough<1.5>, [0, 1]>()
  assertTypeEquality<SequentialNumbersThrough<1e-21>, [0]>()
})
it('returns the regular number array type for a natural number in exponential notation', () => {
  assertTypeEquality<SequentialNumbersThrough<1e21>, number[]>()
})
it('returns the regular number array type for Infinity', () => {
  assertTypeEquality<SequentialNumbersThrough<Infinity>, number[]>()
})
it('distributes over union types', () => {
  assertTypeEquality<SequentialNumbersThrough<0 | 1>, [0] | [0, 1]>()
  assertTypeEquality<SequentialNumbersThrough<never>, never>()
  assertTypeEquality<SequentialNumbersThrough<number>, number[]>()
  assertTypeEquality<SequentialNumbersThrough<any>, number[]>()
})
