import { Link, Outlet } from "react-router-dom";
import { NavBar } from "../navbar/NavBar";

export function Layout() {
  return (
    <>
      <header>
        <NavBar isAuthenticated={false} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
