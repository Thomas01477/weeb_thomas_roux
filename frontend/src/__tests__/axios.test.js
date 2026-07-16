import { attachAuthHeader } from "../api/axios";

describe("attachAuthHeader", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("ajoute le header Authorization quand un access token est présent", () => {
    localStorage.setItem("access_token", "abc123");

    const config = attachAuthHeader({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer abc123");
  });

  it("n'ajoute pas de header Authorization en l'absence de token", () => {
    const config = attachAuthHeader({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});
