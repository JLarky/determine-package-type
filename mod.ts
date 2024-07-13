import { join } from "jsr:@std/path@1/join";

export type Type = "commonjs" | "module" | "unknown";

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

export function printDetermineType(path: string) {
  const type = determineType(path);
  console.log(type);
}
