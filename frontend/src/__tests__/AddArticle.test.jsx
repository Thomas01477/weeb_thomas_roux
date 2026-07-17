import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddArticle from "../pages/AddArticle";
import BlogPage from "../pages/BlogPage";
import PrivateRoute from "../components/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { post: vi.fn(), get: vi.fn() },
  AUTH_LOGOUT_EVENT: "auth:logout",
}));

const LoginStub = () => <div>Page Login</div>;

const renderApp = (initialEntry) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<LoginStub />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route
            path="/add-article"
            element={
              <PrivateRoute>
                <AddArticle />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

describe("AddArticle", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("redirige vers /login si soumis sans token", () => {
    renderApp("/add-article");

    expect(screen.getByText("Page Login")).toBeInTheDocument();
  });

  it("crée l'article et l'affiche dans le blog après soumission par un membre", async () => {
    localStorage.setItem("access_token", "valid-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "john@example.com", first_name: "John", last_name: "Doe" })
    );

    const user = userEvent.setup();
    const newArticle = {
      id: 1,
      title: "Mon nouvel article",
      author: "John Doe",
      created_at: "2026-01-15T10:00:00Z",
      content: "Contenu de l'article.",
    };
    apiClient.post.mockResolvedValue({ data: newArticle });
    apiClient.get.mockResolvedValue({
      data: { count: 1, next: null, previous: null, results: [newArticle] },
    });

    renderApp("/add-article");
    await user.type(screen.getByLabelText("Titre"), "Mon nouvel article");
    await user.type(screen.getByLabelText("Contenu"), "Contenu de l'article.");
    await user.click(screen.getByRole("button", { name: /publier/i }));

    await waitFor(() => {
      expect(screen.getByText("Mon nouvel article")).toBeInTheDocument();
    });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/articles/",
      expect.objectContaining({
        title: "Mon nouvel article",
        content: "Contenu de l'article.",
        author: "John Doe",
      })
    );
  });
});
