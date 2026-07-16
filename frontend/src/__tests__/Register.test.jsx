import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

describe("Register", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche le message de confirmation après une inscription réussie", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValue({
      status: 201,
      json: async () => ({ id: 1, is_active: false }),
    });

    renderRegister();
    await user.type(screen.getByPlaceholderText("Prénom"), "John");
    await user.type(screen.getByPlaceholderText("Nom"), "Doe");
    await user.type(screen.getByPlaceholderText("Adresse e-mail"), "john@example.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "s3curePassw0rd");
    await user.type(screen.getByPlaceholderText("Confirmer le mot de passe"), "s3curePassw0rd");
    await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Compte créé, en attente de validation par un administrateur."
      );
    });
  });

  it("affiche une erreur si les mots de passe ne correspondent pas", async () => {
    const user = userEvent.setup();

    renderRegister();
    await user.type(screen.getByPlaceholderText("Prénom"), "John");
    await user.type(screen.getByPlaceholderText("Nom"), "Doe");
    await user.type(screen.getByPlaceholderText("Adresse e-mail"), "john@example.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "s3curePassw0rd");
    await user.type(screen.getByPlaceholderText("Confirmer le mot de passe"), "different");
    await user.click(screen.getByRole("button", { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Les mots de passe ne correspondent pas.")
      ).toBeInTheDocument();
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
