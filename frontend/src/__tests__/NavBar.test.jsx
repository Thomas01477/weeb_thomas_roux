import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../context/AuthContext";

const renderNavBar = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </AuthProvider>
  );

describe("NavBar", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("affiche Connexion et S'inscrire quand l'utilisateur n'est pas authentifié", () => {
    renderNavBar();

    expect(screen.getAllByText("Connexion").length).toBeGreaterThan(0);
    expect(screen.getAllByText("S'inscrire").length).toBeGreaterThan(0);
    expect(screen.queryByText("Mon compte")).not.toBeInTheDocument();
  });

  it("affiche Mon compte et Déconnexion quand l'utilisateur est authentifié", () => {
    localStorage.setItem("access_token", "valid-token");
    localStorage.setItem("user", JSON.stringify({ email: "john@example.com", is_staff: false }));

    renderNavBar();

    expect(screen.getAllByText("Mon compte").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Déconnexion").length).toBeGreaterThan(0);
    expect(screen.queryByText("Connexion")).not.toBeInTheDocument();
  });

  it("affiche le lien Admin uniquement pour un utilisateur is_staff", () => {
    localStorage.setItem("access_token", "valid-token");
    localStorage.setItem("user", JSON.stringify({ email: "admin@example.com", is_staff: true }));

    renderNavBar();

    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
  });

  it("n'affiche pas le lien Admin pour un membre authentifié non-staff", () => {
    localStorage.setItem("access_token", "valid-token");
    localStorage.setItem("user", JSON.stringify({ email: "john@example.com", is_staff: false }));

    renderNavBar();

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });
});
