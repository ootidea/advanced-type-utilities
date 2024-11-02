import type { CopyArrayWritability } from '@/array-manipulation/CopyArrayWritability'
import type { OptionalElementsToUnion } from '@/array-manipulation/OptionalElementsToUnion'
import { assertTypeEquality, it } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type Flatten<T extends readonly (readonly unknown[])[]> = T extends T
  ? Equals<T, any> extends true
    ? any[]
    : CopyArrayWritability<T, FlattenLoop<T>>
  : never

it('flattens nested arrays', () => {
  assertTypeEquality<Flatten<[[1], [2]]>, [1, 2]>()
  assertTypeEquality<Flatten<[[1]]>, [1]>()
})
it('ignores empty arrays', () => {
  assertTypeEquality<Flatten<[[1, 2], []]>, [1, 2]>()
  assertTypeEquality<Flatten<[[]]>, []>()
  assertTypeEquality<Flatten<[]>, []>()
})
it('concatenates rest elements', () => {
  assertTypeEquality<Flatten<[[1], ...[2][]]>, [1, ...2[]]>()
  assertTypeEquality<Flatten<[[1], ...[2][], [3]]>, [1, ...2[], 3]>()
  assertTypeEquality<Flatten<[[1], ...[2, 3][]]>, [1, ...(2 | 3)[]]>()
})
it('flattens regular array types', () => {
  assertTypeEquality<Flatten<boolean[][]>, boolean[]>()
  assertTypeEquality<Flatten<[[1], ...number[][]]>, [1, ...number[]]>()
  assertTypeEquality<Flatten<[boolean[], bigint[]]>, (boolean | bigint)[]>()
})
it('converts optional elements to a union type', () => {
  assertTypeEquality<Flatten<[[1], [2?]]>, [1] | [1, 2]>()
  assertTypeEquality<Flatten<[[1?], [2]]>, [2] | [1, 2]>()
  assertTypeEquality<Flatten<[...[1][], [2?]]>, 1[] | [...1[], 2]>()
})
it('preserves readonly modifiers', () => {
  assertTypeEquality<Flatten<readonly [[1]]>, readonly [1]>()
})
it('distributes over union types', () => {
  assertTypeEquality<Flatten<[[1]] | readonly []>, [1] | readonly []>()
  assertTypeEquality<Flatten<never>, never>()
})
it('treats the any type as the any[] type.', () => {
  assertTypeEquality<Flatten<any[]>, any[]>()
  assertTypeEquality<Flatten<[any, [1]]>, [...any[], 1]>()
  assertTypeEquality<Flatten<any>, any[]>()
})

type FlattenLoop<T extends readonly (readonly unknown[])[]> = T extends readonly [
  infer F extends readonly unknown[],
  ...infer R extends (readonly unknown[])[],
]
  ? [...OptionalElementsToUnion<F>, ...FlattenLoop<R>]
  : T extends readonly [...infer R extends (readonly unknown[])[], infer L extends readonly unknown[]]
    ? [...FlattenLoop<R>, ...OptionalElementsToUnion<L>]
    : T extends readonly []
      ? []
      : T[number][] extends T // If T is a rest element or non-tuple array
        ? T[number][number][]
        : []
