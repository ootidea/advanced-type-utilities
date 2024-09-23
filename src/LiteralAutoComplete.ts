import type { LiteralToPrimitive } from './LiteralToPrimitive'

/**
 * Enables IDE autocomplete for specific literals while allowing other values of the same primitive type.
 * https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts
 */
export type LiteralAutoComplete<Literals> = Literals | (LiteralToPrimitive<Literals> & {})
