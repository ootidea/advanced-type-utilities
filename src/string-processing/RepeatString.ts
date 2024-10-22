import type { Digit } from '@/common-type-alias/Digit'
import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { Trunc } from '@/number-processing/Trunc'
import { assertTypeEquality, it } from '@/testUtilities'

export type RepeatString<S extends string, N extends number> = number extends N
  ? string
  : `${N}` extends `-${string}`
    ? never
    : `${N}` extends `${string}e+${string}` | 'Infinity'
      ? string
      : string extends S
        ? string
        : RepeatStringDigits<S, `${Trunc<N>}`>

it('generates a string literal type by repeating the given string the specified number of times', () => {
  assertTypeEquality<RepeatString<'a', 2>, 'aa'>()
  assertTypeEquality<RepeatString<'a', 0>, ''>()
  assertTypeEquality<RepeatString<'abc', 2>, 'abcabc'>()
  assertTypeEquality<RepeatString<`${number}`, 2>, `${number}${number}`>()
})
it('returns the never type for negative numbers', () => {
  assertTypeEquality<RepeatString<'a', -1>, never>()
  assertTypeEquality<RepeatString<'a', -0.5>, never>()
  assertTypeEquality<RepeatString<'a', -1e21>, never>()
  assertTypeEquality<RepeatString<'a', -1e-21>, never>()
  assertTypeEquality<RepeatString<'a', NegativeInfinity>, never>()
})
it('ignores fractional parts of given numbers', () => {
  assertTypeEquality<RepeatString<'a', 2.5>, 'aa'>()
  assertTypeEquality<RepeatString<'a', 1e-21>, ''>()
})
it('returns the regular string type for natural numbers in exponential notation', () => {
  assertTypeEquality<RepeatString<'a', 1e21>, string>()
})
it('returns the regular string type for Infinity', () => {
  assertTypeEquality<RepeatString<'a', Infinity>, string>()
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
