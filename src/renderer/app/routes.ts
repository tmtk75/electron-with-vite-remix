// https://reactrouter.com/start/framework/routing#configuring-routes

// import { type RouteConfig, route, index } from "@react-router/dev/routes";
// export default [
//   index("./routes/_index/route.tsx"),
//   route("welcome", "./routes/welcome.tsx"),
//   route("page", "./routes/page.tsx"),
//   // pattern ^           ^ module file
// ] satisfies RouteConfig;

// https://reactrouter.com/start/framework/routing#configuring-routes
import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  ...await flatRoutes(),
] satisfies RouteConfig;
