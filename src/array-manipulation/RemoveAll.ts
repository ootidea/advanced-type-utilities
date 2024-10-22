import type { CopyArrayWritability } from '@/array-manipulation/CopyArrayWritability'
import { assertTypeEquality, it, test } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type RemoveAll<T extends readonly unknown[], E> = Equals<T, any> extends true
  ? any
  : CopyArrayWritability<T, RemoveAllIgnoringReadonlyModifier<T, E>>

test('for fixed-length tuple', () => {
  assertTypeEquality<RemoveAll<[1, 2, 3], 1>, [2, 3]>()
  assertTypeEquality<RemoveAll<[1, 2, 3], 2>, [1, 3]>()
  assertTypeEquality<RemoveAll<[1, 2, 3], 3>, [1, 2]>()
  assertTypeEquality<RemoveAll<[1, 2, 3], number>, [1, 2, 3]>()
  assertTypeEquality<RemoveAll<[1, 2, 3], any>, [1, 2, 3]>()
  assertTypeEquality<RemoveAll<[1, 1, 2], 1>, [2]>()
  assertTypeEquality<RemoveAll<[1, 2, 1], 1>, [2]>()
  assertTypeEquality<RemoveAll<[2, 1, 1], 1>, [2]>()
})
test('for tuple with rest elements', () => {
  assertTypeEquality<RemoveAll<[1, ...2[], 3], 1>, [...2[], 3]>()
  assertTypeEquality<RemoveAll<[1, ...2[], 3], 2>, [1, 3]>()
  assertTypeEquality<RemoveAll<[1, ...2[], 3], 3>, [1, ...2[]]>()
})
test('for tuple with optional elements', () => {
  assertTypeEquality<RemoveAll<[1?], 1>, []>()
  assertTypeEquality<RemoveAll<[1?, 2?], 1>, [2?]>()
  assertTypeEquality<RemoveAll<[1?, 2?], 2>, [1?]>()
  assertTypeEquality<RemoveAll<[1?, 2?], 3>, [1?, 2?]>()
  assertTypeEquality<RemoveAll<[1, 2?], 1>, [2?]>()
  assertTypeEquality<RemoveAll<[1, 2?], 2>, [1]>()
  assertTypeEquality<RemoveAll<[1, 1?], 1>, []>()
  assertTypeEquality<RemoveAll<[1, 2?, ...3[]], 1>, [2?, ...3[]]>()
  assertTypeEquality<RemoveAll<[1, 2?, ...3[]], 2>, [1, ...3[]]>()
  assertTypeEquality<RemoveAll<[1, 2?, ...3[]], 3>, [1, 2?]>()
  assertTypeEquality<RemoveAll<[1, 2?, ...2[]], 2>, [1]>()
})
test('for non-tuple array', () => {
  assertTypeEquality<RemoveAll<1[], 1>, []>()
  assertTypeEquality<RemoveAll<1[], 2>, 1[]>()
})
it('preserves readonly modifier', () => {
  assertTypeEquality<RemoveAll<readonly [1, 2], 1>, readonly [2]>()
  assertTypeEquality<RemoveAll<readonly 1[], 1>, readonly []>()
})
it('distributes over union types in first argument', () => {
  assertTypeEquality<RemoveAll<[1, 2] | [3, 4], 1>, [2] | [3, 4]>()
  assertTypeEquality<RemoveAll<never, 1>, never>()
  assertTypeEquality<RemoveAll<any, 1>, any>()
})

type RemoveAllIgnoringReadonlyModifier<T extends readonly unknown[], E> = T extends readonly [infer H, ...infer L]
  ? Equals<H, E> extends true
    ? RemoveAllIgnoringReadonlyModifier<L, E>
    : [H, ...RemoveAllIgnoringReadonlyModifier<L, E>]
  : T extends readonly [...infer H, infer L] // Infer an element after the rest elements
    ? Equals<L, E> extends true
      ? RemoveAllIgnoringReadonlyModifier<H, E>
      : [...RemoveAllIgnoringReadonlyModifier<H, E>, L]
    : T extends readonly []
      ? []
      : T[number][] extends T // If T is a rest element or non-tuple array
        ? Equals<T[number], E> extends true
          ? []
          : T
        : T extends readonly [(infer H)?, ...infer L]
          ? Equals<H, E> extends true
            ? RemoveAllIgnoringReadonlyModifier<L, E>
            : [H?, ...RemoveAllIgnoringReadonlyModifier<L, E>]
          : never // Maybe unreachable
