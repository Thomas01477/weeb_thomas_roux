import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import Form from "../components/Form";
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const PROFILE_URL = "/api/auth/profile/";

const BACKEND_FIELD_TO_FORM_FIELD = {
  first_name: "firstName",
  last_name: "lastName",
};

const toFormValues = (profile) => ({
  firstName: profile?.first_name ?? "",
  lastName: profile?.last_name ?? "",
  email: profile?.email ?? "",
});

const Account = () => {
  const { updateUser } = useAuth();
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    apiClient
      .get(PROFILE_URL)
      .then((response) => {
        if (!isMounted) return;
        setValues(toFormValues(response.data));
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        Sentry.captureException(fetchError);
        setLoadError("Impossible de charger votre profil. Veuillez réessayer.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
  ];

  const handleChange = (name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrors({});
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await apiClient.patch(PROFILE_URL, {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
      });
      setValues(toFormValues(response.data));
      updateUser(response.data);
      setIsSuccess(true);
    } catch (submitError) {
      const responseStatus = submitError.response?.status;
      if (responseStatus === 400) {
        const data = submitError.response.data;
        const fieldErrors = {};
        Object.entries(data).forEach(([field, messages]) => {
          const formField = BACKEND_FIELD_TO_FORM_FIELD[field] || field;
          fieldErrors[formField] = Array.isArray(messages) ? messages.join(" ") : messages;
        });
        setErrors(fieldErrors);
      } else {
        Sentry.captureException(submitError);
        setErrors({ email: "Une erreur est survenue. Veuillez réessayer." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-8">Mon compte</h2>

      {isLoading && <p className="text-gray-300">Chargement de votre profil...</p>}

      {loadError && (
        <p role="alert" className="mb-6 text-red-400">
          {loadError}
        </p>
      )}

      {isSuccess && (
        <p role="status" className="mb-6 text-green-400">
          Profil mis à jour avec succès.
        </p>
      )}

      {!isLoading && !loadError && (
        <Form
          fields={fields}
          buttonLabel="Enregistrer"
          withBackground={false}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Account;
