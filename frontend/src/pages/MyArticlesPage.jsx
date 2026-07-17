import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import Form from "../components/Form";
import apiClient from "../api/axios";

const MY_ARTICLES_URL = "/api/articles/mine/";
const articleUrl = (id) => `/api/articles/${id}/`;

const editFields = [
  { name: "title", label: "Titre" },
  { name: "content", label: "Contenu", type: "textarea", rows: 6, fullWidth: true },
];

const MyArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", content: "" });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    apiClient
      .get(MY_ARTICLES_URL)
      .then((response) => setArticles(response.data))
      .catch((fetchError) => {
        Sentry.captureException(fetchError);
        setError("Impossible de charger vos articles pour le moment.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const startEdit = (article) => {
    setConfirmingDeleteId(null);
    setEditErrors({});
    setEditingId(article.id);
    setEditValues({ title: article.title, content: article.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditErrors({});
  };

  const handleEditChange = (name, value) => {
    setEditValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleEditSubmit = async () => {
    setEditErrors({});
    setIsSaving(true);

    try {
      const response = await apiClient.patch(articleUrl(editingId), editValues);
      setArticles((previous) =>
        previous.map((article) => (article.id === editingId ? response.data : article))
      );
      setEditingId(null);
    } catch (submitError) {
      const responseStatus = submitError.response?.status;
      if (responseStatus === 400) {
        const fieldErrors = {};
        Object.entries(submitError.response.data).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages.join(" ") : messages;
        });
        setEditErrors(fieldErrors);
      } else {
        Sentry.captureException(submitError);
        setEditErrors({ title: "Une erreur est survenue. Veuillez réessayer." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const askDeleteConfirmation = (articleId) => {
    setEditingId(null);
    setConfirmingDeleteId(articleId);
  };

  const cancelDelete = () => setConfirmingDeleteId(null);

  const confirmDelete = async (articleId) => {
    setIsDeleting(true);

    try {
      await apiClient.delete(articleUrl(articleId));
      setArticles((previous) => previous.filter((article) => article.id !== articleId));
      setConfirmingDeleteId(null);
    } catch (deleteError) {
      Sentry.captureException(deleteError);
      setError("Impossible de supprimer cet article pour le moment.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 text-white min-h-screen py-16">
      <h1 className="text-5xl font-extrabold mb-10 text-center">
        Mes <span className="text-purple-text">articles</span>
      </h1>

      {isLoading && (
        <p role="status" className="text-center text-gray-300">
          Chargement de vos articles...
        </p>
      )}

      {!isLoading && error && (
        <p role="alert" className="text-center text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <p className="text-center text-gray-300">Vous n'avez pas encore publié d'article.</p>
      )}

      {!isLoading && articles.length > 0 && (
        <div className="space-y-6">
          {articles.map((article) => (
            <article key={article.id} className="bg-[#FFFFFF0D] rounded-2xl p-6">
              {editingId === article.id ? (
                <>
                  <Form
                    fields={editFields}
                    buttonLabel="Enregistrer"
                    values={editValues}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    errors={editErrors}
                    isSubmitting={isSaving}
                  />
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="mt-4 text-sm text-gray-300 hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                  <p className="text-gray-300 mb-4">{article.content}</p>

                  {confirmingDeleteId === article.id ? (
                    <div className="space-y-3">
                      <p role="alert" className="text-red-400">
                        Êtes-vous sûr de vouloir supprimer cet article ?
                      </p>
                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => confirmDelete(article.id)}
                          className="px-4 py-2 bg-purple rounded-lg hover:bg-purple-form cursor-pointer disabled:opacity-50"
                        >
                          Oui, supprimer
                        </button>
                        <button
                          type="button"
                          onClick={cancelDelete}
                          className="px-4 py-2 rounded-lg hover:text-purple-text cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 justify-center">
                      <button
                        type="button"
                        onClick={() => startEdit(article)}
                        className="px-4 py-2 rounded-lg hover:text-purple-text cursor-pointer"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => askDeleteConfirmation(article.id)}
                        className="px-4 py-2 rounded-lg hover:text-purple-text cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArticlesPage;
