import { render, screen, waitFor } from "@testing-library/react";
import BlogPage from "../pages/BlogPage";

describe("BlogPage", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche un loader pendant le chargement", () => {
    globalThis.fetch.mockReturnValue(new Promise(() => {}));

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
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => articles,
    });

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
    globalThis.fetch.mockResolvedValue({ ok: false });

    render(<BlogPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Impossible de charger les articles pour le moment."
      );
    });
  });
});
