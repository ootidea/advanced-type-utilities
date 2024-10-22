import { assertTypeEquality, it } from '@/testUtilities'

export type Writable<T> = { -readonly [K in keyof T]: T[K] }

it('removes the readonly modifier from all properties', () => {
  assertTypeEquality<Writable<{ readonly a: 1 }>, { a: 1 }>()
  assertTypeEquality<Writable<{ readonly 0: false }>, { 0: false }>()
})
it('removes the readonly modifier from index signatures', () => {
  assertTypeEquality<Writable<{ readonly [key: string]: 1 }>, { [key: string]: 1 }>()
  assertTypeEquality<Writable<{ readonly [key: number]: 1; readonly a: null }>, { [key: number]: 1; a: null }>()
})
it('returns the argument as-is if there are no readonly properties', () => {
  assertTypeEquality<Writable<{ a: 1 }>, { a: 1 }>()
  assertTypeEquality<Writable<{ 0: false }>, { 0: false }>()
  assertTypeEquality<Writable<{}>, {}>()
})
it('removes the readonly modifier from array types', () => {
  assertTypeEquality<Writable<readonly string[]>, string[]>()
  assertTypeEquality<Writable<readonly [1, ...2[]]>, [1, ...2[]]>()
  assertTypeEquality<Writable<readonly []>, []>()
})
it('does not apply to nested types', () => {
  assertTypeEquality<Writable<{ a: { readonly b: 1 } }>, { a: { readonly b: 1 } }>()
  assertTypeEquality<Writable<[{ readonly a: 1 }]>, [{ readonly a: 1 }]>()
  assertTypeEquality<Writable<{ a: readonly 1[] }>, { a: readonly 1[] }>()
  assertTypeEquality<Writable<[readonly 1[]]>, [readonly 1[]]>()
})
