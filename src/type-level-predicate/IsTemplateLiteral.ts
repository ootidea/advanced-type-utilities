import { assertTypeEquality, it } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'
import type { IsUnion } from '@/type-level-predicate/IsUnion'

/**
 * Time complexity: O(n)
 */
export type IsTemplateLiteral<T> = IsUnion<T> extends true ? false : Equals<T, never> extends true ? false : IsTemplateLiteralLoop<T>

type IsTemplateLiteralLoop<T> = T extends `${infer H}${infer L}`
  ? string extends H
    ? true
    : `${number}` extends H
      ? true
      : `${bigint}` extends H
        ? true
        : string extends L
          ? true
          : IsTemplateLiteralLoop<L>
  : false

it('returns true for template literal types containing number, bigint and string', () => {
  assertTypeEquality<IsTemplateLiteral<`${number}px`>, true>()
  assertTypeEquality<IsTemplateLiteral<`#${bigint}`>, true>()
  assertTypeEquality<IsTemplateLiteral<`@${string}`>, true>()
  assertTypeEquality<IsTemplateLiteral<`${string}:${string}`>, true>()

  assertTypeEquality<IsTemplateLiteral<`${bigint & {}}`>, true>()
  assertTypeEquality<IsTemplateLiteral<`${number & {}}`>, true>()
  assertTypeEquality<IsTemplateLiteral<`${string & {}}`>, true>()
  assertTypeEquality<IsTemplateLiteral<`a${string & {}}`>, true>()
  assertTypeEquality<IsTemplateLiteral<`a${number & {}}`>, true>()
  assertTypeEquality<IsTemplateLiteral<`a${bigint & {}}`>, true>()
})
it('returns false for string literal types', () => {
  assertTypeEquality<IsTemplateLiteral<''>, false>()
  assertTypeEquality<IsTemplateLiteral<'ab'>, false>()
})
it('returns false for the regular string type', () => {
  assertTypeEquality<IsTemplateLiteral<string>, false>()
  assertTypeEquality<IsTemplateLiteral<string & {}>, false>()
})
it('returns false for non-string types', () => {
  assertTypeEquality<IsTemplateLiteral<null>, false>()
  assertTypeEquality<IsTemplateLiteral<boolean>, false>()
  assertTypeEquality<IsTemplateLiteral<symbol>, false>()
  assertTypeEquality<IsTemplateLiteral<{}>, false>()
  assertTypeEquality<IsTemplateLiteral<unknown>, false>()
  assertTypeEquality<IsTemplateLiteral<any>, false>()
})
it('does not distribute over union types', () => {
  assertTypeEquality<IsTemplateLiteral<`${number}` | `${bigint}`>, false>()
  assertTypeEquality<IsTemplateLiteral<never>, false>()
})
