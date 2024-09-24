import { assertTypeEquality, it } from '../testUtilities'

export type Not<T extends boolean> = T extends true ? false : true

it('returns the opposite of the input', () => {
  assertTypeEquality<Not<true>, false>()
  assertTypeEquality<Not<false>, true>()
})
it('distributes over unions', () => {
  assertTypeEquality<Not<boolean>, boolean>()
  assertTypeEquality<Not<never>, never>()
  assertTypeEquality<Not<any>, boolean>()
})
