import { it, expect } from "vitest";
import type { Result } from "../src/index";
import { Ok, Err } from "../src/index";

const div = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return Err("aaa");
  }
  return Ok(a / b);
};

it("isOk function", () => {
  expect(div(4, 2).isOk()).toBe(true);
  expect(div(4, 0).isOk()).toBe(false);
});

it("isErr function", () => {
  expect(div(4, 2).isErr()).toBe(false);
  expect(div(4, 0).isErr()).toBe(true);
});

it("map function", () => {
  expect(div(4, 2).map((v) => v + 1)._val).toBe(3);
  expect(div(4, 0).map((v) => v + 1)._val).toBe("aaa");
});

it("mapErr function", () => {
  expect(
    div(4, 2)
      .map((v) => v + 1)
      .mapErr((e) => `error is ${e}`)._val,
  ).toBe(3);

  expect(
    div(4, 0)
      .map((v) => v + 1)
      .mapErr((e) => `error is ${e}`)._val,
  ).toBe("error is aaa");
});

it("andThen, orElse", () => {
  const toChar = (n: number): Result<string, string> => {
    if (Number.isInteger(n) && 0 <= n && n < 10) {
      return Ok(n.toString());
    } else {
      return Err("out of range");
    }
  };

  const toError = (s: string): Result<string, string[]> => {
    if (s === "aaa") {
      return Err(["aaa", "bbb"]);
    } else {
      return Ok("1");
    }
  };

  expect(div(6, 2).andThen(toChar).orElse(toError)._val).toBe("3");
  expect(Ok(3).andThen(toChar).orElse(toError)._val).toBe("3");
  expect(div(6, 0).andThen(toChar).orElse(toError)._val).toStrictEqual(["aaa", "bbb"]);
});

it("isOk function", () => {
  const Result = div(4, 2);
  const v = Result.isOk() ? Result._val + 2 : Result._val; // should not throw
  expect(v).toBe(4);
  expect(div(4, 2).isOk()).toBe(true);
  expect(div(4, 0).isOk()).toBe(false);
});
