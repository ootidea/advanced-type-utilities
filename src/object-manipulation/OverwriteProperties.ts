import { assertTypeEquality, it } from '../testUtilities'
import type { MergeIntersection } from './MergeIntersection'

export type OverwriteProperties<T, V> = MergeIntersection<Omit<T, keyof V> & V>

it('overwrites existing properties', () => {
  assertTypeEquality<OverwriteProperties<{ a: 1; b: 2 }, { b: 9 }>, { a: 1; b: 9 }>()
})
it('merges new properties', () => {
  assertTypeEquality<OverwriteProperties<{ a: 1; b: 2 }, { c: 9 }>, { a: 1; b: 2; c: 9 }>()
  assertTypeEquality<OverwriteProperties<{}, { a: 1 }>, { a: 1 }>()
})
