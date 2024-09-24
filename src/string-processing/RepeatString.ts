import type { Digit } from '../common-type-alias/Digit'
import { assertTypeEquality, it } from '../testUtilities'

export type RepeatString<S extends string, N extends number> = number extends N
  ? string
  : `${N}` extends `-${string}` | `${string}.${string}` | `${string}e${string}` | 'Infinity'
    ? never
    : string extends S
      ? string
      : S extends S
        ? RepeatStringDigits<S, `${N}`>
        : never

it('returns a string that repeats the given string a specified number of times', () => {
  assertTypeEquality<RepeatString<'a', 2>, 'aa'>()
  assertTypeEquality<RepeatString<'a', 0>, ''>()
  assertTypeEquality<RepeatString<'u/', 2>, 'u/u/'>()
})
it('distributes over union types', () => {
  assertTypeEquality<RepeatString<'a', 1 | 2>, 'a' | 'aa'>()
  assertTypeEquality<RepeatString<'a', number>, string>()
  assertTypeEquality<RepeatString<'a', any>, string>()
  assertTypeEquality<RepeatString<'a', never>, never>()

  assertTypeEquality<RepeatString<'a' | 'b', 2>, 'aa' | 'bb'>()
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
