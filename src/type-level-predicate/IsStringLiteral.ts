import { assertTypeEquality, it } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'
import type { IsTemplateLiteral } from '@/type-level-predicate/IsTemplateLiteral'
import type { IsUnion } from '@/type-level-predicate/IsUnion'

/**
 * Time complexity: O(n)
 */
export type IsStringLiteral<T> = IsUnion<T> extends true
  ? false
  : Equals<T, never> extends true
    ? false
    : T extends string
      ? string extends T
        ? false
        : Equals<T, never> extends true
          ? false
          : IsTemplateLiteral<T> extends true
            ? false
            : true
      : false

it('returns true for string literal types', () => {
  assertTypeEquality<IsStringLiteral<''>, true>()
  assertTypeEquality<IsStringLiteral<'ab'>, true>()
})
it('returns false for template literal types', () => {
  assertTypeEquality<IsStringLiteral<`@${string}`>, false>()
  assertTypeEquality<IsStringLiteral<`${number}px`>, false>()
  assertTypeEquality<IsStringLiteral<`#${bigint}`>, false>()

  assertTypeEquality<IsStringLiteral<`${number & {}}`>, false>()
  assertTypeEquality<IsStringLiteral<`${bigint & {}}`>, false>()
  assertTypeEquality<IsStringLiteral<`${string & {}}`>, false>()
})
it('returns false for the regular string type', () => {
  assertTypeEquality<IsStringLiteral<string>, false>()
  assertTypeEquality<IsStringLiteral<string & {}>, false>()
})
it('returns false for non-string types', () => {
  assertTypeEquality<IsStringLiteral<null>, false>()
  assertTypeEquality<IsStringLiteral<boolean>, false>()
  assertTypeEquality<IsStringLiteral<symbol>, false>()
  assertTypeEquality<IsStringLiteral<{}>, false>()
  assertTypeEquality<IsStringLiteral<unknown>, false>()
  assertTypeEquality<IsStringLiteral<any>, false>()
})
it('does not distribute over union types', () => {
  assertTypeEquality<IsStringLiteral<'' | 'ab'>, false>()
  assertTypeEquality<IsStringLiteral<never>, false>()
})
