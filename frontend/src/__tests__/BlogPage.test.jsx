import { render, screen, waitFor } from "@testing-library/react";
import BlogPage from "../pages/BlogPage";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn() },
}));

describe("BlogPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche un loader pendant le chargement", () => {
    apiClient.get.mockReturnValue(new Promise(() => {}));

    render(<BlogPage />);

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
    apiClient.get.mockResolvedValue({ data: articles });

    render(<BlogPage />);

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

    render(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Impossible de charger les articles pour le moment."
      );
    });
  });
});
