import { it } from '../testUtilities'

export type Equals<T, U> = (<R>() => R extends T ? 1 : 2) extends <R>() => R extends U ? 1 : 2 ? true : false

// Utility for testing Equals<T, U>. Tests if two types are equal.
function assertTypeEqualityWithSymmetryCheck<T, U>(
  ..._: [Equals<T, U>, Equals<U, T>] extends [true, true] ? [] : [first: Equals<T, U>, second: Equals<U, T>]
) {}

// Utility for testing Equals<T, U>. Tests if two types are not equal.
function assertTypeInequalityWithSymmetryCheck<T, U>(
  ..._: [Equals<T, U>, Equals<U, T>] extends [false, false] ? [] : [first: Equals<T, U>, second: Equals<U, T>]
) {}

it('correctly determine the equality of regular types', () => {
  assertTypeEqualityWithSymmetryCheck<string, string>()
  assertTypeEqualityWithSymmetryCheck<'a', 'a'>()
  assertTypeEqualityWithSymmetryCheck<number[], number[]>()
  assertTypeEqualityWithSymmetryCheck<{ a: 1 }, { a: 1 }>()
})
it('correctly determine the equality of union types as well', () => {
  assertTypeEqualityWithSymmetryCheck<1 | 2, 1 | 2>()
  assertTypeEqualityWithSymmetryCheck<boolean, boolean>()
})
it('correctly determine the equality of special types', () => {
  assertTypeEqualityWithSymmetryCheck<any, any>()
  assertTypeEqualityWithSymmetryCheck<never, never>()
  assertTypeEqualityWithSymmetryCheck<unknown, unknown>()
})
it('ignores the labels of Labeled Tuple Elements', () => {
  assertTypeEqualityWithSymmetryCheck<[a: 1], [b: 1]>()
  assertTypeEqualityWithSymmetryCheck<[a: 1], [1]>()
})
it('ignores property order', () => {
  assertTypeEqualityWithSymmetryCheck<{ a: 1; b: 2 }, { b: 2; a: 1 }>()
})

it('correctly determine the inequality of special types', () => {
  assertTypeInequalityWithSymmetryCheck<any, unknown>()
  assertTypeInequalityWithSymmetryCheck<any, never>()
  assertTypeInequalityWithSymmetryCheck<void, undefined>()
})
it('distinguishes between number literals and bigint literals', () => {
  assertTypeInequalityWithSymmetryCheck<0, 0n>()
})
it('distinguishes between number literals and string literals', () => {
  assertTypeInequalityWithSymmetryCheck<0, '0'>()
})
it('distinguishes between wrapper object types and primitive types', () => {
  assertTypeInequalityWithSymmetryCheck<Number, number>()
})
it('distinguishes whether properties are readonly or not', () => {
  assertTypeInequalityWithSymmetryCheck<{ a: 1 }, { readonly a: 1 }>()
  assertTypeInequalityWithSymmetryCheck<[], readonly []>()
})
it('distinguishes whether properties are optional or not', () => {
  assertTypeInequalityWithSymmetryCheck<{ a?: 1 }, { a: 1 }>()
  assertTypeInequalityWithSymmetryCheck<[1?], [1]>()
})
it('does not automatically merge intersections of object types', () => {
  assertTypeInequalityWithSymmetryCheck<{ a: 1; b: 2 }, { a: 1 } & { b: 2 }>()
  assertTypeInequalityWithSymmetryCheck<string, string & {}>()
})
it('does not ignore properties of the never type', () => {
  assertTypeInequalityWithSymmetryCheck<{}, { a?: never }>()
  const privateKey: unique symbol = Symbol()
  assertTypeInequalityWithSymmetryCheck<{}, { [privateKey]?: never }>()
})
it('cannot equate non-empty arrays', () => {
  assertTypeInequalityWithSymmetryCheck<[1, ...1[]], [...1[], 1]>()
})
it('distinguishes between optional tuples and union of tuples', () => {
  assertTypeInequalityWithSymmetryCheck<[1?], [] | [1]>()
})
