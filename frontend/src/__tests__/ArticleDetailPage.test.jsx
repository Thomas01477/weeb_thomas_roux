import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn() },
}));

const renderPage = (id = "1") =>
  render(
    <MemoryRouter initialEntries={[`/blog/${id}`]}>
      <Routes>
        <Route path="/blog/:id" element={<ArticleDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

describe("ArticleDetailPage", () => {
  afterEach(() => {
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
});
