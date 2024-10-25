import { assertTypeEquality } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type IsUnion<T> = Equals<T, never> extends true ? false : Equals<T extends T ? [T] : never, [T]> extends true ? false : true

assertTypeEquality<IsUnion<1 | 2>, true>()
assertTypeEquality<IsUnion<boolean>, true>()
assertTypeEquality<IsUnion<keyof any>, true>()

assertTypeEquality<IsUnion<1>, false>()
assertTypeEquality<IsUnion<'a'>, false>()
assertTypeEquality<IsUnion<{}>, false>()
assertTypeEquality<IsUnion<never>, false>()
assertTypeEquality<IsUnion<any>, false>()
assertTypeEquality<IsUnion<unknown>, false>()

assertTypeEquality<IsUnion<[1 | 2]>, false>()
assertTypeEquality<IsUnion<{ a: 1 | 2 }>, false>()

assertTypeEquality<IsUnion<string & {}>, false>()
assertTypeEquality<IsUnion<{ a: 1 } & { b: 2 }>, false>()
