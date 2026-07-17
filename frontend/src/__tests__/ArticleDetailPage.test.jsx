import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import { AuthProvider } from "../context/AuthContext";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  AUTH_LOGOUT_EVENT: "auth:logout",
}));

const BlogStub = () => <div>Page Blog</div>;

const renderPage = (id = "1") =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[`/blog/${id}`]}>
        <Routes>
          <Route path="/blog/:id" element={<ArticleDetailPage />} />
          <Route path="/blog" element={<BlogStub />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

const loginAs = (userOverrides) => {
  localStorage.setItem("access_token", "valid-token");
  localStorage.setItem(
    "user",
    JSON.stringify({ id: 1, email: "john@example.com", first_name: "John", last_name: "Doe", ...userOverrides })
  );
};

describe("ArticleDetailPage", () => {
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("affiche un loader pendant le chargement", () => {
    apiClient.get.mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Chargement de l'article..."
    );
  });

  it("affiche le titre et le contenu complet après un fetch réussi", async () => {
    apiClient.get.mockResolvedValue({
      data: {
        id: 1,
        title: "Article complet",
        author: "Alice",
        created_at: "2026-01-15T10:00:00Z",
        content: "Un contenu très long qui dépasse largement les cent caractères habituels de l'extrait affiché sur la page Blog.",
      },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Article complet")).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "Un contenu très long qui dépasse largement les cent caractères habituels de l'extrait affiché sur la page Blog."
      )
    ).toBeInTheDocument();
    expect(apiClient.get).toHaveBeenCalledWith("/api/articles/1/");
  });

  it("affiche un message d'erreur si l'article n'existe pas", async () => {
    apiClient.get.mockRejectedValue({ response: { status: 404 } });

    renderPage("999");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Cet article n'existe pas ou a été supprimé."
      );
    });
  });

  it("affiche un message d'erreur générique en cas d'échec réseau", async () => {
    apiClient.get.mockRejectedValue(new Error("network error"));

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Impossible de charger cet article pour le moment."
      );
    });
  });

  it("affiche un lien Retour au blog qui pointe vers /blog", async () => {
    apiClient.get.mockResolvedValue({
      data: {
        id: 1,
        title: "Article complet",
        author: "Alice",
        created_at: "2026-01-15T10:00:00Z",
        content: "Contenu.",
      },
    });

    renderPage();

    await waitFor(() => expect(screen.getByText("Article complet")).toBeInTheDocument());

    const backLink = screen.getByRole("link", { name: /retour au blog/i });
    expect(backLink).toHaveAttribute("href", "/blog");
  });

  it("affiche les boutons Modifier et Supprimer pour l'auteur de l'article", async () => {
    loginAs({ id: 1 });
    apiClient.get.mockResolvedValue({
      data: {
        id: 1,
        title: "Mon article",
        author: "John Doe",
        owner: 1,
        created_at: "2026-01-15T10:00:00Z",
        content: "Contenu.",
      },
    });

    renderPage();

    await waitFor(() => expect(screen.getByText("Mon article")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /modifier/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /supprimer/i })).toBeInTheDocument();
  });

  it("n'affiche pas les boutons Modifier/Supprimer pour un autre utilisateur", async () => {
    loginAs({ id: 2 });
    apiClient.get.mockResolvedValue({
      data: {
        id: 1,
        title: "Article d'un autre",
        author: "Alice",
        owner: 1,
        created_at: "2026-01-15T10:00:00Z",
        content: "Contenu.",
      },
    });

    renderPage();

    await waitFor(() => expect(screen.getByText("Article d'un autre")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: /modifier/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /supprimer/i })).not.toBeInTheDocument();
  });

  it("affiche une modale de confirmation puis supprime l'article et redirige vers /blog", async () => {
    const user = userEvent.setup();
    loginAs({ id: 1 });
    apiClient.get.mockResolvedValue({
      data: {
        id: 1,
        title: "Mon article",
        author: "John Doe",
        owner: 1,
        created_at: "2026-01-15T10:00:00Z",
        content: "Contenu.",
      },
    });
    apiClient.delete.mockResolvedValue({});

    renderPage();
    await waitFor(() => expect(screen.getByText("Mon article")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /supprimer/i }));
    expect(
      screen.getByText("Êtes-vous sûr de vouloir supprimer cet article ?")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /oui, supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText("Page Blog")).toBeInTheDocument();
    });
    expect(apiClient.delete).toHaveBeenCalledWith("/api/articles/1/");
  });

  it("affiche un formulaire pré-rempli au clic sur Modifier et enregistre les modifications", async () => {
    const user = userEvent.setup();
    loginAs({ id: 1 });
    apiClient.get.mockResolvedValue({
      data: {
        id: 1,
        title: "Mon article",
        author: "John Doe",
        owner: 1,
        created_at: "2026-01-15T10:00:00Z",
        content: "Contenu original.",
      },
    });
    apiClient.patch.mockResolvedValue({
      data: {
        id: 1,
        title: "Titre modifié",
        author: "John Doe",
        owner: 1,
        created_at: "2026-01-15T10:00:00Z",
        content: "Contenu original.",
      },
    });

    renderPage();
    await waitFor(() => expect(screen.getByText("Mon article")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /modifier/i }));
    expect(screen.getByLabelText("Titre")).toHaveValue("Mon article");

    await user.clear(screen.getByLabelText("Titre"));
    await user.type(screen.getByLabelText("Titre"), "Titre modifié");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Titre modifié")).toBeInTheDocument();
    });
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/articles/1/",
      expect.objectContaining({ title: "Titre modifié" })
    );
  });
});
