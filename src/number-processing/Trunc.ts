import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import { assertTypeEquality, it } from '@/testUtilities'

export type Trunc<N extends number> = number extends N
  ? number
  : N extends N
    ? `${N}` extends `${string}e-${string}`
      ? 0
      : `${N}` extends `${string}e+${string}`
        ? N
        : `${N}` extends `-0.${string}`
          ? 0
          : `${N}` extends `${infer I extends number}.${string}`
            ? I
            : N
    : never // Unreachable

it('removes the fractional part', () => {
  assertTypeEquality<Trunc<1.5>, 1>()
  assertTypeEquality<Trunc<-1.5>, -1>()
  assertTypeEquality<Trunc<-0.5>, 0>()
})
it('returns 0 for numbers with negative exponent', () => {
  assertTypeEquality<Trunc<1e-21>, 0>()
  assertTypeEquality<Trunc<-1e-21>, 0>()
})
it('returns an integer as is', () => {
  assertTypeEquality<Trunc<1>, 1>()
  assertTypeEquality<Trunc<0>, 0>()
  assertTypeEquality<Trunc<-10>, -10>()
  assertTypeEquality<Trunc<1e21>, 1e21>()
  assertTypeEquality<Trunc<-1e21>, -1e21>()
  assertTypeEquality<Trunc<1.5e21>, 1.5e21>()
  assertTypeEquality<Trunc<-1.5e21>, -1.5e21>()
})
it('returns infinity as is', () => {
  assertTypeEquality<Trunc<Infinity>, Infinity>()
  assertTypeEquality<Trunc<NegativeInfinity>, NegativeInfinity>()
})
it('distributes over union types', () => {
  assertTypeEquality<Trunc<0 | 1.5>, 0 | 1>()
  assertTypeEquality<Trunc<number>, number>()
  assertTypeEquality<Trunc<any>, number>()
  assertTypeEquality<Trunc<never>, never>()
})
