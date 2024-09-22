import type { Equals } from './Type level predicate/Equals'

/**
 * @example
 * assertTypeEquality<number, string>() // Fails with type error
 * assertTypeEquality<Date, Date>() // Succeeds due to no type errors
 */
export function assertTypeEquality<T, U>(..._: Equals<T, U> extends true ? [] : [error: 'Type does not match']) {}

/**
 * @example
 * assertTypeInequality<Date, Date>() // Fails with type error
 * assertTypeInequality<number, string>() // Succeeds due to no type errors
 */
export function assertTypeInequality<T, U>(..._: Equals<T, U> extends false ? [] : [error: 'Types are equal']) {}

/** A function for grouping test cases and assigning a title. */
export function it(title: string, block: () => unknown) {
  console.log(`it: ${title}`)
  block()
}
