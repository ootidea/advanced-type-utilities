import { assertTypeEquality, it } from '@/testUtilities'

/**
 * Time complexity: O(n), where n is the number of elements in the tuple.
 */
export type OptionalElementsToUnion<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
  ? [F, ...OptionalElementsToUnion<R>]
  : T extends readonly [...infer R, infer L] // Infer an element after the rest elements
    ? [...OptionalElementsToUnion<R>, L]
    : T extends readonly []
      ? []
      : T[number][] extends T // If T is a rest element or non-tuple array
        ? T
        : T extends readonly [(infer F)?, ...infer R]
          ? [] | [F, ...OptionalElementsToUnion<R>]
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
