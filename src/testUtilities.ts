import type { Equals } from '@/type-level-predicate/Equals'

/**
 * @example
 * assertTypeEquality<number, string>() // Fails with type error
 * assertTypeEquality<Date, Date>() // Succeeds due to no type errors
 */
export function assertTypeEquality<T, U>(..._: Equals<T, U> extends true ? [] : [error: 'Type does not match', T, U]) {}

/**
 * @example
 * assertTypeInequality<Date, Date>() // Fails with type error
 * assertTypeInequality<number, string>() // Succeeds due to no type errors
 */
export function assertTypeInequality<T, U>(..._: Equals<T, U> extends false ? [] : [error: 'Types are equal', T, U]) {}

/** A function for grouping test cases and assigning a title. */
export function it(title: string, block: () => unknown) {
  console.log(`it: ${title}`)
  block()
}

/** A function for grouping test cases and assigning a title. */
export function test(title: string, block: () => unknown) {
  console.log(`test: ${title}`)
  block()
}

/** A function for grouping test cases and assigning a title. */
export function describe(title: string, block: () => unknown) {
  console.log(`describe: ${title}`)
  block()
}
