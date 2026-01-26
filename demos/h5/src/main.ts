import "./style.css";
import { mockLogin } from "../../shared/utils/auth.js";

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

    const result = await mockLogin("user", "password");

    if (result.success) {
      localStorage.setItem("token", result.token);
      renderDashboard();
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
