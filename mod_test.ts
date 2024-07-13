import { assertNotEquals } from "jsr:@std/assert";
import { determineType } from "./mod.ts";

Deno.test(function addTest() {
  assertNotEquals(determineType("/tmp"), "unknown");
});
