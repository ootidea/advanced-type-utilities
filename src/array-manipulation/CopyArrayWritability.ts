import type { Writable } from '@/object-manipulation/Writable'
import { assertTypeEquality } from '@/testUtilities'

export type CopyArrayWritability<T extends readonly unknown[], U extends readonly unknown[]> = T extends unknown[]
  ? Writable<U>
  : Readonly<U>

assertTypeEquality<CopyArrayWritability<readonly 1[], 2[]>, readonly 2[]>()
assertTypeEquality<CopyArrayWritability<1[], readonly 2[]>, 2[]>()
assertTypeEquality<CopyArrayWritability<1[], 2[]>, 2[]>()
assertTypeEquality<CopyArrayWritability<readonly 1[], readonly 2[]>, readonly 2[]>()
