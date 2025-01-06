import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("welcome", "./routes/welcome.tsx"),
  // pattern ^           ^ module file
] satisfies RouteConfig;