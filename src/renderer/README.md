# README
You cannot run `remix vite:dev` in this directory because it is a renderer directory.

You have to run it in the root directory of the project.

# shadcn/ui
You can add shadcn/ui components in this directory.
```bash
npx shadcn@latest add button -c ../..
```
Then fix paths by replacing `@/app` with `../..`.
```diff
-import { cn } from "@/app/lib/utils"
+import { cn } from "../../lib/utils"
```