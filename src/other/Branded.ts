export type Branded<T, Key extends keyof any> = T & Record<Key, never>
