import { assertTypeEquality, it } from '../assertTypeEquality'
import type { ValueOf } from './ValueOf'

export type OptionalKeyOf<T> = ValueOf<{
  [K in keyof T as T extends Record<K, T[K]> ? never : K]-?: K
}>

it('extracts optional property keys as a union type from an object type', () => {
  assertTypeEquality<OptionalKeyOf<{ a: 1; b?: 2 }>, 'b'>()
  assertTypeEquality<OptionalKeyOf<{ a?: 1; b?: 2 }>, 'a' | 'b'>()
  assertTypeEquality<OptionalKeyOf<{ 0?: unknown }>, 0>()
  assertTypeEquality<OptionalKeyOf<{ [Symbol.iterator]?: unknown }>, typeof Symbol.iterator>()
})
it('returns never for objects with no optional keys', () => {
  assertTypeEquality<OptionalKeyOf<{ a: 1 }>, never>()
  assertTypeEquality<OptionalKeyOf<{}>, never>()
})
it('is not affected by whether the property type is T | undefined', () => {
  assertTypeEquality<OptionalKeyOf<{ a: 1 | undefined }>, never>()
  assertTypeEquality<OptionalKeyOf<{ a?: 1 | undefined }>, 'a'>()
  assertTypeEquality<OptionalKeyOf<{ [key: string]: 1 | undefined }>, never>()
  assertTypeEquality<OptionalKeyOf<Partial<Record<string, 1>>>, never>()
})
it('does not distribute over union types', () => {
  assertTypeEquality<OptionalKeyOf<{ a?: 1 } | { b?: 2 }>, never>()
  assertTypeEquality<OptionalKeyOf<{ a?: 1 } | {}>, never>()
})
it('extracts optional element indices from tuple types', () => {
  assertTypeEquality<OptionalKeyOf<[boolean, boolean?, boolean?]>, '1' | '2'>()
  assertTypeEquality<OptionalKeyOf<[]>, never>()
  assertTypeEquality<OptionalKeyOf<string[]>, never>()
})
