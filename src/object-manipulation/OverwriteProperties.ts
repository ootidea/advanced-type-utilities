import type { MergeObjectIntersection } from '@/object-manipulation/MergeObjectIntersection'
import { assertTypeEquality, it } from '@/testUtilities'

export type OverwriteProperties<T, V> = MergeObjectIntersection<Omit<T, keyof V> & V>

it('overwrites existing properties', () => {
  assertTypeEquality<OverwriteProperties<{ a: 1; b: 2 }, { b: 9 }>, { a: 1; b: 9 }>()
})
it('merges new properties', () => {
  assertTypeEquality<OverwriteProperties<{ a: 1; b: 2 }, { c: 9 }>, { a: 1; b: 2; c: 9 }>()
  assertTypeEquality<OverwriteProperties<{}, { a: 1 }>, { a: 1 }>()
})
it('keeps the readonly and optional modifiers', () => {
  assertTypeEquality<OverwriteProperties<{ readonly a?: 1 }, { b: 2 }>, { readonly a?: 1; b: 2 }>()
  assertTypeEquality<OverwriteProperties<{ a: 1 }, { readonly b?: 2 }>, { a: 1; readonly b?: 2 }>()
  assertTypeEquality<OverwriteProperties<{ a: 1 }, { readonly a?: 'a' }>, { readonly a?: 'a' }>()
})
it('overwrite the readonly and optional modifiers', () => {
  assertTypeEquality<OverwriteProperties<{ readonly a: 1 }, { a: 1 }>, { a: 1 }>()
  assertTypeEquality<OverwriteProperties<{ a?: 1 }, { a: 1 }>, { a: 1 }>()
})
it('merges the index signature', () => {
  assertTypeEquality<OverwriteProperties<{ a: 1 }, { [key: symbol]: boolean }>, { a: 1; [key: symbol]: boolean }>()
  assertTypeEquality<OverwriteProperties<{ [key: symbol]: boolean }, { a: 1 }>, { [key: symbol]: boolean; a: 1 }>()
  assertTypeEquality<OverwriteProperties<{ [key: symbol]: 1 }, { [key: symbol]: 'a' }>, { [key: symbol]: 'a' }>()
  assertTypeEquality<OverwriteProperties<{ [key: symbol]: 1 }, { [key: string]: 'a' }>, { [key: symbol]: 1; [key: string]: 'a' }>()
})
