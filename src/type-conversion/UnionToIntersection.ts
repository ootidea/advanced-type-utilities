import { assertTypeEquality } from '../testUtilities'

export type UnionToIntersection<T> = (T extends T ? (value: T) => any : never) extends (value: infer U) => any ? U : never

assertTypeEquality<UnionToIntersection<'a' | 'b' | 'c'>, 'a' & 'b' & 'c'>()
assertTypeEquality<UnionToIntersection<never>, unknown>()
assertTypeEquality<UnionToIntersection<boolean>, never>()
