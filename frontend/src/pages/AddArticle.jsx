import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Form from "../components/Form";
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const ARTICLES_URL = "/api/articles/";
const CATEGORIES_URL = "/api/categories/";

const INITIAL_VALUES = { title: "", content: "", category: "" };

const AddArticle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiClient
      .get(CATEGORIES_URL)
      .then((response) => setCategories(response.data))
      .catch((fetchError) => Sentry.captureException(fetchError));
  }, []);

  const fields = [
    { name: "title", label: "Titre" },
    { name: "content", label: "Contenu", type: "textarea", rows: 8, fullWidth: true },
    {
      name: "category",
      label: "Catégorie",
      type: "select",
      fullWidth: true,
      options: [
        { value: "", label: "Aucune catégorie" },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
      ],
    },
  ];

  const handleChange = (name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrors({});
    setGeneralError("");
    setIsSubmitting(true);

    // Author is a plain text field on the article, not a live reference to
    // the user, so it's derived once here: full name, falling back to email
    // then a generic label if the profile has neither.
    const author = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || user?.email || "Membre";
    const { category, ...rest } = values;
    const payload = { ...rest, author, ...(category ? { category } : {}) };

    try {
      await apiClient.post(ARTICLES_URL, payload);
      navigate("/blog");
    } catch (submitError) {
      const responseStatus = submitError.response?.status;
      if (responseStatus === 400) {
        const fieldErrors = {};
        Object.entries(submitError.response.data).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages.join(" ") : messages;
        });
        setErrors(fieldErrors);
      } else if (responseStatus === 401) {
        setGeneralError("Vous devez être connecté pour publier un article.");
      } else if (responseStatus === 403) {
        setGeneralError("Vous n'avez pas les droits pour publier un article.");
      } else {
        Sentry.captureException(submitError);
        setGeneralError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-8">Ajouter un article</h2>

      {generalError && (
        <p role="alert" className="mb-6 text-red-400">
          {generalError}
        </p>
      )}

      <Form
        fields={fields}
        buttonLabel="Publier"
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddArticle;
