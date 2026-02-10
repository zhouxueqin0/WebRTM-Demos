import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import GlobalEventHandler from "./GlobalEventHandler";

export default function AppLayout() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      <GlobalEventHandler />
      {showNavbar && <Navbar />}
      <main style={showNavbar ? { marginLeft: "200px" } : {}}>
        <Outlet />
      </main>
    </>
  );
}
