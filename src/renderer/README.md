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

## components by npx
`npx shadcn@latest add [component] -c ../..`
* [x] button
* [x] input
* [x] resizable
* [x] label
* [x] [command](https://ui.shadcn.com/docs/components/command)
* [x] [sidebar](https://ui.shadcn.com/docs/components/sidebar) : can be installed if I patched components.json

```
diff --git a/components.json b/components.json
index 0f2b9df..090c1fb 100644
--- a/components.json
+++ b/components.json
@@ -4,8 +4,8 @@
   "rsc": false,
   "tsx": true,
   "tailwind": {
-    "config": "./tailwind.config.ts",
-    "css": "./app/tailwind.css",
+    "config": "./src/renderer/tailwind.config.ts",
+    "css": "./src/renderer/app/tailwind.css",
     "baseColor": "neutral",
     "cssVariables": true,
     "prefix": ""
@@ -18,4 +18,4 @@
     "hooks": "app/hooks"
   },
   "iconLibrary": "lucide"
```
