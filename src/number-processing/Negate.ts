import type { Infinity } from '@/common-type-alias/Infinity'
import type { NegativeInfinity } from '@/common-type-alias/NegativeInfinity'
import { assertTypeEquality, it } from '@/testUtilities'

export type Negate<N extends number> = number extends N
  ? number
  : N extends N
    ? N extends 0
      ? 0
      : N extends Infinity
        ? NegativeInfinity
        : N extends NegativeInfinity
          ? Infinity
          : `${N}` extends `-${infer M extends number}`
            ? M
            : `-${N}` extends `${infer M extends number}`
              ? M
              : never // Unreachable
    : never // Unreachable

it('negates a number literal type', () => {
  assertTypeEquality<Negate<1>, -1>()
  assertTypeEquality<Negate<-1>, 1>()
  assertTypeEquality<Negate<0>, 0>()
  assertTypeEquality<Negate<0.5>, -0.5>()
  assertTypeEquality<Negate<-0.5>, 0.5>()
  assertTypeEquality<Negate<1.5>, -1.5>()
  assertTypeEquality<Negate<-1.5>, 1.5>()
  assertTypeEquality<Negate<-1e21>, 1e21>()
  assertTypeEquality<Negate<1e21>, -1e21>()
  assertTypeEquality<Negate<1e-21>, -1e-21>()
  assertTypeEquality<Negate<-1e-21>, 1e-21>()
})
it('negates infinity', () => {
  assertTypeEquality<Negate<NegativeInfinity>, Infinity>()
  assertTypeEquality<Negate<Infinity>, NegativeInfinity>()
})
it('distributes over union types', () => {
  assertTypeEquality<Negate<2 | -4>, -2 | 4>()
  assertTypeEquality<Negate<number>, number>()
  assertTypeEquality<Negate<any>, number>()
  assertTypeEquality<Negate<never>, never>()
})
