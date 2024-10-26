import type { CopyArrayWritability } from '@/array-manipulation/CopyArrayWritability'
import { assertTypeEquality, it } from '@/testUtilities'

/**
 * Time complexity: O(n), where n is the number of elements in the tuple.
 */
export type OptionalElementsToUnion<T extends readonly unknown[]> = CopyArrayWritability<
  T,
  OptionalElementsToUnionRemoveAllIgnoringReadonlyModifier<T>
>

type OptionalElementsToUnionRemoveAllIgnoringReadonlyModifier<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
  ? [F, ...OptionalElementsToUnionRemoveAllIgnoringReadonlyModifier<R>]
  : T extends readonly [...infer R, infer L] // Infer an element after the rest elements
    ? [...OptionalElementsToUnionRemoveAllIgnoringReadonlyModifier<R>, L]
    : T extends readonly []
      ? []
      : T[number][] extends T // If T is a rest element or non-tuple array
        ? T
        : T extends readonly [(infer F)?, ...infer R]
          ? [] | [F, ...OptionalElementsToUnionRemoveAllIgnoringReadonlyModifier<R>]
          : never // Maybe unreachable

it('converts optional elements to a union type of arrays', () => {
  assertTypeEquality<OptionalElementsToUnion<[1?]>, [] | [1]>()
  assertTypeEquality<OptionalElementsToUnion<[1?, 2?]>, [] | [1] | [1, 2]>()
  assertTypeEquality<OptionalElementsToUnion<[1, 2?]>, [1] | [1, 2]>()
  assertTypeEquality<OptionalElementsToUnion<[1?, ...2[]]>, [] | [1, ...2[]]>()
  assertTypeEquality<OptionalElementsToUnion<[1, 2?, ...3[]]>, [1] | [1, 2, ...3[]]>()
})
it('returns as is if there are no optional elements', () => {
  assertTypeEquality<OptionalElementsToUnion<[]>, []>()
  assertTypeEquality<OptionalElementsToUnion<[1, 2]>, [1, 2]>()
  assertTypeEquality<OptionalElementsToUnion<[1, ...2[], 3]>, [1, ...2[], 3]>()
  assertTypeEquality<OptionalElementsToUnion<1[]>, 1[]>()
  assertTypeEquality<OptionalElementsToUnion<any[]>, any[]>()
  assertTypeEquality<OptionalElementsToUnion<any>, any>()
})
it('distributes over union types', () => {
  assertTypeEquality<OptionalElementsToUnion<[1?] | [2?]>, [] | [1] | [2]>()
  assertTypeEquality<OptionalElementsToUnion<never>, never>()
})
it('preserves readonly modifier', () => {
  assertTypeEquality<OptionalElementsToUnion<readonly [1?]>, readonly [] | readonly [1]>()
  assertTypeEquality<OptionalElementsToUnion<readonly []>, readonly []>()
  assertTypeEquality<OptionalElementsToUnion<readonly 1[]>, readonly 1[]>()
})
