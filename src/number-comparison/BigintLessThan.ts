import { assertTypeEquality, it, test } from '../testUtilities'
import type { DigitsLessThan } from './DigitArrayLessThan'

export type BigintLessThan<N extends bigint, M extends bigint> = `${N}` extends `-${infer NP}`
  ? `${M}` extends `-${infer MP}`
    ? DigitsLessThan<MP, NP>
    : true
  : `${M}` extends `-${string}`
    ? false
    : DigitsLessThan<`${N}`, `${M}`>

test('positive-positive', () => {
  assertTypeEquality<BigintLessThan<2n, 6n>, true>()
  assertTypeEquality<BigintLessThan<123n, 50n>, false>()
  assertTypeEquality<BigintLessThan<50n, 123n>, true>()
})
test('negative-negative', () => {
  assertTypeEquality<BigintLessThan<-2n, -6n>, false>()
  assertTypeEquality<BigintLessThan<-6n, -2n>, true>()
  assertTypeEquality<BigintLessThan<-2n, -2n>, false>()
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
