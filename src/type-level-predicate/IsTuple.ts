import { assertTypeEquality, it } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type IsTuple<T extends readonly unknown[]> = T extends T
  ? Equals<T, any> extends true
    ? boolean
    : T[number][] extends T
      ? false
      : true
  : never

it('returns true for tuple types', () => {
  assertTypeEquality<IsTuple<[]>, true>()
  assertTypeEquality<IsTuple<[any]>, true>()
  assertTypeEquality<IsTuple<[never]>, true>()
  assertTypeEquality<IsTuple<[1]>, true>()
  assertTypeEquality<IsTuple<[1, 2, 3]>, true>()
  assertTypeEquality<IsTuple<[1, ...2[]]>, true>()
  assertTypeEquality<IsTuple<[...1[], 2]>, true>()
  assertTypeEquality<IsTuple<[1, ...2[], 3]>, true>()
  assertTypeEquality<IsTuple<[1?]>, true>()
  assertTypeEquality<IsTuple<[1?, 2?, 3?]>, true>()
  assertTypeEquality<IsTuple<[1, 2?, ...3[]]>, true>()
})
it('returns false for non-tuple array types', () => {
  assertTypeEquality<IsTuple<string[]>, false>()
  assertTypeEquality<IsTuple<any[]>, false>()
  assertTypeEquality<IsTuple<never[]>, false>()
  assertTypeEquality<IsTuple<readonly string[]>, false>()
})
it('distributes over union types', () => {
  assertTypeEquality<IsTuple<[] | [1]>, true>()
  assertTypeEquality<IsTuple<1[] | 2[]>, false>()
  assertTypeEquality<IsTuple<bigint[] | [null]>, boolean>()
  assertTypeEquality<IsTuple<any>, boolean>()
  assertTypeEquality<IsTuple<never>, never>()
})
