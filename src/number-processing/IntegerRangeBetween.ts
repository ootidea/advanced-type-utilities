import type { Infinity } from '../common-type-alias/Infinity'
import type { NegativeInfinity } from '../common-type-alias/NegativeInfinity'
import { assertTypeEquality, it, test } from '../testUtilities'
import type { IsInteger } from '../type-level-predicate/IsInteger'
import type { DigitsRangeBetween } from './DigitsRangeBetween'

export type IntegerRangeBetween<N extends number, M extends number> = N extends N
  ? M extends M
    ? false extends IsInteger<N> | IsInteger<M>
      ? number
      : `${N}` extends `${string}e+${string}`
        ? number
        : `${M}` extends `${string}e+${string}`
          ? number
          : `${N}` extends `-${infer NP}`
            ? `${M}` extends `-${infer MP}`
              ? `-${DigitsRangeBetween<NP, MP>}` extends `${infer R extends number}`
                ? R
                : never // Unreachable
              : `-${DigitsRangeBetween<NP, '1'>}` | DigitsRangeBetween<'0', `${M}`> extends `${infer R extends number}`
                ? R
                : never // Unreachable
            : `${M}` extends `-${infer MP}`
              ? `-${DigitsRangeBetween<MP, '1'>}` | DigitsRangeBetween<'0', `${N}`> extends `${infer R extends number}`
                ? R
                : never // Unreachable
              : DigitsRangeBetween<`${N}`, `${M}`> extends `${infer R extends number}`
                ? R
                : never // Unreachable
    : never // Unreachable
  : never // Unreachable

test('between natural numbers', () => {
  assertTypeEquality<IntegerRangeBetween<0, 0>, 0>()
  assertTypeEquality<IntegerRangeBetween<0, 2>, 0 | 1 | 2>()
  assertTypeEquality<IntegerRangeBetween<2, 0>, 0 | 1 | 2>()
  assertTypeEquality<IntegerRangeBetween<1, 4>, 1 | 2 | 3 | 4>()
  assertTypeEquality<IntegerRangeBetween<4, 1>, 1 | 2 | 3 | 4>()
})
test('between negative integers', () => {
  assertTypeEquality<IntegerRangeBetween<0, -2>, 0 | -1 | -2>()
  assertTypeEquality<IntegerRangeBetween<-2, 0>, 0 | -1 | -2>()
  assertTypeEquality<IntegerRangeBetween<-1, -4>, -1 | -2 | -3 | -4>()
  assertTypeEquality<IntegerRangeBetween<-4, -1>, -1 | -2 | -3 | -4>()
  assertTypeEquality<IntegerRangeBetween<-5, -5>, -5>()
})
test('between positive and negative integers', () => {
  assertTypeEquality<IntegerRangeBetween<1, -2>, 1 | 0 | -1 | -2>()
  assertTypeEquality<IntegerRangeBetween<-2, 1>, 1 | 0 | -1 | -2>()
})
test('around 10000', () => {
  assertTypeEquality<IntegerRangeBetween<10000, 10001>, 10000 | 10001>()
  assertTypeEquality<IntegerRangeBetween<10000, 9999>, 9999 | 10000>()
  assertTypeEquality<IntegerRangeBetween<10001, 10000>, 10000 | 10001>()
  assertTypeEquality<IntegerRangeBetween<9999, 10000>, 9999 | 10000>()
  assertTypeEquality<IntegerRangeBetween<-10000, -10001>, -10000 | -10001>()
  assertTypeEquality<IntegerRangeBetween<-10000, -9999>, -9999 | -10000>()
  assertTypeEquality<IntegerRangeBetween<-10001, -10000>, -10000 | -10001>()
  assertTypeEquality<IntegerRangeBetween<-9999, -10000>, -9999 | -10000>()
})
it('distributes over union types', () => {
  assertTypeEquality<IntegerRangeBetween<0 | 3, 2>, 0 | 1 | 2 | 3>()
  assertTypeEquality<IntegerRangeBetween<2, 0 | 3>, 0 | 1 | 2 | 3>()
  assertTypeEquality<IntegerRangeBetween<number, 5>, number>()
  assertTypeEquality<IntegerRangeBetween<5, number>, number>()
  assertTypeEquality<IntegerRangeBetween<any, 5>, number>()
  assertTypeEquality<IntegerRangeBetween<5, any>, number>()
  assertTypeEquality<IntegerRangeBetween<never, 5>, never>()
  assertTypeEquality<IntegerRangeBetween<5, never>, never>()
})
it('returns the number type for non-integer numbers', () => {
  assertTypeEquality<IntegerRangeBetween<0.5, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, 0.5>, number>()
  assertTypeEquality<IntegerRangeBetween<1e-21, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, 1e-21>, number>()
  assertTypeEquality<IntegerRangeBetween<-0.5, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, -0.5>, number>()
  assertTypeEquality<IntegerRangeBetween<-1e-21, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, -1e-21>, number>()
  assertTypeEquality<IntegerRangeBetween<Infinity, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, Infinity>, number>()
  assertTypeEquality<IntegerRangeBetween<NegativeInfinity, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, NegativeInfinity>, number>()
})
it('returns the number type for non-integer numbers in exponential notation', () => {
  assertTypeEquality<IntegerRangeBetween<1e21, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, 1e21>, number>()
  assertTypeEquality<IntegerRangeBetween<-1e21, 0>, number>()
  assertTypeEquality<IntegerRangeBetween<0, -1e21>, number>()
})
