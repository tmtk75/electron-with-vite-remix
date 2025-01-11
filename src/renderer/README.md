# README
You cannot run `remix vite:dev` in this directory because it is a renderer directory.

You have to run it in the root directory of the project.

# shadcn/ui
You can add shadcn/ui components in this directory.
```bash
pnpm dlx shadcn@latest add button -c ../..
```
Then fix paths by replacing `app` with `../..`.
```diff
-import { cn } from "app/lib/utils"
+import { cn } from "../../lib/utils"
```
I don't like alias paths so much because they are not portable.

## shadcn components with pnpm
`pnpm dlx shadcn@latest add [component] -c ../..`
* [x] button
* [x] input
* [x] resizable
* [x] label
* [x] [command](https://ui.shadcn.com/docs/components/command)
* [x] [sidebar](https://ui.shadcn.com/docs/components/sidebar) : can be installed if I patched components.json

