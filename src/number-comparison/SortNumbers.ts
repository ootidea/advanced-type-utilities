import type { CopyArrayWritability } from '@/array-manipulation/CopyArrayWritability'
import type { LessThan } from '@/number-comparison/LessThan'
import { assertTypeEquality } from '@/testUtilities'

/**
 * Sorts an array of numbers in ascending order.
 * Time complexity: O(n log n), where n is the length of the input array.
 */
export type SortNumbers<T extends readonly number[]> = CopyArrayWritability<T, MergeSort<ToSingleElementArrays<T>>>

assertTypeEquality<SortNumbers<[]>, []>()
assertTypeEquality<SortNumbers<[1]>, [1]>()
assertTypeEquality<SortNumbers<[2, 1]>, [1, 2]>()

assertTypeEquality<SortNumbers<[1, 2, 3]>, [1, 2, 3]>()
assertTypeEquality<SortNumbers<[1, 3, 2]>, [1, 2, 3]>()
assertTypeEquality<SortNumbers<[2, 1, 3]>, [1, 2, 3]>()
assertTypeEquality<SortNumbers<[2, 3, 1]>, [1, 2, 3]>()
assertTypeEquality<SortNumbers<[3, 1, 2]>, [1, 2, 3]>()
assertTypeEquality<SortNumbers<[3, 2, 1]>, [1, 2, 3]>()

assertTypeEquality<SortNumbers<[3, 1, 4, 1, 5]>, [1, 1, 3, 4, 5]>()

assertTypeEquality<SortNumbers<readonly []>, readonly []>()
assertTypeEquality<SortNumbers<readonly [2, 1]>, readonly [1, 2]>()

// TODO: Add more test cases

type MergeSort<L extends readonly (readonly number[])[]> = L extends readonly [
  infer E1 extends number[],
  infer E2 extends number[],
  ...infer R extends (readonly number[])[],
]
  ? MergeSort<[...R, MergeNumbers<E1, E2>]>
  : L extends readonly [infer E extends readonly number[]]
    ? E
    : []

/**
 * @example
 * ToSingleElementArrays<[3, 2, 1]> // [[3], [2], [1]]
 */
type ToSingleElementArrays<T extends readonly number[]> = { [K in keyof T]: [T[K]] }

/**
 * Merge two sorted number arrays into one sorted number array.
 * @example
 * MergeNumbers<[1, 3, 5], [2, 4, 6]> // [1, 2, 3, 4, 5, 6]
 */
type MergeNumbers<T extends readonly number[], U extends readonly number[]> = T extends readonly [
  infer TH extends number,
  ...infer TL extends number[],
]
  ? U extends readonly [infer UH extends number, ...infer UL extends number[]]
    ? LessThan<TH, UH> extends true
      ? [TH, ...MergeNumbers<TL, U>]
      : [UH, ...MergeNumbers<T, UL>]
    : T
  : U
