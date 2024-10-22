import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import type { AfterDecimalPointDigitsLessThan } from '@/number-comparison/AfterDecimalPointDigitsLessThan'
import type { DigitLessThan, DigitsLessThan } from '@/number-comparison/DigitsLessThan'
import type { NumberOrderRankOf } from '@/number-processing/NumberOrderRankOf'
import { assertTypeEquality, describe, it, test } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type NumberLessThan<N extends number, M extends number> = N extends N
  ? M extends M
    ? number extends N
      ? boolean
      : number extends M
        ? boolean
        : Equals<NumberOrderRankOf<N>, NumberOrderRankOf<M>> extends false
          ? DigitLessThan<`${NumberOrderRankOf<N>}`, `${NumberOrderRankOf<M>}`>
          : N extends NegativeInfinity
            ? false
            : `${N}` extends `-${string}e+${string}`
              ? boolean // TODO: Implement this case
              : `${N}` extends `-${string}e-${string}`
                ? boolean // TODO: Implement this case
                : `${N}` extends `-${infer NI}.${infer NF}`
                  ? `${M}` extends `-${infer MI}.${infer MF}`
                    ? Equals<NI, MI> extends true
                      ? AfterDecimalPointDigitsLessThan<MF, NF>
                      : DigitsLessThan<MI, NI>
                    : `${M}` extends `-${infer MI}`
                      ? Equals<NI, MI> extends true
                        ? true
                        : DigitsLessThan<MI, NI>
                      : never // Unreachable
                  : `${N}` extends `-${infer NI}`
                    ? `${M}` extends `-${infer MI}.${string}`
                      ? Equals<NI, MI> extends true
                        ? false
                        : DigitsLessThan<MI, NI>
                      : `${M}` extends `-${infer MI}`
                        ? DigitsLessThan<MI, NI>
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
                                  ? AfterDecimalPointDigitsLessThan<NF, MF>
                                  : DigitsLessThan<NI, MI>
                                : Equals<NI, `${M}`> extends true
                                  ? false
                                  : DigitsLessThan<NI, `${M}`>
                              : `${M}` extends `${infer MI}.${string}`
                                ? Equals<`${N}`, MI> extends true
                                  ? true
                                  : DigitsLessThan<`${N}`, MI>
                                : DigitsLessThan<`${N}`, `${M}`>
    : never
  : never

describe('Comparison between the same rank', () => {
  test('rank 9', () => {
    assertTypeEquality<NumberLessThan<Infinity, Infinity>, false>()
  })
  test('rank 8', () => {
    // TODO: Implement this case
  })
  test('rank 7', () => {
    assertTypeEquality<NumberLessThan<123, 50>, false>()
    assertTypeEquality<NumberLessThan<50, 123>, true>()

    assertTypeEquality<NumberLessThan<123, 124>, true>()
    assertTypeEquality<NumberLessThan<123, 123>, false>()
    assertTypeEquality<NumberLessThan<123, 122>, false>()

    assertTypeEquality<NumberLessThan<123.5, 124.5>, true>()
    assertTypeEquality<NumberLessThan<123.5, 123.5>, false>()
    assertTypeEquality<NumberLessThan<123.5, 122.5>, false>()

    assertTypeEquality<NumberLessThan<1.2, 1.3>, true>()
    assertTypeEquality<NumberLessThan<1.2, 1.2>, false>()
    assertTypeEquality<NumberLessThan<1.2, 1.1>, false>()

    assertTypeEquality<NumberLessThan<1.2, 1.21>, true>()
    assertTypeEquality<NumberLessThan<1.21, 1.2>, false>()

    assertTypeEquality<NumberLessThan<5.1, 4>, false>()
    assertTypeEquality<NumberLessThan<5.1, 5>, false>()
    assertTypeEquality<NumberLessThan<5.1, 6>, true>()

    assertTypeEquality<NumberLessThan<4, 5.1>, true>()
    assertTypeEquality<NumberLessThan<5, 5.1>, true>()
    assertTypeEquality<NumberLessThan<6, 5.1>, false>()
  })
  test('rank 6', () => {
    // TODO: Implement this case
  })
  test('rank 5', () => {
    assertTypeEquality<NumberLessThan<0, 0>, false>()
  })
  test('rank 4', () => {
    // TODO: Implement this case
  })
  test('rank 3', () => {
    assertTypeEquality<NumberLessThan<-123, -50>, true>()
    assertTypeEquality<NumberLessThan<-50, -123>, false>()

    assertTypeEquality<NumberLessThan<-123, -124>, false>()
    assertTypeEquality<NumberLessThan<-123, -123>, false>()
    assertTypeEquality<NumberLessThan<-123, -122>, true>()

    assertTypeEquality<NumberLessThan<-123.5, -124.5>, false>()
    assertTypeEquality<NumberLessThan<-123.5, -123.5>, false>()
    assertTypeEquality<NumberLessThan<-123.5, -122.5>, true>()

    assertTypeEquality<NumberLessThan<-1.2, -1.1>, true>()
    assertTypeEquality<NumberLessThan<-1.2, -1.2>, false>()
    assertTypeEquality<NumberLessThan<-1.2, -1.3>, false>()

    assertTypeEquality<NumberLessThan<-1.2, -1.21>, false>()
    assertTypeEquality<NumberLessThan<-1.21, -1.2>, true>()

    assertTypeEquality<NumberLessThan<-5.1, -4>, true>()
    assertTypeEquality<NumberLessThan<-5.1, -5>, true>()
    assertTypeEquality<NumberLessThan<-5.1, -6>, false>()

    assertTypeEquality<NumberLessThan<-4, -5.1>, false>()
    assertTypeEquality<NumberLessThan<-5, -5.1>, false>()
    assertTypeEquality<NumberLessThan<-6, -5.1>, true>()
  })
  test('rank 2', () => {
    // TODO: Implement this case
  })
  test('rank 1', () => {
    assertTypeEquality<NumberLessThan<NegativeInfinity, NegativeInfinity>, false>()
  })
})
describe('Comparison between different ranks', () => {
  test('rank 9', () => {
    assertTypeEquality<NumberLessThan<Infinity, 1e21>, false>()
    assertTypeEquality<NumberLessThan<Infinity, 1.2>, false>()
    assertTypeEquality<NumberLessThan<Infinity, 1e-21>, false>()
    assertTypeEquality<NumberLessThan<Infinity, 0>, false>()
    assertTypeEquality<NumberLessThan<Infinity, -1e-21>, false>()
    assertTypeEquality<NumberLessThan<Infinity, -1.2>, false>()
    assertTypeEquality<NumberLessThan<Infinity, -1e21>, false>()
    assertTypeEquality<NumberLessThan<Infinity, NegativeInfinity>, false>()
  })
  test('rank 8', () => {
    assertTypeEquality<NumberLessThan<1e21, Infinity>, true>()
    assertTypeEquality<NumberLessThan<1e21, 1.2>, false>()
    assertTypeEquality<NumberLessThan<1e21, 1e-21>, false>()
    assertTypeEquality<NumberLessThan<1e21, 0>, false>()
    assertTypeEquality<NumberLessThan<1e21, -1e-21>, false>()
    assertTypeEquality<NumberLessThan<1e21, -1.2>, false>()
    assertTypeEquality<NumberLessThan<1e21, -1e21>, false>()
    assertTypeEquality<NumberLessThan<1e21, NegativeInfinity>, false>()
  })
  test('rank 7', () => {
    assertTypeEquality<NumberLessThan<1.2, Infinity>, true>()
    assertTypeEquality<NumberLessThan<1.2, 1e21>, true>()
    assertTypeEquality<NumberLessThan<1.2, 1e-21>, false>()
    assertTypeEquality<NumberLessThan<1.2, 0>, false>()
    assertTypeEquality<NumberLessThan<1.2, -1e-21>, false>()
    assertTypeEquality<NumberLessThan<1.2, -1.2>, false>()
    assertTypeEquality<NumberLessThan<1.2, -1e21>, false>()
    assertTypeEquality<NumberLessThan<1.2, NegativeInfinity>, false>()
  })
  test('rank 6', () => {
    assertTypeEquality<NumberLessThan<1e-21, Infinity>, true>()
    assertTypeEquality<NumberLessThan<1e-21, 1e21>, true>()
    assertTypeEquality<NumberLessThan<1e-21, 1.2>, true>()
    assertTypeEquality<NumberLessThan<1e-21, 0>, false>()
    assertTypeEquality<NumberLessThan<1e-21, -1e-21>, false>()
    assertTypeEquality<NumberLessThan<1e-21, -1.2>, false>()
    assertTypeEquality<NumberLessThan<1e-21, -1e21>, false>()
    assertTypeEquality<NumberLessThan<1e-21, NegativeInfinity>, false>()
  })
  test('rank 5', () => {
    assertTypeEquality<NumberLessThan<0, Infinity>, true>()
    assertTypeEquality<NumberLessThan<0, 1e21>, true>()
    assertTypeEquality<NumberLessThan<0, 1.2>, true>()
    assertTypeEquality<NumberLessThan<0, 1e-21>, true>()
    assertTypeEquality<NumberLessThan<0, -1e-21>, false>()
    assertTypeEquality<NumberLessThan<0, -1.2>, false>()
    assertTypeEquality<NumberLessThan<0, -1e21>, false>()
    assertTypeEquality<NumberLessThan<0, NegativeInfinity>, false>()
  })
  test('rank 4', () => {
    assertTypeEquality<NumberLessThan<-1e-21, Infinity>, true>()
    assertTypeEquality<NumberLessThan<-1e-21, 1e21>, true>()
    assertTypeEquality<NumberLessThan<-1e-21, 1.2>, true>()
    assertTypeEquality<NumberLessThan<-1e-21, 1e-21>, true>()
    assertTypeEquality<NumberLessThan<-1e-21, 0>, true>()
    assertTypeEquality<NumberLessThan<-1e-21, -1.2>, false>()
    assertTypeEquality<NumberLessThan<-1e-21, -1e21>, false>()
    assertTypeEquality<NumberLessThan<-1e-21, NegativeInfinity>, false>()
  })
  test('rank 3', () => {
    assertTypeEquality<NumberLessThan<-1.2, Infinity>, true>()
    assertTypeEquality<NumberLessThan<-1.2, 1e21>, true>()
    assertTypeEquality<NumberLessThan<-1.2, 1.2>, true>()
    assertTypeEquality<NumberLessThan<-1.2, 1e-21>, true>()
    assertTypeEquality<NumberLessThan<-1.2, 0>, true>()
    assertTypeEquality<NumberLessThan<-1.2, -1e-21>, true>()
    assertTypeEquality<NumberLessThan<-1.2, -1e21>, false>()
    assertTypeEquality<NumberLessThan<-1.2, NegativeInfinity>, false>()
  })
  test('rank 2', () => {
    assertTypeEquality<NumberLessThan<-1e21, Infinity>, true>()
    assertTypeEquality<NumberLessThan<-1e21, 1e21>, true>()
    assertTypeEquality<NumberLessThan<-1e21, 1.2>, true>()
    assertTypeEquality<NumberLessThan<-1e21, 1e-21>, true>()
    assertTypeEquality<NumberLessThan<-1e21, 0>, true>()
    assertTypeEquality<NumberLessThan<-1e21, -1e-21>, true>()
    assertTypeEquality<NumberLessThan<-1e21, -1.2>, true>()
    assertTypeEquality<NumberLessThan<-1e21, NegativeInfinity>, false>()
  })
  test('rank 1', () => {
    assertTypeEquality<NumberLessThan<NegativeInfinity, Infinity>, true>()
    assertTypeEquality<NumberLessThan<NegativeInfinity, 1e21>, true>()
    assertTypeEquality<NumberLessThan<NegativeInfinity, 1.2>, true>()
    assertTypeEquality<NumberLessThan<NegativeInfinity, 1e-21>, true>()
    assertTypeEquality<NumberLessThan<NegativeInfinity, 0>, true>()
    assertTypeEquality<NumberLessThan<NegativeInfinity, -1e-21>, true>()
    assertTypeEquality<NumberLessThan<NegativeInfinity, -1.2>, true>()
    assertTypeEquality<NumberLessThan<NegativeInfinity, -1e21>, true>()
  })
})
it('distributes over union types', () => {
  assertTypeEquality<NumberLessThan<1 | 2, 5>, true>()
  assertTypeEquality<NumberLessThan<1 | 9, 5>, boolean>()
  assertTypeEquality<NumberLessThan<8 | 9, 5>, false>()
  assertTypeEquality<NumberLessThan<5, 1 | 2>, false>()
  assertTypeEquality<NumberLessThan<5, 1 | 9>, boolean>()
  assertTypeEquality<NumberLessThan<5, 8 | 9>, true>()
  assertTypeEquality<NumberLessThan<1e21, never>, never>()
  assertTypeEquality<NumberLessThan<never, 1e21>, never>()
  assertTypeEquality<NumberLessThan<-1, number>, boolean>()
  assertTypeEquality<NumberLessThan<number, -1>, boolean>()
  assertTypeEquality<NumberLessThan<-1, any>, boolean>()
  assertTypeEquality<NumberLessThan<any, -1>, boolean>()
})
