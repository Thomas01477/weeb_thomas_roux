import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";

const BlogStub = () => <div>Page Blog</div>;

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<BlogStub />} />
      </Routes>
    </MemoryRouter>
  );

describe("Login", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirige vers /blog après une connexion réussie", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ access: "access-token", refresh: "refresh-token" }),
    });

    renderLogin();
    await user.type(screen.getByPlaceholderText("Adresse e-mail"), "john@example.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "password123");
    await user.click(screen.getByRole("button", { name: /connexion/i }));

    await waitFor(() => {
      expect(screen.getByText("Page Blog")).toBeInTheDocument();
    });
    expect(localStorage.getItem("access_token")).toBe("access-token");
    expect(localStorage.getItem("refresh_token")).toBe("refresh-token");
  });

  it("affiche une erreur en cas de mauvais mot de passe", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Invalid credentials." }),
    });

    renderLogin();
    await user.type(screen.getByPlaceholderText("Adresse e-mail"), "john@example.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "wrong-password");
    await user.click(screen.getByRole("button", { name: /connexion/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Adresse e-mail ou mot de passe incorrect."
      );
    });
  });
});
