import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Account from "../pages/Account";
import { AuthProvider } from "../context/AuthContext";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), patch: vi.fn() },
  AUTH_LOGOUT_EVENT: "auth:logout",
}));

const renderAccount = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    </AuthProvider>
  );

describe("Account", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche le formulaire pré-rempli avec les données du profil", async () => {
    apiClient.get.mockResolvedValue({
      data: {
        first_name: "Jean",
        last_name: "Dupont",
        email: "jean.dupont@example.com",
      },
    });

    renderAccount();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Prénom")).toHaveValue("Jean");
    });
    expect(screen.getByPlaceholderText("Nom")).toHaveValue("Dupont");
    expect(screen.getByPlaceholderText("Adresse e-mail")).toHaveValue(
      "jean.dupont@example.com"
    );
  });

  it("affiche une erreur si le chargement du profil échoue", async () => {
    apiClient.get.mockRejectedValue(new Error("network error"));

    renderAccount();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Impossible de charger votre profil. Veuillez réessayer."
      );
    });
  });

  it("met à jour le profil avec succès", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue({
      data: { first_name: "Jean", last_name: "Dupont", email: "jean@example.com" },
    });
    apiClient.patch.mockResolvedValue({
      data: { first_name: "Jeanne", last_name: "Dupont", email: "jean@example.com" },
    });

    renderAccount();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Prénom")).toHaveValue("Jean");
    });

    await user.clear(screen.getByPlaceholderText("Prénom"));
    await user.type(screen.getByPlaceholderText("Prénom"), "Jeanne");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Profil mis à jour avec succès."
      );
    });
    expect(apiClient.patch).toHaveBeenCalledWith("/api/auth/profile/", {
      first_name: "Jeanne",
      last_name: "Dupont",
      email: "jean@example.com",
    });
  });

  it("affiche les erreurs de validation retournées par le backend", async () => {
    const user = userEvent.setup();
    apiClient.get.mockResolvedValue({
      data: { first_name: "Jean", last_name: "Dupont", email: "jean@example.com" },
    });
    apiClient.patch.mockRejectedValue({
      response: { status: 400, data: { email: ["A user with this email already exists."] } },
    });

    renderAccount();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Prénom")).toHaveValue("Jean");
    });

    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(
        screen.getByText("A user with this email already exists.")
      ).toBeInTheDocument();
    });
  });
});
