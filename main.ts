import { printDetermineType } from "./mod.ts";

// Learn more at https://docs.deno.com/runtime/manual/runtime/import_meta_api/#import.meta.main
if (import.meta.main) {
  printDetermineType(Deno.args[0] || ".");
}
