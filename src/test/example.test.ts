import { describe, expect, test } from "vitest";
import api from "~/trpc/direct";
// import { api } from "~/trpc/server";

describe("test add function", () => {
  test("Hello world", async () => {
    const response = await api.example.hello.query({ text: "world" });
    expect(response).toEqual({
      greeting: "Hello world",
    });
  });
});
