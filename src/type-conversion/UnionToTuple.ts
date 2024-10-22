import { assertTypeEquality } from '@/testUtilities'
import type { UnionToIntersection } from '@/type-conversion/UnionToIntersection'

export type UnionToTuple<T> = UnionToIntersection<T extends T ? () => T : never> extends () => infer U
  ? [...UnionToTuple<Exclude<T, U>>, U]
  : []

assertTypeEquality<UnionToTuple<1 | 2 | 3>, [1, 2, 3]>()
assertTypeEquality<UnionToTuple<boolean>, [false, true]>()
assertTypeEquality<UnionToTuple<keyof any>, [string, number, symbol]>()
assertTypeEquality<UnionToTuple<number>, [number]>()
assertTypeEquality<UnionToTuple<never>, []>()
assertTypeEquality<UnionToTuple<[1?]>, [[1?]]>()
assertTypeEquality<UnionToTuple<{ a?: 1 }>, [{ a?: 1 }]>()
