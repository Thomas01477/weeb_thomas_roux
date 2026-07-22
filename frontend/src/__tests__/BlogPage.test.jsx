import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BlogPage from "../pages/BlogPage";
import { AuthProvider } from "../context/AuthContext";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn() },
  AUTH_LOGOUT_EVENT: "auth:logout",
}));

const paginatedResponse = (results, overrides = {}) => ({
  data: { count: results.length, next: null, previous: null, results, ...overrides },
});

const renderBlogPage = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <BlogPage />
      </MemoryRouter>
    </AuthProvider>
  );

describe("BlogPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("affiche un loader pendant le chargement", () => {
    apiClient.get.mockReturnValue(new Promise(() => {}));

    renderBlogPage();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Chargement des articles..."
    );
  });

  it("affiche les articles une fois le fetch réussi", async () => {
    const articles = [
      {
        id: 1,
        title: "Premier article",
        author: "Alice",
        created_at: "2026-01-15T10:00:00Z",
        content: "Contenu du premier article.",
      },
    ];
    apiClient.get.mockResolvedValue(paginatedResponse(articles));

    renderBlogPage();

    await waitFor(() => {
      expect(screen.getByText("Premier article")).toBeInTheDocument();
    });
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(
      screen.queryByRole("status")
    ).not.toBeInTheDocument();
  });

  it("affiche un message d'erreur si le fetch échoue", async () => {
    apiClient.get.mockRejectedValue(new Error("network error"));

    renderBlogPage();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Impossible de charger les articles pour le moment."
      );
    });
  });

  it("filtre les articles via le champ de recherche", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue(
      paginatedResponse([
        {
          id: 1,
          title: "Premier article",
          author: "Alice",
          created_at: "2026-01-15T10:00:00Z",
          content: "Contenu.",
        },
      ])
    );

    renderBlogPage();
    await waitFor(() => expect(screen.getByText("Premier article")).toBeInTheDocument());

    apiClient.get.mockResolvedValue(
      paginatedResponse([
        {
          id: 2,
          title: "Article sur Weeb",
          author: "Bob",
          created_at: "2026-01-16T10:00:00Z",
          content: "Contenu.",
        },
      ])
    );

    await user.type(screen.getByLabelText("Rechercher un article"), "Weeb");

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenLastCalledWith("/api/articles/", {
        params: { search: "Weeb", category: undefined, author: undefined, page: 1 },
      });
    });
    await waitFor(() => {
      expect(screen.getByText("Article sur Weeb")).toBeInTheDocument();
    });
  });

  it("affiche un message dédié si la recherche ne retourne rien", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue(paginatedResponse([]));

    renderBlogPage();
    await waitFor(() =>
      expect(screen.getByText("Aucun article pour le moment.")).toBeInTheDocument()
    );

    await user.type(screen.getByLabelText("Rechercher un article"), "introuvable");

    await waitFor(() => {
      expect(
        screen.getByText("Aucun article ne correspond à votre recherche.")
      ).toBeInTheDocument();
    });
  });

  it("navigue entre les pages avec les contrôles de pagination", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue(
      paginatedResponse(
        [{ id: 1, title: "Article page 1", author: "Alice", created_at: "2026-01-15T10:00:00Z", content: "C." }],
        { count: 11, next: "http://api/articles/?page=2", previous: null }
      )
    );

    renderBlogPage();
    await waitFor(() => expect(screen.getByText("Article page 1")).toBeInTheDocument());

    apiClient.get.mockResolvedValue(
      paginatedResponse(
        [{ id: 2, title: "Article page 2", author: "Bob", created_at: "2026-01-16T10:00:00Z", content: "C." }],
        { count: 11, next: null, previous: "http://api/articles/?page=1" }
      )
    );

    await user.click(screen.getByRole("button", { name: /suivant/i }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenLastCalledWith("/api/articles/", {
        params: { search: undefined, category: undefined, author: undefined, page: 2 },
      });
    });
    await waitFor(() => expect(screen.getByText("Article page 2")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /suivant/i })).toBeDisabled();
  });

  it("désactive Première page et active Dernière page sur la première page", async () => {
    apiClient.get.mockResolvedValue(
      paginatedResponse(
        [{ id: 1, title: "Article page 1", author: "Alice", created_at: "2026-01-15T10:00:00Z", content: "C." }],
        { count: 11, next: "http://api/articles/?page=2", previous: null }
      )
    );

    renderBlogPage();
    await waitFor(() => expect(screen.getByText("Article page 1")).toBeInTheDocument());

    expect(screen.getByRole("button", { name: /première page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /dernière page/i })).not.toBeDisabled();
  });

  it("désactive Dernière page et active Première page sur la dernière page", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue(
      paginatedResponse(
        [{ id: 1, title: "Article page 1", author: "Alice", created_at: "2026-01-15T10:00:00Z", content: "C." }],
        { count: 11, next: "http://api/articles/?page=2", previous: null }
      )
    );

    renderBlogPage();
    await waitFor(() => expect(screen.getByText("Article page 1")).toBeInTheDocument());

    apiClient.get.mockResolvedValue(
      paginatedResponse(
        [{ id: 2, title: "Article page 2", author: "Bob", created_at: "2026-01-16T10:00:00Z", content: "C." }],
        { count: 11, next: null, previous: "http://api/articles/?page=1" }
      )
    );

    await user.click(screen.getByRole("button", { name: /suivant/i }));

    await waitFor(() => expect(screen.getByText("Article page 2")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /dernière page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /première page/i })).not.toBeDisabled();
  });

  it("va directement à la dernière page via le bouton dédié", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue(
      paginatedResponse(
        [{ id: 1, title: "Article page 1", author: "Alice", created_at: "2026-01-15T10:00:00Z", content: "C." }],
        { count: 11, next: "http://api/articles/?page=2", previous: null }
      )
    );

    renderBlogPage();
    await waitFor(() => expect(screen.getByText("Article page 1")).toBeInTheDocument());

    apiClient.get.mockResolvedValue(
      paginatedResponse(
        [{ id: 2, title: "Article page 2", author: "Bob", created_at: "2026-01-16T10:00:00Z", content: "C." }],
        { count: 11, next: null, previous: "http://api/articles/?page=1" }
      )
    );

    await user.click(screen.getByRole("button", { name: /dernière page/i }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenLastCalledWith("/api/articles/", {
        params: { search: undefined, category: undefined, author: undefined, page: 2 },
      });
    });
    await waitFor(() => expect(screen.getByText("Article page 2")).toBeInTheDocument());
  });

  it("affiche le badge de catégorie sur un article qui en a une", async () => {
    apiClient.get.mockImplementation((url) => {
      if (url === "/api/categories/") {
        return Promise.resolve({ data: [{ id: 1, name: "Tech" }] });
      }
      return Promise.resolve(
        paginatedResponse([
          {
            id: 1,
            title: "Article catégorisé",
            author: "Alice",
            created_at: "2026-01-15T10:00:00Z",
            content: "Contenu.",
            category: 1,
            category_name: "Tech",
          },
        ])
      );
    });

    renderBlogPage();

    await waitFor(() => {
      expect(screen.getByText("Article catégorisé")).toBeInTheDocument();
    });
    const article = screen.getByText("Article catégorisé").closest("a");
    expect(within(article).getByText("Tech")).toBeInTheDocument();
  });

  it("filtre les articles par catégorie sélectionnée", async () => {
    const user = userEvent.setup();
    apiClient.get.mockImplementation((url) => {
      if (url === "/api/categories/") {
        return Promise.resolve({
          data: [
            { id: 1, name: "Tech" },
            { id: 2, name: "Culture" },
          ],
        });
      }
      return Promise.resolve(
        paginatedResponse([
          {
            id: 1,
            title: "Article Tech",
            author: "Alice",
            created_at: "2026-01-15T10:00:00Z",
            content: "Contenu.",
          },
        ])
      );
    });

    renderBlogPage();
    await waitFor(() => expect(screen.getByText("Article Tech")).toBeInTheDocument());

    await user.selectOptions(screen.getByLabelText("Filtrer par catégorie"), "1");

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenLastCalledWith("/api/articles/", {
        params: { search: undefined, category: "1", author: undefined, page: 1 },
      });
    });
  });

  it("n'affiche pas le bouton 'Mes articles uniquement' si non authentifié", async () => {
    apiClient.get.mockResolvedValue(paginatedResponse([]));

    renderBlogPage();
    await waitFor(() =>
      expect(screen.getByText("Aucun article pour le moment.")).toBeInTheDocument()
    );

    expect(
      screen.queryByRole("button", { name: /mes articles uniquement/i })
    ).not.toBeInTheDocument();
  });

  it("filtre sur les articles de l'utilisateur connecté via le bouton dédié", async () => {
    localStorage.setItem("access_token", "valid-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, email: "john@example.com" })
    );

    const user = userEvent.setup();
    apiClient.get.mockResolvedValue(
      paginatedResponse([
        {
          id: 1,
          title: "Article de John",
          author: "John",
          created_at: "2026-01-15T10:00:00Z",
          content: "Contenu.",
        },
      ])
    );

    renderBlogPage();
    await waitFor(() => expect(screen.getByText("Article de John")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /mes articles uniquement/i }));

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenLastCalledWith("/api/articles/", {
        params: { search: undefined, category: undefined, author: "me", page: 1 },
      });
    });
    expect(screen.getByRole("button", { name: /tous les articles/i })).toBeInTheDocument();
  });
});
