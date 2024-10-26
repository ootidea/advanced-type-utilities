import type { Writable } from '@/object-manipulation/Writable'
import { assertTypeEquality, it } from '@/testUtilities'
import type { Equals } from '@/type-level-predicate/Equals'

export type CopyArrayWritability<From extends readonly unknown[], To extends readonly unknown[]> = Equals<From, any> extends true
  ? To
  : From extends unknown[]
    ? Writable<To>
    : Readonly<To>

it('copies the writability from the first array to the second array', () => {
  assertTypeEquality<CopyArrayWritability<readonly 1[], 2[]>, readonly 2[]>()
  assertTypeEquality<CopyArrayWritability<1[], readonly 2[]>, 2[]>()
  assertTypeEquality<CopyArrayWritability<1[], 2[]>, 2[]>()
  assertTypeEquality<CopyArrayWritability<readonly 1[], readonly 2[]>, readonly 2[]>()
})
it('returns the second array as is if the first array is any', () => {
  assertTypeEquality<CopyArrayWritability<any, 1[]>, 1[]>()
  assertTypeEquality<CopyArrayWritability<any, readonly 1[]>, readonly 1[]>()
})
