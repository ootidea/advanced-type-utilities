import { assertTypeEquality, assertTypeInequality, it } from '../assertTypeEquality'

export type MergeIntersection<T> = T extends object ? { [K in keyof T]: T[K] } : T

it('merges intersections of object types', () => {
  assertTypeEquality<MergeIntersection<{ a: 1 } & { b: 2 }>, { a: 1; b: 2 }>()
  assertTypeEquality<MergeIntersection<{ a: 1 } & {}>, { a: 1 }>()
})
it('distributes over union types', () => {
  assertTypeEquality<MergeIntersection<string | ({ b: 2 } & { c: 3 })>, string | { b: 2; c: 3 }>()
  assertTypeEquality<MergeIntersection<{ a: 1 } | ({ b: 2 } & { c: 3 })>, { a: 1 } | { b: 2; c: 3 }>()
})
it('merges {} type with primitive types into mysterious types', () => {
  assertTypeInequality<MergeIntersection<{} & string>, string>()
  assertTypeInequality<MergeIntersection<{} & string>, {} & string>()
  assertTypeEquality<MergeIntersection<{} & String>, String>()
})
it('does not merge intersections in nested types (except unions)', () => {
  assertTypeInequality<MergeIntersection<Set<{ a: 1 } & { b: 2 }>>, Set<{ a: 1; b: 2 }>>()
  assertTypeInequality<MergeIntersection<[{ a: 1 } & { b: 2 }]>, [{ a: 1; b: 2 }]>()
})
it('preserves special types as-is', () => {
  assertTypeEquality<MergeIntersection<any>, any>()
  assertTypeEquality<MergeIntersection<unknown>, unknown>()
  assertTypeEquality<MergeIntersection<never>, never>()
  assertTypeEquality<MergeIntersection<null>, null>()
})
