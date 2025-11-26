import { Link, Outlet } from "react-router-dom";
import { Navbar } from "../navbar/NavBar";

export function Layout() {
  return (
    <>
      <header>
        <Navbar isAuthenticated={false} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
