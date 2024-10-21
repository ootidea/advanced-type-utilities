import type { Infinity } from '../common-type-alias/Infinity'
import type { NegativeInfinity } from '../common-type-alias/NegativeInfinity'
import type { IntegerRangeBetween } from '../number-processing/IntegerRangeBetween'
import { assertTypeEquality, it } from '../testUtilities'
import type { FixedLengthArray } from './FixedLengthArray'

export type MinLengthArray<N extends number, T = unknown> = N extends N
  ? `${N}` extends `-${string}`
    ? never
    : IntegerRangeBetween<0, N> extends infer M extends number
      ? M extends M
        ? FixedLengthArray<N, T> extends readonly [...FixedLengthArray<M>, ...infer R]
          ? [...FixedLengthArray<M, T>, ...T[], ...R]
          : never // Unreachable
        : never // Unreachable
      : never // Unreachable
  : never // Unreachable

it('generates a union type representing arrays with a length of N or greater', () => {
  assertTypeEquality<MinLengthArray<0>, unknown[]>()
  assertTypeEquality<MinLengthArray<1>, [unknown, ...unknown[]] | [...unknown[], unknown]>()
  assertTypeEquality<
    MinLengthArray<2>,
    [unknown, unknown, ...unknown[]] | [unknown, ...unknown[], unknown] | [...unknown[], unknown, unknown]
  >()
})
it('allows specifying the element type with the second argument', () => {
  assertTypeEquality<MinLengthArray<1, boolean>, [boolean, ...boolean[]] | [...boolean[], boolean]>()
  assertTypeEquality<MinLengthArray<2, any>, [any, any, ...any[]] | [any, ...any[], any] | [...any[], any, any]>()
})
it('returns never type for negative numbers', () => {
  assertTypeEquality<MinLengthArray<-1>, never>()
  assertTypeEquality<MinLengthArray<NegativeInfinity>, never>()
})
it('returns a normal array type for a natural number in exponential notation', () => {
  assertTypeEquality<MinLengthArray<1e21>, unknown[]>()
  assertTypeEquality<MinLengthArray<1.5e21>, unknown[]>()
})
it('returns a normal array type for other numbers', () => {
  assertTypeEquality<MinLengthArray<0.5>, unknown[]>()
  assertTypeEquality<MinLengthArray<1e-21>, unknown[]>()
  assertTypeEquality<MinLengthArray<Infinity>, unknown[]>()
})
it('distributes over union types', () => {
  assertTypeEquality<MinLengthArray<1 | 2>, MinLengthArray<1> | MinLengthArray<2>>()
  assertTypeEquality<MinLengthArray<number>, unknown[]>()
  assertTypeEquality<MinLengthArray<any>, unknown[]>()
})
