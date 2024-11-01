import { assertTypeEquality, it } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'
import type { IsOneOf } from '@/type-level-predicate/IsOneOf'

/**
 * Makes all properties readonly, including nested ones.
 * @param T - Type to make readonly.
 * @param Exclusion - Types to exclude from readonly transformation.
 */
export type DeepReadonly<T, Exclusion = never> = IsOneOf<T, [any, unknown]> extends true
  ? T
  : T extends Exclusion // for classes
    ? T
    : Equals<keyof T, never> extends true // for function types with no properties
      ? T
      : { readonly [K in keyof T]: DeepReadonly<T[K], Exclusion> }

it('makes all properties readonly, including nested ones', () => {
  assertTypeEquality<DeepReadonly<{ a: 1 }>, { readonly a: 1 }>()
  assertTypeEquality<DeepReadonly<{ a?: 1 }>, { readonly a?: 1 }>()
  assertTypeEquality<DeepReadonly<{ readonly a: 1 }>, { readonly a: 1 }>()
  assertTypeEquality<DeepReadonly<{ readonly a?: 1 }>, { readonly a?: 1 }>()

  assertTypeEquality<DeepReadonly<{ a: 1; b: 2 }>, { readonly a: 1; readonly b: 2 }>()
  assertTypeEquality<DeepReadonly<{ [key: symbol]: 1 }>, { readonly [key: symbol]: 1 }>()

  assertTypeEquality<DeepReadonly<{ a: { b: 1 } }>, { readonly a: { readonly b: 1 } }>()
  assertTypeEquality<DeepReadonly<{ a?: { b?: 1 } }>, { readonly a?: { readonly b?: 1 } }>()
  assertTypeEquality<DeepReadonly<{ readonly a: { b: 1 } }>, { readonly a: { readonly b: 1 } }>()
  assertTypeEquality<DeepReadonly<{}>, {}>()
})
it('makes array types readonly', () => {
  assertTypeEquality<DeepReadonly<[]>, readonly []>()
  assertTypeEquality<DeepReadonly<[1]>, readonly [1]>()
  assertTypeEquality<DeepReadonly<1[]>, readonly 1[]>()
  assertTypeEquality<DeepReadonly<[[]]>, readonly [readonly []]>()
  assertTypeEquality<DeepReadonly<1[][]>, readonly (readonly 1[])[]>()

  assertTypeEquality<DeepReadonly<{ a: 1[] }>, { readonly a: readonly 1[] }>()
  assertTypeEquality<DeepReadonly<{ a: 1 }[]>, readonly { readonly a: 1 }[]>()
})
it('returns non-object types as is', () => {
  assertTypeEquality<DeepReadonly<boolean>, boolean>()
  assertTypeEquality<DeepReadonly<string>, string>()
  assertTypeEquality<DeepReadonly<1>, 1>()
  assertTypeEquality<DeepReadonly<null>, null>()
  assertTypeEquality<DeepReadonly<undefined>, undefined>()
  assertTypeEquality<DeepReadonly<void>, void>()
  assertTypeEquality<DeepReadonly<object>, object>()
  assertTypeEquality<DeepReadonly<never>, never>()
})
it('returns any or unknown types as is', () => {
  assertTypeEquality<DeepReadonly<any>, any>()
  assertTypeEquality<DeepReadonly<unknown>, unknown>()
})
it('returns function types without properties as is', () => {
  assertTypeEquality<DeepReadonly<() => 1>, () => 1>()
  assertTypeEquality<DeepReadonly<new () => 1>, new () => 1>()
  assertTypeEquality<DeepReadonly<(x: number) => x is 1>, (x: number) => x is 1>()
  assertTypeEquality<DeepReadonly<{ a: () => 1 }>, { readonly a: () => 1 }>()
})
it('excludes the type specified in the second argument from the transformation', () => {
  assertTypeEquality<DeepReadonly<Date, Date>, Date>()
  assertTypeEquality<DeepReadonly<{ a: Blob }, Blob>, { readonly a: Blob }>()
  assertTypeEquality<DeepReadonly<[URL], URL>, readonly [URL]>()
  assertTypeEquality<DeepReadonly<Set<string>, Set<unknown>>, Set<string>>()
  assertTypeEquality<DeepReadonly<{ a: Blob; b: Error }, Blob | Error>, { readonly a: Blob; readonly b: Error }>()
})
