interface IOk<T> {
  readonly _ok: true;
  readonly _err: false;
  readonly _val: T;
}

interface IErr<E> {
  readonly _ok: false;
  readonly _err: true;
  readonly _val: E;
}

interface IResult<T, E> {
  readonly isOk: () => this is Ok<T>;
  readonly isErr: () => this is Err<E>;

  readonly map: <U>(mapper: (val: T) => U) => Result<U, E>;
  readonly mapErr: <F>(mapper: (val: E) => F) => Result<T, F>;
  readonly andThen: <U, F>(mapper: (val: T) => Result<U, F>) => Result<U, E | F>;
  readonly orElse: <U, F>(mapper: (val: E) => Result<U, F>) => Result<T | U, F>;
}

export type Ok<T> = IResult<T, never> & IOk<T>;
export type Err<E> = IResult<never, E> & IErr<E>;
export type Result<T, E> = Ok<T> | Err<E>;

export function Ok<T>(val: T): Result<T, never> {
  return {
    _ok: true,
    _err: false,
    _val: val,
    isOk: (): this is Ok<T> => true,
    isErr: (): this is Err<never> => false,
    map: function <U>(mapper: (val: T) => U): Result<U, never> {
      return Ok(mapper(this._val));
    },
    mapErr: function () {
      return this;
    },
    andThen: function <U, F>(mapper: (val: T) => Result<U, F>): Result<U, F> {
      return mapper(this._val);
    },
    orElse: function () {
      return this;
    },
  };
}

export function Err<E>(val: E): Result<never, E> {
  return {
    _ok: false,
    _err: true,
    _val: val,
    isOk: (): this is Ok<never> => false,
    isErr: (): this is Err<E> => true,
    map: function () {
      return this;
    },
    mapErr: function <F>(mapper: (val: E) => F): Result<never, F> {
      return Err(mapper(this._val));
    },
    andThen: function () {
      return this;
    },
    orElse: function <U, F>(mapper: (val: E) => Result<U, F>): Result<U, F> {
      return mapper(this._val);
    },
  };
}
