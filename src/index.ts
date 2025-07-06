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

export interface Ok<T> extends IResult<T, never> {
  readonly _ok: true;
  readonly _err: false;
  readonly _val: T;
  readonly isOk: () => true;
  readonly isErr: () => false;
  readonly andThen: <U, E>(mapper: (val: T) => IResult<U, E>) => IResult<U, E>;
  readonly orElse: () => IResult<T, never>;
}

export interface Err<E> extends IResult<never, E> {
  readonly _ok: false;
  readonly _err: true;
  readonly _val: E;
  readonly isOk: () => false;
  readonly isErr: () => true;
  readonly andThen: () => IResult<never, E>;
  readonly orElse: <T, F>(mapper: (val: E) => IResult<T, F>) => IResult<T, F>;
}

export type Result<T, E> = Ok<T> | Err<E>;

export function Ok<T>(val: T): Ok<T> {
  return {
    _ok: true,
    _err: false,
    _val: val,
    isOk: () => true,
    isErr: () => false,
    map: function <U>(mapper: (val: T) => U): Ok<U> {
      return Ok(mapper(val));
    },
    mapErr: function (): Ok<T> {
      return this;
    },
    andThen: function <U, F>(mapper: (val: T) => IResult<U, F>): IResult<U, F> {
      return mapper(this._val);
    },
    orElse: function (): Ok<T> {
      return this;
    },
  } satisfies Ok<T>;
}

export function Err<E>(val: E): Err<E> {
  return {
    _ok: false,
    _err: true,
    _val: val,
    isOk: () => false,
    isErr: () => true,
    map: function (): Err<E> {
      return this;
    },
    mapErr: function <F>(mapper: (val: E) => F): Err<F> {
      return Err(mapper(val));
    },
    andThen: function (): Err<E> {
      return this;
    },
    orElse: function <T, F>(mapper: (val: E) => IResult<T, F>): IResult<T, F> {
      return mapper(this._val);
    },
  } satisfies Err<E>;
}
