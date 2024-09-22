import { assertTypeEquality, it } from '../testUtilities'

export type ValueOf<T> = T[keyof T]

it('extracts all property types from an object type', () => {
  assertTypeEquality<ValueOf<{ a: 1 }>, 1>()
  assertTypeEquality<ValueOf<{ a: 1; b: 2 }>, 1 | 2>()
})
it('extracts value types for number and symbol keys as well', () => {
  assertTypeEquality<ValueOf<{ 0: string }>, string>()
  assertTypeEquality<ValueOf<{ 0: string; 1: number }>, string | number>()
  assertTypeEquality<ValueOf<{ [Symbol.iterator]: string }>, string>()
})
it('returns never for objects with no properties', () => {
  assertTypeEquality<ValueOf<{}>, never>()
  assertTypeEquality<ValueOf<() => unknown>, never>()
  assertTypeEquality<ValueOf<new () => unknown>, never>()
  assertTypeEquality<ValueOf<abstract new () => unknown>, never>()
})
it('extracts value type of index signature', () => {
  assertTypeEquality<ValueOf<{ [key: string]: 1 }>, 1>()
  assertTypeEquality<ValueOf<{ [key: number]: 1; a: 2 }>, 1 | 2>()
})
it('extracts optional properties as T | undefined type', () => {
  assertTypeEquality<ValueOf<{ a?: 1 }>, 1 | undefined>()
})
it('does not distribute over union types', () => {
  assertTypeEquality<ValueOf<{ a: 1 } | { b: 2 }>, never>()
  assertTypeEquality<ValueOf<{ a: 1 } | {}>, never>()
})
