import type { Digit } from '@/common-type-alias/Digit'
import type { LessThanForDigit } from '@/number-comparison/LessThanForDigits'
import { assertTypeEquality } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

/** Time complexity: O(n), where n is the minimum of the lengths of N and M. */
export type LessThanForAfterDecimalPointDigits<N extends string, M extends string> = N extends `${infer NH extends Digit}${infer NL}`
  ? M extends `${infer MH extends Digit}${infer ML}`
    ? Equals<NH, MH> extends true
      ? LessThanForAfterDecimalPointDigits<NL, ML>
      : LessThanForDigit<NH, MH>
    : false
  : M extends `${Digit}${string}`
    ? true
    : false

assertTypeEquality<LessThanForAfterDecimalPointDigits<'456', '9'>, true>()
assertTypeEquality<LessThanForAfterDecimalPointDigits<'456', '1'>, false>()
assertTypeEquality<LessThanForAfterDecimalPointDigits<'9', '456'>, false>()
assertTypeEquality<LessThanForAfterDecimalPointDigits<'1', '456'>, true>()
assertTypeEquality<LessThanForAfterDecimalPointDigits<'456', '456'>, false>()
assertTypeEquality<LessThanForAfterDecimalPointDigits<'01', '011'>, true>()
assertTypeEquality<LessThanForAfterDecimalPointDigits<'011', '01'>, false>()
