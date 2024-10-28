import { assertTypeEquality } from '@/testUtilities'
import type { UnionToIntersection } from '@/type-conversion/UnionToIntersection'
import type { Equals } from '@/type-level-predicate/Equals'

export type UnionToTuple<T> = UnionToIntersection<T extends T ? () => [T] : never> extends () => [infer U]
  ? [...UnionToTuple<T extends T ? (Equals<T, U> extends true ? never : T) : never>, U]
  : []

assertTypeEquality<UnionToTuple<1 | 2 | 3>, [1, 2, 3]>()
assertTypeEquality<UnionToTuple<undefined | void>, [undefined, void]>()
assertTypeEquality<UnionToTuple<boolean>, [false, true]>()
assertTypeEquality<UnionToTuple<keyof any>, [string, number, symbol]>()
assertTypeEquality<UnionToTuple<number>, [number]>()
assertTypeEquality<UnionToTuple<never>, []>()
assertTypeEquality<UnionToTuple<[1?]>, [[1?]]>()
assertTypeEquality<UnionToTuple<{ a?: 1 }>, [{ a?: 1 }]>()
assertTypeEquality<UnionToTuple<string & {}>, [string & {}]>()
