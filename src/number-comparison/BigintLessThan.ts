import type { DigitsLessThan } from '@/number-comparison/DigitsLessThan'
import { assertTypeEquality, it, test } from '@/testUtilities'

/**
 * Checks if N < M for bigint values.
 * Time complexity: O(n), where n is the minimum of the number of digits in N and M.
 * @example
 * BigintLessThan<1n, 2n> // true
 * BigintLessThan<2n, -1n> // false
 * BigintLessThan<0n, 0n> // false
 */
export type BigintLessThan<N extends bigint, M extends bigint> = N extends N
  ? M extends M
    ? bigint extends N
      ? boolean
      : bigint extends M
        ? boolean
        : `${N}` extends `-${infer NP}`
          ? `${M}` extends `-${infer MP}`
            ? DigitsLessThan<MP, NP>
            : true
          : `${M}` extends `-${string}`
            ? false
            : DigitsLessThan<`${N}`, `${M}`>
    : never
  : never

test('positive-positive', () => {
  assertTypeEquality<BigintLessThan<2n, 6n>, true>()
  assertTypeEquality<BigintLessThan<2n, 2n>, false>()
  assertTypeEquality<BigintLessThan<6n, 2n>, false>()
  assertTypeEquality<BigintLessThan<123n, 50n>, false>()
  assertTypeEquality<BigintLessThan<50n, 123n>, true>()
  assertTypeEquality<BigintLessThan<19n, 55n>, true>()
  assertTypeEquality<BigintLessThan<55n, 19n>, false>()
  assertTypeEquality<BigintLessThan<55n, 55n>, false>()
  assertTypeEquality<BigintLessThan<55n, 56n>, true>()
})
test('negative-negative', () => {
  assertTypeEquality<BigintLessThan<-6n, -2n>, true>()
  assertTypeEquality<BigintLessThan<-2n, -2n>, false>()
  assertTypeEquality<BigintLessThan<-2n, -6n>, false>()
  assertTypeEquality<BigintLessThan<-123n, -50n>, true>()
  assertTypeEquality<BigintLessThan<-50n, -123n>, false>()
  assertTypeEquality<BigintLessThan<-55n, -55n>, false>()
  assertTypeEquality<BigintLessThan<-55n, -54n>, true>()
})
test('positive-negative', () => {
  assertTypeEquality<BigintLessThan<2n, -6n>, false>()
  assertTypeEquality<BigintLessThan<6n, -2n>, false>()
})
test('negative-positive', () => {
  assertTypeEquality<BigintLessThan<-2n, 6n>, true>()
  assertTypeEquality<BigintLessThan<-6n, 2n>, true>()
})
test('about zero', () => {
  assertTypeEquality<BigintLessThan<0n, 1n>, true>()
  assertTypeEquality<BigintLessThan<0n, 0n>, false>()
  assertTypeEquality<BigintLessThan<1n, 0n>, false>()
  assertTypeEquality<BigintLessThan<-1n, 0n>, true>()
  assertTypeEquality<BigintLessThan<0n, -1n>, false>()
})
it('compares the number of digits', () => {
  assertTypeEquality<BigintLessThan<0n, 1234567890n>, true>()
  assertTypeEquality<BigintLessThan<1234567890n, 0n>, false>()
  assertTypeEquality<BigintLessThan<-1n, -1234567890n>, false>()
  assertTypeEquality<BigintLessThan<-1234567890n, -1n>, true>()
})
it('distributes over union types', () => {
  assertTypeEquality<BigintLessThan<5n, 1n | 9n>, boolean>()
  assertTypeEquality<BigintLessThan<2n | 8n, 5n>, boolean>()
  assertTypeEquality<BigintLessThan<1n | 2n, 3n | 4n>, true>()
  assertTypeEquality<BigintLessThan<bigint, 3n | 4n>, boolean>()
  assertTypeEquality<BigintLessThan<1n | 2n, bigint>, boolean>()
  assertTypeEquality<BigintLessThan<bigint, bigint>, boolean>()
  assertTypeEquality<BigintLessThan<any, 0n>, boolean>()
  assertTypeEquality<BigintLessThan<0n, any>, boolean>()
  assertTypeEquality<BigintLessThan<any, any>, boolean>()
})
