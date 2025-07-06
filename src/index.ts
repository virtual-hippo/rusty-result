export interface IResult<T, E> {
  readonly _ok: boolean;
  readonly _err: boolean;
  readonly _val: T | E;
  readonly isOk: () => boolean;
  readonly isErr: () => boolean;

  readonly map: <U>(mapper: (val: T) => U) => IResult<U, E>;
  readonly mapErr: <F>(mapper: (val: E) => F) => IResult<T, F>;
  readonly andThen: <U, F>(mapper: (val: T) => IResult<U, F>) => IResult<U, E | F>;
  readonly orElse: <U, F>(mapper: (val: E) => IResult<U, F>) => IResult<T | U, F>;
}

export function Ok<T>(val: T): IResult<T, never> {
  throw new Error("Not implemented");
}

export function Err<E>(val: E): IResult<never, E> {
  throw new Error("Not implemented");
}
