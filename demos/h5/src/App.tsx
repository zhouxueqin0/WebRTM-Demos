import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "jotai";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Message from "./pages/Message";
import More from "./pages/More";
import Navbar from "./components/Navbar";
import GlobalEventHandler from "./components/GlobalEventHandler";
import { isAuthenticated } from "../../shared/utils/auth";
import "./App.less";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <GlobalEventHandler />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Home />
                  <Navbar />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/message"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Message />
                  <Navbar />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/more"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <More />
                  <Navbar />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
