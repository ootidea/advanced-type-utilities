import { assertTypeEquality, assertTypeInequality, it } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type MergeObjectIntersection<T extends object> = Equals<T, any> extends true ? any : { [K in keyof T]: T[K] }

it('merges intersections of object types', () => {
  assertTypeEquality<MergeObjectIntersection<{ a: 1 } & { b: 2 }>, { a: 1; b: 2 }>()
  assertTypeEquality<MergeObjectIntersection<{ a: 1 } & {}>, { a: 1 }>()
  assertTypeEquality<MergeObjectIntersection<{ a: number } & { a?: 1 }>, { a: 1 }>()
})
it('also merges index signatures', () => {
  assertTypeEquality<MergeObjectIntersection<{ a: 1 } & { [x: number]: 2 }>, { a: 1; [x: number]: 2 }>()
  assertTypeEquality<MergeObjectIntersection<{ [x: string]: 1 } & { [x: number]: 1 }>, { [x: string | number]: 1 }>()
})
it('drops call signatures', () => {
  assertTypeEquality<MergeObjectIntersection<{ a: 1; (x: number): 2 }>, { a: 1 }>()
  assertTypeEquality<MergeObjectIntersection<(x: number) => 2>, {}>()
})
it('drops construct signatures', () => {
  assertTypeEquality<MergeObjectIntersection<{ a: 1; new (x: number): 2 }>, { a: 1 }>()
  assertTypeEquality<MergeObjectIntersection<new (x: number) => 2>, {}>()
})
it('distributes over union types', () => {
  assertTypeEquality<MergeObjectIntersection<{ a: 1 } | ({ b: 2 } & { c: 3 })>, { a: 1 } | { b: 2; c: 3 }>()
})
it('merges {} type with primitive types into mysterious types', () => {
  assertTypeInequality<MergeObjectIntersection<{} & string>, string>()
  assertTypeInequality<MergeObjectIntersection<{} & string>, {} & string>()
  assertTypeEquality<MergeObjectIntersection<{} & String>, String>()
})
it('does not merge intersections in nested types (except unions)', () => {
  assertTypeInequality<MergeObjectIntersection<Set<{ a: 1 } & { b: 2 }>>, Set<{ a: 1; b: 2 }>>()
  assertTypeInequality<MergeObjectIntersection<[{ a: 1 } & { b: 2 }]>, [{ a: 1; b: 2 }]>()
})
it('preserves special types as-is', () => {
  assertTypeEquality<MergeObjectIntersection<any>, any>()
  assertTypeEquality<MergeObjectIntersection<never>, never>()
})
