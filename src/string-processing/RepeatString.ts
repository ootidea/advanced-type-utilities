import type { Digit } from '../common-type-alias/Digit'
import type { Infinity } from '../common-type-alias/Infinity'
import { assertTypeEquality, it } from '../testUtilities'
import type { IsNaturalNumber } from '../type-level-predicate/IsNaturalNumber'

export type RepeatString<S extends string, N extends number> = number extends N
  ? string
  : IsNaturalNumber<N> extends false
    ? never
    : `${N}` extends `${string}e+${string}`
      ? string
      : string extends S
        ? string
        : RepeatStringDigits<S, `${N}`>

it('returns a string literal type that repeats the given string a specified number of times', () => {
  assertTypeEquality<RepeatString<'a', 2>, 'aa'>()
  assertTypeEquality<RepeatString<'a', 0>, ''>()
  assertTypeEquality<RepeatString<'abc', 2>, 'abcabc'>()
})
it('distributes over union types', () => {
  assertTypeEquality<RepeatString<'a', 1 | 2>, 'a' | 'aa'>()
  assertTypeEquality<RepeatString<'a', number>, string>()
  assertTypeEquality<RepeatString<'a', any>, string>()
  assertTypeEquality<RepeatString<'a', never>, never>()

  assertTypeEquality<RepeatString<'a' | 'b', 2>, 'aa' | 'ab' | 'ba' | 'bb'>()
  assertTypeEquality<RepeatString<string, 2>, string>()
  assertTypeEquality<RepeatString<any, 2>, string>()
  assertTypeEquality<RepeatString<never, 2>, never>()
})
it('returns the string type for a huge number', () => {
  assertTypeEquality<RepeatString<'a', 1e21>, string>()
})
it('returns never type if the given number is not a natural number', () => {
  assertTypeEquality<RepeatString<'a', -1>, never>()
  assertTypeEquality<RepeatString<'a', 1.5>, never>()
  assertTypeEquality<RepeatString<'a', 1e-21>, never>()
  assertTypeEquality<RepeatString<'a', Infinity>, never>()
})

type RepeatStringDigits<S extends string, N extends string, Acc extends string = ''> = N extends `${infer H extends Digit}${infer L}`
  ? RepeatStringDigits<S, L, `${RepeatStringTenTimes<Acc>}${RepeatStringDigit<S, H>}`>
  : Acc

type RepeatStringDigit<S extends string, N extends Digit> = {
  '0': ''
  '1': S
  '2': `${S}${S}`
  '3': `${S}${S}${S}`
  '4': `${S}${S}${S}${S}`
  '5': `${S}${S}${S}${S}${S}`
  '6': `${S}${S}${S}${S}${S}${S}`
  '7': `${S}${S}${S}${S}${S}${S}${S}`
  '8': `${S}${S}${S}${S}${S}${S}${S}${S}`
  '9': `${S}${S}${S}${S}${S}${S}${S}${S}${S}`
}[N]

type RepeatStringTenTimes<S extends string> = `${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}`
