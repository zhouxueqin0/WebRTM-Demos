import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Message from "./pages/Message";
import More from "./pages/More";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="message" element={<Message />} />
          <Route path="more" element={<More />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
