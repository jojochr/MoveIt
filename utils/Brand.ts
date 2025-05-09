declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

/**
 * This can be used to make type-safety at home in typescript
 * Find out more here: https://egghead.io/blog/using-branded-types-in-typescript
 */
export type Branded<T, B> = T & Brand<B>;
