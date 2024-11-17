export default {
  plugins: {
    tailwindcss: {
      // Expect `remix vite:dev` to be run in the root of the project
      config: "./src/renderer/tailwind.config.ts",
    },
    autoprefixer: {},
  },
};
