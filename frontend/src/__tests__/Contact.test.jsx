import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "../pages/Contact";
import apiClient from "../api/axios";

vi.mock("../api/axios", () => ({
  default: { post: vi.fn() },
}));

const fillValidForm = async (user) => {
  await user.type(screen.getByLabelText("Nom"), "Doe");
  await user.type(screen.getByLabelText("Prénom"), "John");
  await user.type(screen.getByLabelText("Sujet"), "Une question");
  await user.type(screen.getByLabelText("Email"), "john.doe@example.com");
  await user.type(screen.getByLabelText("Message"), "Bonjour, ceci est un message.");
};

describe("Contact", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche un message de succès après une soumission valide", async () => {
    const user = userEvent.setup();
    apiClient.post.mockResolvedValue({ data: { id: 1 } });

    render(<Contact />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /contact/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Votre message a bien été envoyé"
      );
    });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/contact/",
      expect.objectContaining({ email: "john.doe@example.com" })
    );
  });

  it("affiche un message d'erreur si l'email est manquant", async () => {
    const user = userEvent.setup();
    apiClient.post.mockRejectedValue({
      response: { status: 400, data: { email: ["This field is required."] } },
    });

    render(<Contact />);
    await user.type(screen.getByLabelText("Nom"), "Doe");
    await user.type(screen.getByLabelText("Prénom"), "John");
    await user.type(screen.getByLabelText("Message"), "Bonjour !");
    await user.click(screen.getByRole("button", { name: /contact/i }));

    await waitFor(() => {
      expect(screen.getByText("This field is required.")).toBeInTheDocument();
    });
  });
});
