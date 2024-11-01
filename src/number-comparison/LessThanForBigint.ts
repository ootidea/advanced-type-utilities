import type { LessThanForDigits } from '@/number-comparison/LessThanForDigits'
import { assertTypeEquality, it, test } from '@/testUtilities'

/**
 * Checks if N < M for bigint values.
 * Time complexity: O(n), where n is the minimum of the number of digits in N and M.
 * @example
 * LessThanForBigint<1n, 2n> // true
 * LessThanForBigint<2n, -1n> // false
 * LessThanForBigint<0n, 0n> // false
 */
export type LessThanForBigint<N extends bigint, M extends bigint> = N extends N
  ? M extends M
    ? bigint extends N
      ? boolean
      : bigint extends M
        ? boolean
        : `${N}` extends `-${infer NP}`
          ? `${M}` extends `-${infer MP}`
            ? LessThanForDigits<MP, NP>
            : true
          : `${M}` extends `-${string}`
            ? false
            : LessThanForDigits<`${N}`, `${M}`>
    : never
  : never

test('positive-positive', () => {
  assertTypeEquality<LessThanForBigint<2n, 6n>, true>()
  assertTypeEquality<LessThanForBigint<2n, 2n>, false>()
  assertTypeEquality<LessThanForBigint<6n, 2n>, false>()
  assertTypeEquality<LessThanForBigint<123n, 50n>, false>()
  assertTypeEquality<LessThanForBigint<50n, 123n>, true>()
  assertTypeEquality<LessThanForBigint<19n, 55n>, true>()
  assertTypeEquality<LessThanForBigint<55n, 19n>, false>()
  assertTypeEquality<LessThanForBigint<55n, 55n>, false>()
  assertTypeEquality<LessThanForBigint<55n, 56n>, true>()
})
test('negative-negative', () => {
  assertTypeEquality<LessThanForBigint<-6n, -2n>, true>()
  assertTypeEquality<LessThanForBigint<-2n, -2n>, false>()
  assertTypeEquality<LessThanForBigint<-2n, -6n>, false>()
  assertTypeEquality<LessThanForBigint<-123n, -50n>, true>()
  assertTypeEquality<LessThanForBigint<-50n, -123n>, false>()
  assertTypeEquality<LessThanForBigint<-55n, -55n>, false>()
  assertTypeEquality<LessThanForBigint<-55n, -54n>, true>()
})
test('positive-negative', () => {
  assertTypeEquality<LessThanForBigint<2n, -6n>, false>()
  assertTypeEquality<LessThanForBigint<6n, -2n>, false>()
})
test('negative-positive', () => {
  assertTypeEquality<LessThanForBigint<-2n, 6n>, true>()
  assertTypeEquality<LessThanForBigint<-6n, 2n>, true>()
})
test('about zero', () => {
  assertTypeEquality<LessThanForBigint<0n, 1n>, true>()
  assertTypeEquality<LessThanForBigint<0n, 0n>, false>()
  assertTypeEquality<LessThanForBigint<1n, 0n>, false>()
  assertTypeEquality<LessThanForBigint<-1n, 0n>, true>()
  assertTypeEquality<LessThanForBigint<0n, -1n>, false>()
})
it('compares the number of digits', () => {
  assertTypeEquality<LessThanForBigint<0n, 1234567890n>, true>()
  assertTypeEquality<LessThanForBigint<1234567890n, 0n>, false>()
  assertTypeEquality<LessThanForBigint<-1n, -1234567890n>, false>()
  assertTypeEquality<LessThanForBigint<-1234567890n, -1n>, true>()
})
it('distributes over union types', () => {
  assertTypeEquality<LessThanForBigint<5n, 1n | 9n>, boolean>()
  assertTypeEquality<LessThanForBigint<2n | 8n, 5n>, boolean>()
  assertTypeEquality<LessThanForBigint<1n | 2n, 3n | 4n>, true>()
  assertTypeEquality<LessThanForBigint<bigint, 3n | 4n>, boolean>()
  assertTypeEquality<LessThanForBigint<1n | 2n, bigint>, boolean>()
  assertTypeEquality<LessThanForBigint<bigint, bigint>, boolean>()
  assertTypeEquality<LessThanForBigint<any, 0n>, boolean>()
  assertTypeEquality<LessThanForBigint<0n, any>, boolean>()
  assertTypeEquality<LessThanForBigint<any, any>, boolean>()
})
