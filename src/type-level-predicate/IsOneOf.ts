import { assertTypeEquality } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type IsOneOf<T, U extends readonly unknown[]> = U extends readonly [infer H, ...infer L]
  ? Equals<T, H> extends true
    ? true
    : IsOneOf<T, L>
  : false

assertTypeEquality<IsOneOf<string, [string, number]>, true>()
assertTypeEquality<IsOneOf<string, [number, bigint]>, false>()
assertTypeEquality<IsOneOf<string, [any, unknown, never]>, false>()
assertTypeEquality<IsOneOf<string, [string | number]>, false>()
assertTypeEquality<IsOneOf<'text', [string]>, false>()
assertTypeEquality<IsOneOf<string, []>, false>()
