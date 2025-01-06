import { NavLink } from "react-router";

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold dark:text-white text-black">
            Welcome
          </h1>
        </header>
        <nav className="flex flex-col items-center justify-center">
          <NavLink to="/">Back to the top.</NavLink>
        </nav>
      </div>
    </div>
  );
}
