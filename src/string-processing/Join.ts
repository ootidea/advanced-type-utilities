import type { OptionalElementsToUnion } from '@/array-manipulation/OptionalElementsToUnion'
import type { Interpolable } from '@/common-type-alias/Interpolable'
import { assertTypeEquality, it } from '@/testUtilities'

export type Join<T extends readonly Interpolable[], Separator extends string = ','> = JoinLoop<OptionalElementsToUnion<T>, Separator>

it('concatenates string literals with a separator', () => {
  assertTypeEquality<Join<['a', 'b', 'c']>, 'a,b,c'>()
  assertTypeEquality<Join<['a', 'b'], '/'>, 'a/b'>()
  assertTypeEquality<Join<['a', 'b', 'c'], ''>, 'abc'>()
  assertTypeEquality<Join<['a']>, 'a'>()
})
it('automatically stringifies number, bigint, boolean, null, and undefined', () => {
  assertTypeEquality<Join<[1, 2]>, '1,2'>()
  assertTypeEquality<Join<[true, 1n, null]>, 'true,1,null'>()
})
it('works with empty arrays', () => {
  assertTypeEquality<Join<[]>, ''>()
  assertTypeEquality<Join<['', '']>, ','>()
})
it('distributes over union types', () => {
  assertTypeEquality<Join<['a' | 'b', 'c']>, 'a,c' | 'b,c'>()
  assertTypeEquality<Join<[1, 2], '+' | '-'>, '1+2' | '1-2'>()
  assertTypeEquality<Join<never>, never>()
  assertTypeEquality<Join<['a', 'b'], never>, never>()
})
it('converts optional elements to a union type', () => {
  assertTypeEquality<Join<[1?]>, '' | '1'>()
  assertTypeEquality<Join<[1?, 2?]>, '' | '1' | '1,2'>()
})
it('can build template literal types', () => {
  assertTypeEquality<Join<['a', number]>, `a,${number}`>()
  assertTypeEquality<Join<[string, bigint]>, `${string},${bigint}`>()
})
it('converts unlimited length arrays to the string type', () => {
  assertTypeEquality<Join<'a'[]>, string>()
  assertTypeEquality<Join<['a', ...'b'[]]>, `a,${string}`>()
  assertTypeEquality<Join<[...'a'[], 'b']>, `${string},b`>()

  assertTypeEquality<Join<string[]>, string>()
  assertTypeEquality<Join<any>, string>()
})

type JoinLoop<T extends readonly Interpolable[], Separator extends string> = T extends readonly [infer U extends Interpolable]
  ? `${U}`
  : T extends readonly [infer F extends Interpolable, ...infer R extends Interpolable[]]
    ? `${F}${Separator}${JoinLoop<R, Separator>}`
    : T extends readonly [...infer R extends Interpolable[], infer L extends Interpolable]
      ? `${JoinLoop<R, Separator>}${Separator}${L}`
      : T extends readonly []
        ? ''
        : string
