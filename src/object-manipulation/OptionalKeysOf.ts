import { assertTypeEquality, it } from '../assertTypeEquality'

export type OptionalKeysOf<T> = T extends T
  ? keyof T extends infer K extends keyof T
    ? K extends K
      ? T extends Record<K, any>
        ? never
        : K
      : never
    : never
  : never

it('extracts optional property keys as a union type from an object type', () => {
  assertTypeEquality<OptionalKeysOf<{ a: 1; b?: 2 }>, 'b'>()
  assertTypeEquality<OptionalKeysOf<{ a?: 1; b?: 2 }>, 'a' | 'b'>()
  assertTypeEquality<OptionalKeysOf<{ 0?: unknown }>, 0>()
  assertTypeEquality<OptionalKeysOf<{ [Symbol.iterator]?: unknown }>, typeof Symbol.iterator>()
})
assertTypeEquality<OptionalKeysOf<{ value?: string; 0?: boolean }>, 'value' | 0>()
it('returns never for objects with no optional keys', () => {
  assertTypeEquality<OptionalKeysOf<{ a: 1 }>, never>()
  assertTypeEquality<OptionalKeysOf<{}>, never>()
})
it('is not affected by whether the property type is T | undefined', () => {
  assertTypeEquality<OptionalKeysOf<{ a: 1 | undefined }>, never>()
  assertTypeEquality<OptionalKeysOf<{ a?: 1 | undefined }>, 'a'>()
  assertTypeEquality<OptionalKeysOf<{ [key: string]: 1 | undefined }>, never>()
  assertTypeEquality<OptionalKeysOf<Partial<Record<string, 1>>>, never>()
})
it('distributes over union types', () => {
  assertTypeEquality<OptionalKeysOf<{ a?: 1 } | { b?: 2 }>, 'a' | 'b'>()
})
it('extracts optional element indices from tuple types', () => {
  assertTypeEquality<OptionalKeysOf<[boolean, boolean?, boolean?]>, '1' | '2'>()
  assertTypeEquality<OptionalKeysOf<[]>, never>()
  assertTypeEquality<OptionalKeysOf<string[]>, never>()
})
