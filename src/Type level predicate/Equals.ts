export type Equals<T, U, Then = true, Else = false> = (<R>() => R extends T ? 1 : 2) extends <R>() => R extends U
  ? 1
  : 2
  ? Then
  : Else
