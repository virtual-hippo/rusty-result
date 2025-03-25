import { it, expect } from "vitest";
import { ok, err, Result } from "../src/index";

const div = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return err("aaa");
  }
  return ok(a / b);
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
