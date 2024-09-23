import type { IsOneOf } from './Type level predicate/IsOneOf'
import { assertTypeEquality } from './testUtilities'

export type LiteralToPrimitive<T> = IsOneOf<T, [any, never, boolean]> extends true
  ? T
  : T extends T
    ? T extends string
      ? string
      : T extends number
        ? number
        : T extends bigint
          ? bigint
          : T extends boolean
            ? boolean
            : T extends symbol
              ? symbol
              : T
    : never

assertTypeEquality<LiteralToPrimitive<true>, boolean>()
assertTypeEquality<LiteralToPrimitive<1>, number>()
assertTypeEquality<LiteralToPrimitive<1n>, bigint>()
assertTypeEquality<LiteralToPrimitive<'a'>, string>()
assertTypeEquality<LiteralToPrimitive<undefined>, undefined>()
assertTypeEquality<LiteralToPrimitive<null>, null>()
assertTypeEquality<LiteralToPrimitive<1 | 'a'>, number | string>()
assertTypeEquality<LiteralToPrimitive<never>, never>()
assertTypeEquality<LiteralToPrimitive<any>, any>()
assertTypeEquality<LiteralToPrimitive<unknown>, unknown>()
assertTypeEquality<LiteralToPrimitive<boolean>, boolean>()
