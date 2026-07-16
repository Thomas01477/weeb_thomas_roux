import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";

const TestComponent = () => {
  const { login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <span>{isAuthenticated ? "authenticated" : "anonymous"}</span>
      <button onClick={() => login({ access: "abc", refresh: "def" })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("login() stocke les tokens et authentifie l'utilisateur", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("authenticated")).toBeInTheDocument();
    expect(localStorage.getItem("access_token")).toBe("abc");
    expect(localStorage.getItem("refresh_token")).toBe("def");
  });

  it("logout() vide le localStorage", async () => {
    localStorage.setItem("access_token", "abc");
    localStorage.setItem("refresh_token", "def");
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText("authenticated")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(screen.getByText("anonymous")).toBeInTheDocument();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });
});
