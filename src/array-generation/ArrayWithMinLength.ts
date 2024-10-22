import type { ArrayWithExactLength } from '@/array-generation/ArrayWithExactLength'
import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { IntegerRangeBetween } from '@/number-processing/IntegerRangeBetween'
import { assertTypeEquality, it } from '@/testUtilities'

export type ArrayWithMinLength<N extends number, T = unknown> = N extends N
  ? `${N}` extends `-${string}`
    ? never
    : IntegerRangeBetween<0, N> extends infer M extends number
      ? M extends M
        ? ArrayWithExactLength<N, T> extends readonly [...ArrayWithExactLength<M>, ...infer R]
          ? [...ArrayWithExactLength<M, T>, ...T[], ...R]
          : never // Unreachable
        : never // Unreachable
      : never // Unreachable
  : never // Unreachable

it('generates a union type representing arrays with a length of N or greater', () => {
  assertTypeEquality<ArrayWithMinLength<0>, unknown[]>()
  assertTypeEquality<ArrayWithMinLength<1>, [unknown, ...unknown[]] | [...unknown[], unknown]>()
  assertTypeEquality<
    ArrayWithMinLength<2>,
    [unknown, unknown, ...unknown[]] | [unknown, ...unknown[], unknown] | [...unknown[], unknown, unknown]
  >()
})
it('allows specifying the element type with the second argument', () => {
  assertTypeEquality<ArrayWithMinLength<1, boolean>, [boolean, ...boolean[]] | [...boolean[], boolean]>()
  assertTypeEquality<ArrayWithMinLength<2, any>, [any, any, ...any[]] | [any, ...any[], any] | [...any[], any, any]>()
})
it('returns never type for negative numbers', () => {
  assertTypeEquality<ArrayWithMinLength<-1>, never>()
  assertTypeEquality<ArrayWithMinLength<NegativeInfinity>, never>()
})
it('returns a normal array type for a natural number in exponential notation', () => {
  assertTypeEquality<ArrayWithMinLength<1e21>, unknown[]>()
  assertTypeEquality<ArrayWithMinLength<1.5e21>, unknown[]>()
})
it('returns a normal array type for other numbers', () => {
  assertTypeEquality<ArrayWithMinLength<0.5>, unknown[]>()
  assertTypeEquality<ArrayWithMinLength<1e-21>, unknown[]>()
  assertTypeEquality<ArrayWithMinLength<Infinity>, unknown[]>()
})
it('distributes over union types', () => {
  assertTypeEquality<ArrayWithMinLength<1 | 2>, ArrayWithMinLength<1> | ArrayWithMinLength<2>>()
  assertTypeEquality<ArrayWithMinLength<number>, unknown[]>()
  assertTypeEquality<ArrayWithMinLength<any>, unknown[]>()
})
