import type { OverwriteProperties } from '@/object-manipulation/OverwriteProperties'
import { assertTypeEquality, it } from '@/testUtilities'

export type FillOptionalNeverProperties<T> = FillOptionalNeverPropertiesBody<T, T extends T ? keyof T : never>

it('adds missing properties as optional never to union members', () => {
  assertTypeEquality<FillOptionalNeverProperties<{ a: 1 } | { b: 2 }>, { a: 1; b?: never } | { a?: never; b: 2 }>()
  assertTypeEquality<
    FillOptionalNeverProperties<{ a: 1 } | { b: 2 } | { c: 3 }>,
    { a: 1; b?: never; c?: never } | { a?: never; b: 2; c?: never } | { a?: never; b?: never; c: 3 }
  >()
  assertTypeEquality<FillOptionalNeverProperties<{ a: 1 } | {}>, { a: 1 } | { a?: never }>()
  assertTypeEquality<FillOptionalNeverProperties<{ a: 1; b: 2 } | { a: 3 }>, { a: 1; b: 2 } | { a: 3; b?: never }>()
})
it('keeps the readonly and optional modifiers', () => {
  assertTypeEquality<FillOptionalNeverProperties<{ readonly a: 1 } | { b?: 2 }>, { readonly a: 1; b?: never } | { a?: never; b?: 2 }>()
})
it('returns the input as is if it is not a union type', () => {
  assertTypeEquality<FillOptionalNeverProperties<{}>, {}>()
  assertTypeEquality<FillOptionalNeverProperties<{ [key: string]: boolean }>, { [key: string]: boolean }>()
})

type FillOptionalNeverPropertiesBody<T, AllKeys extends keyof T> = T extends T ? OverwriteProperties<{ [K in AllKeys]?: never }, T> : never
