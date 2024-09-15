import { assertTypeEquality, it } from '../assertTypeEquality'

export type MakeOptionalPropertiesAcceptUndefined<T> = T extends T
  ? { [K in keyof T]: T extends Record<K, any> ? T[K] : T[K] | undefined }
  : never

it('converts types of optional properties to T | undefined', () => {
  assertTypeEquality<MakeOptionalPropertiesAcceptUndefined<{ a?: 1 }>, { a?: 1 | undefined }>()
  assertTypeEquality<MakeOptionalPropertiesAcceptUndefined<{ a?: 1; b: 2 }>, { a?: 1 | undefined; b: 2 }>()
  assertTypeEquality<MakeOptionalPropertiesAcceptUndefined<{ 0?: boolean }>, { 0?: boolean | undefined }>()
  assertTypeEquality<
    MakeOptionalPropertiesAcceptUndefined<{ [Symbol.iterator]?: never }>,
    { [Symbol.iterator]?: undefined }
  >()
})
it('returns the argument as-is if there are no optional properties', () => {
  assertTypeEquality<MakeOptionalPropertiesAcceptUndefined<{ a: 1 }>, { a: 1 }>()
  assertTypeEquality<MakeOptionalPropertiesAcceptUndefined<{}>, {}>()
})
it('distributes over union types', () => {
  assertTypeEquality<
    MakeOptionalPropertiesAcceptUndefined<{ a?: 1 } | { b?: 2 }>,
    { a?: 1 | undefined } | { b?: 2 | undefined }
  >()
})
it('also works with optional elements in tuple types', () => {
  assertTypeEquality<MakeOptionalPropertiesAcceptUndefined<[boolean?]>, [(boolean | undefined)?]>()
})
