import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Message from "./pages/Message";
import More from "./pages/More";
import Navbar from "./components/Navbar";
import GlobalEventHandler from "./components/GlobalEventHandler";
import "./App.less";

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <main style={{ marginLeft: showNavbar ? "200px" : "0" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/message" element={<Message />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </main>
      <GlobalEventHandler />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
