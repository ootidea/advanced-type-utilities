export type Equals<T, U> = (<R>() => R extends T ? 1 : 2) extends <R>() => R extends U ? 1 : 2 ? true : false

function assertTypeEqualityWithSymmetryCheck<T, U>(
  ..._: [Equals<T, U>, Equals<U, T>] extends [true, true] ? [] : [first: Equals<T, U>, second: Equals<U, T>]
) {}

function assertTypeInequalityWithSymmetryCheck<T, U>(
  ..._: [Equals<T, U>, Equals<U, T>] extends [false, false] ? [] : [first: Equals<T, U>, second: Equals<U, T>]
) {}

assertTypeEqualityWithSymmetryCheck<boolean, boolean>()
assertTypeEqualityWithSymmetryCheck<any, any>()
assertTypeEqualityWithSymmetryCheck<never, never>()
assertTypeEqualityWithSymmetryCheck<[a: 1], [b: 1]>()
assertTypeEqualityWithSymmetryCheck<{ a: 1; b: 2 }, { b: 2; a: 1 }>()

assertTypeInequalityWithSymmetryCheck<any, unknown>()
assertTypeInequalityWithSymmetryCheck<any, never>()
assertTypeInequalityWithSymmetryCheck<void, undefined>()
assertTypeInequalityWithSymmetryCheck<0, 0n>()
assertTypeInequalityWithSymmetryCheck<Number, number>()
assertTypeInequalityWithSymmetryCheck<string, string & {}>()
assertTypeInequalityWithSymmetryCheck<[], readonly []>()
assertTypeInequalityWithSymmetryCheck<[1, ...1[]], [...1[], 1]>()
assertTypeInequalityWithSymmetryCheck<[1?], [] | [1]>()
assertTypeInequalityWithSymmetryCheck<{ a?: 1 }, { a: 1 }>()
assertTypeInequalityWithSymmetryCheck<{ a: 1; b: 2 }, { a: 1 } & { b: 2 }>()
assertTypeInequalityWithSymmetryCheck<{}, { a?: never }>()
