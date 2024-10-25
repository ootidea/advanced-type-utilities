import { assertTypeEquality } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

/**
 * Determines whether a type is included in a tuple.
 * Time complexity: O(n), but effectively O(1) due to lack of recursive calls.
 * @example
 * IsOneOf<string, [string, number]> // true
 * IsOneOf<string, [number, bigint]> // false
 */
export type IsOneOf<T, U extends readonly unknown[]> = { [K in keyof U]: Equals<T, U[K]> }[number] extends false ? false : true

assertTypeEquality<IsOneOf<string, [string, number]>, true>()
assertTypeEquality<IsOneOf<string, [number, bigint]>, false>()
assertTypeEquality<IsOneOf<string, [any, unknown, never]>, false>()
assertTypeEquality<IsOneOf<string, [string | number]>, false>()
assertTypeEquality<IsOneOf<'text', [string]>, false>()
assertTypeEquality<IsOneOf<string, []>, false>()

assertTypeEquality<IsOneOf<string, [string, string]>, true>()
assertTypeEquality<IsOneOf<string, string[]>, true>()
assertTypeEquality<IsOneOf<2, [1, ...2[], 3]>, true>()
assertTypeEquality<IsOneOf<3, [1, ...2[], 3]>, true>()
