import type { Digit } from '@/common-type-alias/Digit'
import type { DigitLessThan } from '@/number-comparison/DigitsLessThan'
import { assertTypeEquality } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type AfterDecimalPointDigitsLessThan<N extends string, M extends string> = N extends `${infer NH extends Digit}${infer NL}`
  ? M extends `${infer MH extends Digit}${infer ML}`
    ? Equals<NH, MH> extends true
      ? AfterDecimalPointDigitsLessThan<NL, ML>
      : DigitLessThan<NH, MH>
    : false
  : M extends `${Digit}${string}`
    ? true
    : false

assertTypeEquality<AfterDecimalPointDigitsLessThan<'456', '9'>, true>()
assertTypeEquality<AfterDecimalPointDigitsLessThan<'456', '1'>, false>()
assertTypeEquality<AfterDecimalPointDigitsLessThan<'9', '456'>, false>()
assertTypeEquality<AfterDecimalPointDigitsLessThan<'1', '456'>, true>()
assertTypeEquality<AfterDecimalPointDigitsLessThan<'456', '456'>, false>()
assertTypeEquality<AfterDecimalPointDigitsLessThan<'01', '011'>, true>()
assertTypeEquality<AfterDecimalPointDigitsLessThan<'011', '01'>, false>()
