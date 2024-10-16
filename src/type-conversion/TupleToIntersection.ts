import { assertTypeEquality } from '../testUtilities'

export type TupleToIntersection<T extends readonly unknown[]> = { [K in keyof T]: (value: T[K]) => any }[number] extends (
  value: infer R,
) => any
  ? R
  : never // Unreachable

assertTypeEquality<TupleToIntersection<[{ a: 1 }, { b: 2 }]>, { a: 1 } & { b: 2 }>()
assertTypeEquality<TupleToIntersection<[{ a?: 1 }, { readonly b: 2 }]>, { a?: 1 } & { readonly b: 2 }>()
assertTypeEquality<TupleToIntersection<[unknown, number]>, number>()
assertTypeEquality<TupleToIntersection<[0 | 1 | 2, 1 | 2 | 3]>, 1 | 2>()
assertTypeEquality<TupleToIntersection<[boolean, true]>, true>()
