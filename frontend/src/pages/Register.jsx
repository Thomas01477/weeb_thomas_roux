import { useState } from "react";
import Form from "../components/Form";
import { Link } from "react-router-dom";
import * as Sentry from "@sentry/react";

const API_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}/api/auth/register/`;

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const BACKEND_FIELD_TO_FORM_FIELD = {
  first_name: "firstName",
  last_name: "lastName",
};

const Register = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fields = [
    {
      name: "firstName",
      type: "text",
      placeholder: "Prénom",
    },
    {
      name: "lastName",
      type: "text",
      placeholder: "Nom",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Adresse e-mail",
      fullWidth: true,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Mot de passe",
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirmer le mot de passe",
    },
  ];

  const handleChange = (name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrors({});
    setIsSuccess(false);

    if (values.password !== values.confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.status === 201) {
        setValues(INITIAL_VALUES);
        setIsSuccess(true);
        return;
      }

      if (response.status === 400) {
        const data = await response.json();
        const fieldErrors = {};
        Object.entries(data).forEach(([field, messages]) => {
          const formField = BACKEND_FIELD_TO_FORM_FIELD[field] || field;
          fieldErrors[formField] = Array.isArray(messages)
            ? messages.join(" ")
            : messages;
        });
        setErrors(fieldErrors);
      } else {
        Sentry.captureException(new Error(`Unexpected register response status: ${response.status}`));
        setErrors({ email: "Une erreur est survenue. Veuillez réessayer." });
      }
    } catch (submitError) {
      Sentry.captureException(submitError);
      setErrors({ email: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-8">S'inscrire</h2>

      {isSuccess && (
        <p role="status" className="mb-6 text-green-400">
          Compte créé, en attente de validation par un administrateur.
        </p>
      )}

      <Form
        fields={fields}
        buttonLabel="S'inscrire"
        withBackground={false}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      <div className="mt-6 space-y-3 text-sm">
        <p className="text-gray-500">
          Vous avez déjà un compte ? Vous pouvez {" "}
          <Link to="/login" className="underline hover:text-purple-form text-white">
            vous connecter ici
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
