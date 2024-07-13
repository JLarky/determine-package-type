import { join } from "jsr:@std/path@1/join";

/**
 * The type of the module.
 *
 * - `commonjs` - The module is a CommonJS module.
 * - `module` - The module is an ECMAScript module.
 * - `unknown` - The type of the module could not be determined.
 */
export type Type = "commonjs" | "module" | "unknown";

/**
 * Determine the type of the module at the given path.
 *
 * @param path The path to the module.
 * @returns The type of the module.
 */
export function determineType(path: string): Type {
  const jsFilePath = join(path, ".determine-type.js");
  try {
    Deno.writeTextFileSync(jsFilePath, esmContent);
  } catch (error) {
    console.error(
      "Failed to create temporary file",
      jsFilePath,
      "make sure that the path is writable"
    );
    console.warn("Error:", error);
    return "unknown";
  }
  const esmRes = runNode(jsFilePath);
  Deno.writeTextFileSync(jsFilePath, cjsContent);
  const cjsRes = runNode(jsFilePath);
  Deno.removeSync(jsFilePath);
  if (esmRes.success === true && cjsRes.success === false) {
    return "module";
  }
  if (esmRes.success === false && cjsRes.success === true) {
    return "commonjs";
  }
  console.error("Failed to determine the type of the module");
  console.error("ESM:", esmRes.error);
  console.error("CJS:", cjsRes.error);
  return "unknown";
}

function runNode(filePath: string): { success: boolean; error: string } {
  const command = new Deno.Command("node", {
    args: [filePath],
    stdout: "piped",
    stderr: "piped",
  });
  const { success, stderr } = command.outputSync();
  if (success) {
    return { success: true, error: "" };
  }
  const error = new TextDecoder().decode(stderr);
  const lines = error.split("\n");
  const errLine = lines.find((line) => line.includes("ES module"));
  if (errLine) {
    return { success: false, error: errLine };
  }
  return { success: false, error };
}

const esmContent = `import "node:util";`;
const cjsContent = `require("node:util");`;

/**
 * Print the type of the module at the given path.
 *
 * That's what you get from running the following command:
 *
 * ```sh
 * deno run jsr:@jlarky/determine-package-type
 * ```
 *
 * @param path The path to the module.
 */
export function printDetermineType(path: string) {
  const type = determineType(path);
  console.log(type);
}
