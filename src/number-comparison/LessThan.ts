import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { LessThanForAfterDecimalPointDigits } from '@/number-comparison/LessThanForAfterDecimalPointDigits'
import type { LessThanForDigit, LessThanForDigits } from '@/number-comparison/LessThanForDigits'
import type { NumberOrderRankOf } from '@/number-processing/NumberOrderRankOf'
import { assertTypeEquality, describe, it, test } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

/**
 * Checks if N < M.
 * Time complexity: O(n), where n is the minimum of the number of digits in N and M.
 * @example
 * LessThan<1, 2> // true
 * LessThan<2, 1> // false
 * LessThan<0, 0> // false
 * LessThan<-0.5, 1e21> // true
 */
export type LessThan<N extends number, M extends number> = N extends N
  ? M extends M
    ? number extends N
      ? boolean
      : number extends M
        ? boolean
        : Equals<NumberOrderRankOf<N>, NumberOrderRankOf<M>> extends false
          ? LessThanForDigit<`${NumberOrderRankOf<N>}`, `${NumberOrderRankOf<M>}`>
          : N extends NegativeInfinity
            ? false
            : `${N}` extends `-${string}e+${string}`
              ? boolean // TODO: Implement this case
              : `${N}` extends `-${string}e-${string}`
                ? boolean // TODO: Implement this case
                : `${N}` extends `-${infer NI}.${infer NF}`
                  ? `${M}` extends `-${infer MI}.${infer MF}`
                    ? Equals<NI, MI> extends true
                      ? LessThanForAfterDecimalPointDigits<MF, NF>
                      : LessThanForDigits<MI, NI>
                    : `${M}` extends `-${infer MI}`
                      ? Equals<NI, MI> extends true
                        ? true
                        : LessThanForDigits<MI, NI>
                      : never // Unreachable
                  : `${N}` extends `-${infer NI}`
                    ? `${M}` extends `-${infer MI}.${string}`
                      ? Equals<NI, MI> extends true
                        ? false
                        : LessThanForDigits<MI, NI>
                      : `${M}` extends `-${infer MI}`
                        ? LessThanForDigits<MI, NI>
                        : never // Unreachable
                    : N extends 0
                      ? false
                      : N extends Infinity
                        ? false
                        : `${N}` extends `${string}e+${string}`
                          ? boolean // TODO: Implement this case
                          : `${N}` extends `${string}e-${string}`
                            ? boolean // TODO: Implement this case
                            : `${N}` extends `${infer NI}.${infer NF}`
                              ? `${M}` extends `${infer MI}.${infer MF}`
                                ? Equals<NI, MI> extends true
                                  ? LessThanForAfterDecimalPointDigits<NF, MF>
                                  : LessThanForDigits<NI, MI>
                                : Equals<NI, `${M}`> extends true
                                  ? false
                                  : LessThanForDigits<NI, `${M}`>
                              : `${M}` extends `${infer MI}.${string}`
                                ? Equals<`${N}`, MI> extends true
                                  ? true
                                  : LessThanForDigits<`${N}`, MI>
                                : LessThanForDigits<`${N}`, `${M}`>
    : never
  : never

describe('Comparison between the same rank', () => {
  test('rank 9', () => {
    assertTypeEquality<LessThan<Infinity, Infinity>, false>()
  })
  test('rank 8', () => {
    // TODO: Implement this case
  })
  test('rank 7', () => {
    assertTypeEquality<LessThan<123, 50>, false>()
    assertTypeEquality<LessThan<50, 123>, true>()

    assertTypeEquality<LessThan<123, 124>, true>()
    assertTypeEquality<LessThan<123, 123>, false>()
    assertTypeEquality<LessThan<123, 122>, false>()

    assertTypeEquality<LessThan<123.5, 124.5>, true>()
    assertTypeEquality<LessThan<123.5, 123.5>, false>()
    assertTypeEquality<LessThan<123.5, 122.5>, false>()

    assertTypeEquality<LessThan<1.2, 1.3>, true>()
    assertTypeEquality<LessThan<1.2, 1.2>, false>()
    assertTypeEquality<LessThan<1.2, 1.1>, false>()

    assertTypeEquality<LessThan<1.2, 1.21>, true>()
    assertTypeEquality<LessThan<1.21, 1.2>, false>()

    assertTypeEquality<LessThan<5.1, 4>, false>()
    assertTypeEquality<LessThan<5.1, 5>, false>()
    assertTypeEquality<LessThan<5.1, 6>, true>()

    assertTypeEquality<LessThan<4, 5.1>, true>()
    assertTypeEquality<LessThan<5, 5.1>, true>()
    assertTypeEquality<LessThan<6, 5.1>, false>()
  })
  test('rank 6', () => {
    // TODO: Implement this case
  })
  test('rank 5', () => {
    assertTypeEquality<LessThan<0, 0>, false>()
  })
  test('rank 4', () => {
    // TODO: Implement this case
  })
  test('rank 3', () => {
    assertTypeEquality<LessThan<-123, -50>, true>()
    assertTypeEquality<LessThan<-50, -123>, false>()

    assertTypeEquality<LessThan<-123, -124>, false>()
    assertTypeEquality<LessThan<-123, -123>, false>()
    assertTypeEquality<LessThan<-123, -122>, true>()

    assertTypeEquality<LessThan<-123.5, -124.5>, false>()
    assertTypeEquality<LessThan<-123.5, -123.5>, false>()
    assertTypeEquality<LessThan<-123.5, -122.5>, true>()

    assertTypeEquality<LessThan<-1.2, -1.1>, true>()
    assertTypeEquality<LessThan<-1.2, -1.2>, false>()
    assertTypeEquality<LessThan<-1.2, -1.3>, false>()

    assertTypeEquality<LessThan<-1.2, -1.21>, false>()
    assertTypeEquality<LessThan<-1.21, -1.2>, true>()

    assertTypeEquality<LessThan<-5.1, -4>, true>()
    assertTypeEquality<LessThan<-5.1, -5>, true>()
    assertTypeEquality<LessThan<-5.1, -6>, false>()

    assertTypeEquality<LessThan<-4, -5.1>, false>()
    assertTypeEquality<LessThan<-5, -5.1>, false>()
    assertTypeEquality<LessThan<-6, -5.1>, true>()
  })
  test('rank 2', () => {
    // TODO: Implement this case
  })
  test('rank 1', () => {
    assertTypeEquality<LessThan<NegativeInfinity, NegativeInfinity>, false>()
  })
})
describe('Comparison between different ranks', () => {
  test('rank 9', () => {
    assertTypeEquality<LessThan<Infinity, 1e21>, false>()
    assertTypeEquality<LessThan<Infinity, 1.2>, false>()
    assertTypeEquality<LessThan<Infinity, 1e-21>, false>()
    assertTypeEquality<LessThan<Infinity, 0>, false>()
    assertTypeEquality<LessThan<Infinity, -1e-21>, false>()
    assertTypeEquality<LessThan<Infinity, -1.2>, false>()
    assertTypeEquality<LessThan<Infinity, -1e21>, false>()
    assertTypeEquality<LessThan<Infinity, NegativeInfinity>, false>()
  })
  test('rank 8', () => {
    assertTypeEquality<LessThan<1e21, Infinity>, true>()
    assertTypeEquality<LessThan<1e21, 1.2>, false>()
    assertTypeEquality<LessThan<1e21, 1e-21>, false>()
    assertTypeEquality<LessThan<1e21, 0>, false>()
    assertTypeEquality<LessThan<1e21, -1e-21>, false>()
    assertTypeEquality<LessThan<1e21, -1.2>, false>()
    assertTypeEquality<LessThan<1e21, -1e21>, false>()
    assertTypeEquality<LessThan<1e21, NegativeInfinity>, false>()
  })
  test('rank 7', () => {
    assertTypeEquality<LessThan<1.2, Infinity>, true>()
    assertTypeEquality<LessThan<1.2, 1e21>, true>()
    assertTypeEquality<LessThan<1.2, 1e-21>, false>()
    assertTypeEquality<LessThan<1.2, 0>, false>()
    assertTypeEquality<LessThan<1.2, -1e-21>, false>()
    assertTypeEquality<LessThan<1.2, -1.2>, false>()
    assertTypeEquality<LessThan<1.2, -1e21>, false>()
    assertTypeEquality<LessThan<1.2, NegativeInfinity>, false>()
  })
  test('rank 6', () => {
    assertTypeEquality<LessThan<1e-21, Infinity>, true>()
    assertTypeEquality<LessThan<1e-21, 1e21>, true>()
    assertTypeEquality<LessThan<1e-21, 1.2>, true>()
    assertTypeEquality<LessThan<1e-21, 0>, false>()
    assertTypeEquality<LessThan<1e-21, -1e-21>, false>()
    assertTypeEquality<LessThan<1e-21, -1.2>, false>()
    assertTypeEquality<LessThan<1e-21, -1e21>, false>()
    assertTypeEquality<LessThan<1e-21, NegativeInfinity>, false>()
  })
  test('rank 5', () => {
    assertTypeEquality<LessThan<0, Infinity>, true>()
    assertTypeEquality<LessThan<0, 1e21>, true>()
    assertTypeEquality<LessThan<0, 1.2>, true>()
    assertTypeEquality<LessThan<0, 1e-21>, true>()
    assertTypeEquality<LessThan<0, -1e-21>, false>()
    assertTypeEquality<LessThan<0, -1.2>, false>()
    assertTypeEquality<LessThan<0, -1e21>, false>()
    assertTypeEquality<LessThan<0, NegativeInfinity>, false>()
  })
  test('rank 4', () => {
    assertTypeEquality<LessThan<-1e-21, Infinity>, true>()
    assertTypeEquality<LessThan<-1e-21, 1e21>, true>()
    assertTypeEquality<LessThan<-1e-21, 1.2>, true>()
    assertTypeEquality<LessThan<-1e-21, 1e-21>, true>()
    assertTypeEquality<LessThan<-1e-21, 0>, true>()
    assertTypeEquality<LessThan<-1e-21, -1.2>, false>()
    assertTypeEquality<LessThan<-1e-21, -1e21>, false>()
    assertTypeEquality<LessThan<-1e-21, NegativeInfinity>, false>()
  })
  test('rank 3', () => {
    assertTypeEquality<LessThan<-1.2, Infinity>, true>()
    assertTypeEquality<LessThan<-1.2, 1e21>, true>()
    assertTypeEquality<LessThan<-1.2, 1.2>, true>()
    assertTypeEquality<LessThan<-1.2, 1e-21>, true>()
    assertTypeEquality<LessThan<-1.2, 0>, true>()
    assertTypeEquality<LessThan<-1.2, -1e-21>, true>()
    assertTypeEquality<LessThan<-1.2, -1e21>, false>()
    assertTypeEquality<LessThan<-1.2, NegativeInfinity>, false>()
  })
  test('rank 2', () => {
    assertTypeEquality<LessThan<-1e21, Infinity>, true>()
    assertTypeEquality<LessThan<-1e21, 1e21>, true>()
    assertTypeEquality<LessThan<-1e21, 1.2>, true>()
    assertTypeEquality<LessThan<-1e21, 1e-21>, true>()
    assertTypeEquality<LessThan<-1e21, 0>, true>()
    assertTypeEquality<LessThan<-1e21, -1e-21>, true>()
    assertTypeEquality<LessThan<-1e21, -1.2>, true>()
    assertTypeEquality<LessThan<-1e21, NegativeInfinity>, false>()
  })
  test('rank 1', () => {
    assertTypeEquality<LessThan<NegativeInfinity, Infinity>, true>()
    assertTypeEquality<LessThan<NegativeInfinity, 1e21>, true>()
    assertTypeEquality<LessThan<NegativeInfinity, 1.2>, true>()
    assertTypeEquality<LessThan<NegativeInfinity, 1e-21>, true>()
    assertTypeEquality<LessThan<NegativeInfinity, 0>, true>()
    assertTypeEquality<LessThan<NegativeInfinity, -1e-21>, true>()
    assertTypeEquality<LessThan<NegativeInfinity, -1.2>, true>()
    assertTypeEquality<LessThan<NegativeInfinity, -1e21>, true>()
  })
})
it('distributes over union types', () => {
  assertTypeEquality<LessThan<1 | 2, 5>, true>()
  assertTypeEquality<LessThan<1 | 9, 5>, boolean>()
  assertTypeEquality<LessThan<8 | 9, 5>, false>()
  assertTypeEquality<LessThan<5, 1 | 2>, false>()
  assertTypeEquality<LessThan<5, 1 | 9>, boolean>()
  assertTypeEquality<LessThan<5, 8 | 9>, true>()
  assertTypeEquality<LessThan<1e21, never>, never>()
  assertTypeEquality<LessThan<never, 1e21>, never>()
  assertTypeEquality<LessThan<-1, number>, boolean>()
  assertTypeEquality<LessThan<number, -1>, boolean>()
  assertTypeEquality<LessThan<-1, any>, boolean>()
  assertTypeEquality<LessThan<any, -1>, boolean>()
})
