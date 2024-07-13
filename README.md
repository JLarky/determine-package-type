### Determine Node Package Type

Determine if node thinks this current folder should be considered module or commonjs.

Node has a bunch of rules to determine if a file with `.js` should be treated as `.cjs` or `.mjs`.
Usually, this is determined by `"type"` field in the `package.json` but if you don't have that set value from the parent (or the parent's parent and so on) will be used.

To cut down on the guesswork this package will just create both commonjs version and module version of the file and see which one works.

### Usage

```bash
deno run -A jsr:@jlarky/determine-package-type
```

will output either `module` or `commonjs`.

You can also pass a path to a folder you want to try to determine the package type for.

```bash
deno run -A jsr:@jlarky/determine-package-type ./some-folder
```

Since this package is using Deno you can use it in the safe mode:

```bash
deno run jsr:@jlarky/determine-package-type
```

then just hit "y" + Enter when asked to check what exact permissions are needed.

Or pass the permissions manually:

```bash
deno run --allow-run=node --allow-write=. jsr:@jlarky/determine-package-type
# or
deno run --allow-run=node --allow-write=some-folder/.determine-type.js jsr:@jlarky/determine-package-type some-folder
```
