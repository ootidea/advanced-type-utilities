import type { MergeObjectIntersection } from '@/object-manipulation/MergeObjectIntersection'
import { assertTypeEquality, it } from '@/testUtilities'

export type DiscriminatedUnion<T extends object, Discriminant extends keyof any = 'type'> = {
  [K in keyof T]: MergeObjectIntersection<Record<Discriminant, K> & T[K]>
}[keyof T]

it('creates a discriminated union type from an object type', () => {
  assertTypeEquality<DiscriminatedUnion<{ a: { x: 1 }; b: { y: 2 } }>, { type: 'a'; x: 1 } | { type: 'b'; y: 2 }>()
  assertTypeEquality<DiscriminatedUnion<{ a: { x: 1 }; b: {} }>, { type: 'a'; x: 1 } | { type: 'b' }>()
  assertTypeEquality<DiscriminatedUnion<{ a: {} }>, { type: 'a' }>()
})
it('can specify the discriminant in the second argument', () => {
  assertTypeEquality<DiscriminatedUnion<{ a: { x: 1 }; b: { y: 2 } }, 'kind'>, { kind: 'a'; x: 1 } | { kind: 'b'; y: 2 }>()

  const uniqueSymbol = Symbol('a')
  assertTypeEquality<
    DiscriminatedUnion<{ a: { x: 1 }; b: { y: 2 } }, typeof uniqueSymbol>,
    { [uniqueSymbol]: 'a'; x: 1 } | { [uniqueSymbol]: 'b'; y: 2 }
  >()
})
it('accepts number and symbol keys', () => {
  assertTypeEquality<DiscriminatedUnion<{ 0: {}; [Symbol.iterator]: {} }>, { type: 0 } | { type: typeof Symbol.iterator }>()
})
