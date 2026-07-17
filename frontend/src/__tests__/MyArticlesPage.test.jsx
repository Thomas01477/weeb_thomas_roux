import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import MyArticlesPage from "../pages/MyArticlesPage";
import { AuthProvider } from "../context/AuthContext";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  AUTH_LOGOUT_EVENT: "auth:logout",
}));

const ARTICLES = [
  { id: 1, title: "Article 1", content: "Contenu 1", author: "John Doe" },
  { id: 2, title: "Article 2", content: "Contenu 2", author: "John Doe" },
];

const renderPage = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <MyArticlesPage />
      </MemoryRouter>
    </AuthProvider>
  );

describe("MyArticlesPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("affiche la liste des articles de l'utilisateur", async () => {
    apiClient.get.mockResolvedValue({ data: ARTICLES });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Article 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Article 2")).toBeInTheDocument();
    expect(apiClient.get).toHaveBeenCalledWith("/api/articles/mine/");
  });

  it("affiche une modale de confirmation au clic sur Supprimer", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue({ data: ARTICLES });

    renderPage();
    await waitFor(() => expect(screen.getByText("Article 1")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /supprimer/i })[0]);

    expect(
      screen.getByText("Êtes-vous sûr de vouloir supprimer cet article ?")
    ).toBeInTheDocument();
  });

  it("supprime l'article après confirmation", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue({ data: ARTICLES });
    apiClient.delete.mockResolvedValue({});

    renderPage();
    await waitFor(() => expect(screen.getByText("Article 1")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /supprimer/i })[0]);
    await user.click(screen.getByRole("button", { name: /oui, supprimer/i }));

    await waitFor(() => {
      expect(screen.queryByText("Article 1")).not.toBeInTheDocument();
    });
    expect(apiClient.delete).toHaveBeenCalledWith("/api/articles/1/");
    expect(screen.getByText("Article 2")).toBeInTheDocument();
  });

  it("ferme la modale et garde l'article si l'annulation est choisie", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue({ data: ARTICLES });

    renderPage();
    await waitFor(() => expect(screen.getByText("Article 1")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /supprimer/i })[0]);
    await user.click(screen.getByRole("button", { name: /^annuler$/i }));

    expect(
      screen.queryByText("Êtes-vous sûr de vouloir supprimer cet article ?")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(apiClient.delete).not.toHaveBeenCalled();
  });

  it("affiche un formulaire pré-rempli au clic sur Modifier", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue({ data: ARTICLES });

    renderPage();
    await waitFor(() => expect(screen.getByText("Article 1")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /modifier/i })[0]);

    expect(screen.getByLabelText("Titre")).toHaveValue("Article 1");
    expect(screen.getByLabelText("Contenu")).toHaveValue("Contenu 1");
  });

  it("soumet la modification et revient à l'affichage de la liste", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue({ data: ARTICLES });
    apiClient.patch.mockResolvedValue({
      data: { id: 1, title: "Article modifié", content: "Contenu 1", author: "John Doe" },
    });

    renderPage();
    await waitFor(() => expect(screen.getByText("Article 1")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /modifier/i })[0]);
    await user.clear(screen.getByLabelText("Titre"));
    await user.type(screen.getByLabelText("Titre"), "Article modifié");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByText("Article modifié")).toBeInTheDocument();
    });
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/articles/1/",
      expect.objectContaining({ title: "Article modifié" })
    );
    expect(screen.queryByLabelText("Titre")).not.toBeInTheDocument();
  });
});
