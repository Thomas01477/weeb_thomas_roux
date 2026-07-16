import { useState } from "react";
import Form from "../components/Form";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const LOGIN_URL = "/api/auth/login/";

const INITIAL_VALUES = { email: "", password: "" };

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Adresse e-mail",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Mot de passe",
    },
  ];

  const handleChange = (name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiClient.post(LOGIN_URL, values);
      login(response.data);
      navigate("/blog");
    } catch (submitError) {
      const responseStatus = submitError.response?.status;
      if (responseStatus === 403) {
        setError("Votre compte n'a pas encore été validé par un administrateur.");
      } else if (responseStatus === 401) {
        setError("Adresse e-mail ou mot de passe incorrect.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-8">Se connecter</h2>

      {error && (
        <p role="alert" className="mb-6 text-red-400">
          {error}
        </p>
      )}

      <Form
        fields={fields}
        buttonLabel="Connexion"
        withBackground={false}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="mt-6 space-y-3 text-sm text-white">
        <p className="hover:underline cursor-pointer">Mot de passe oublié ?</p>
        <p className="text-gray-500">
          Vous n’avez pas de compte ? Vous pouvez {" "}
          <Link to="/register" className="underline hover:text-purple-form text-white">
            en créer un
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
