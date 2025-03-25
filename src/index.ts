export interface IResult<T, E> {
  readonly _ok: boolean;
  readonly _err: boolean;
  readonly _val: T | E;
  readonly isOk: () => boolean;
  readonly isErr: () => boolean;
  readonly map: <U>(mapper: (val: T) => U) => IResult<U, E>;
  readonly mapErr: <F>(mapper: (val: E) => F) => IResult<T, F>;
}

export interface Ok<T> extends IResult<T, never> {
  readonly _ok: true;
  readonly _err: false;
  readonly _val: T;
  readonly isOk: () => true;
  readonly isErr: () => false;
}

export interface Err<E> extends IResult<never, E> {
  readonly _ok: false;
  readonly _err: true;
  readonly _val: E;
  readonly isOk: () => false;
  readonly isErr: () => true;
}

export type Result<T, E> = Ok<T> | Err<E>;

class OkImpl<T> implements Ok<T> {
  readonly _ok: true;
  readonly _err: false;
  readonly _val: T;

  constructor(val: T) {
    this._ok = true;
    this._err = false;
    this._val = val;
  }

  isOk = (): true => true;
  isErr = (): false => false;

  map<U>(mapper: (val: T) => U): IResult<U, never> {
    return new OkImpl(mapper(this._val));
  }

  mapErr<F>(): IResult<T, F> {
    return this;
  }
}

class ErrImpl<E> implements Err<E> {
  readonly _ok: false;
  readonly _err: true;
  readonly _val: E;

  constructor(val: E) {
    this._ok = false;
    this._err = true;
    this._val = val;
  }

  isOk = (): false => false;
  isErr = (): true => true;

  map<U>(): IResult<U, E> {
    return this;
  }

  mapErr<F>(mapper: (val: E) => F): IResult<never, F> {
    return new ErrImpl(mapper(this._val));
  }
}

export const ok = <T>(val: T): Ok<T> => new OkImpl(val);
export const err = <E>(val: E): Err<E> => new ErrImpl(val);
