import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import { AuthProvider } from "../context/AuthContext";

const ProtectedStub = () => <div>Contenu protégé</div>;
const LoginStub = () => <div>Page Login</div>;

const renderWithRoute = (initialEntry) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<LoginStub />} />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <ProtectedStub />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

describe("PrivateRoute", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("redirige vers /login sans token", () => {
    renderWithRoute("/account");

    expect(screen.getByText("Page Login")).toBeInTheDocument();
    expect(screen.queryByText("Contenu protégé")).not.toBeInTheDocument();
  });

  it("affiche la page protégée avec un token valide", () => {
    localStorage.setItem("access_token", "valid-token");
    localStorage.setItem("user", JSON.stringify({ email: "john@example.com" }));

    renderWithRoute("/account");

    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
  });
});
