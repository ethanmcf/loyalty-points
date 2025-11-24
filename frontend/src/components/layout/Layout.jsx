import { Link, Outlet } from "react-router-dom";
import { Navbar } from "../navbar/NavBar";

export function Layout({ key }) {
  return (
    <>
      <header key={key}>
        <Navbar isAuthenticated={false} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
