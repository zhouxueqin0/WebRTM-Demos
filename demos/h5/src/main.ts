import "./style.css";
import { mockLogin } from "../../shared/utils/auth";

const app = document.querySelector<HTMLDivElement>("#app")!;

const renderLogin = () => {
  app.innerHTML = `
    <div class="login-container">
      <button id="loginBtn">Login</button>
    </div>
  `;

  const loginBtn = document.querySelector<HTMLButtonElement>("#loginBtn")!;
  loginBtn.addEventListener("click", async () => {
    loginBtn.disabled = true;
    loginBtn.textContent = "Loading...";

    try {
      await mockLogin("user", "password");
      localStorage.setItem("token", "mock-token-" + Date.now());
      renderDashboard();
    } catch (error) {
      console.error("Login failed:", error);
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  });
};

const renderDashboard = () => {
  app.innerHTML = `
    <div class="dashboard-container">
      <h1>Hello World</h1>
    </div>
  `;
};

renderLogin();
