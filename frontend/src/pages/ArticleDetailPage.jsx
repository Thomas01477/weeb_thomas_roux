import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Form from "../components/Form";
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const articleUrl = (id) => `/api/articles/${id}/`;

const editFields = [
  { name: "title", label: "Titre" },
  { name: "content", label: "Contenu", type: "textarea", rows: 8, fullWidth: true },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ title: "", content: "" });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError("");

    apiClient
      .get(articleUrl(id))
      .then((response) => {
        if (!isMounted) return;
        setArticle(response.data);
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        if (fetchError.response?.status === 404) {
          setError("Cet article n'existe pas ou a été supprimé.");
        } else {
          Sentry.captureException(fetchError);
          setError("Impossible de charger cet article pour le moment.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isAuthor = Boolean(user && article && article.owner === user.id);

  const startEdit = () => {
    setIsConfirmingDelete(false);
    setEditErrors({});
    setEditValues({ title: article.title, content: article.content });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditErrors({});
  };

  const handleEditChange = (name, value) => {
    setEditValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleEditSubmit = async () => {
    setEditErrors({});
    setIsSaving(true);

    try {
      const response = await apiClient.patch(articleUrl(id), editValues);
      setArticle(response.data);
      setIsEditing(false);
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

  const askDeleteConfirmation = () => {
    setIsEditing(false);
    setIsConfirmingDelete(true);
  };

  const cancelDelete = () => setIsConfirmingDelete(false);

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      await apiClient.delete(articleUrl(id));
      navigate("/blog");
    } catch (deleteError) {
      Sentry.captureException(deleteError);
      setError("Impossible de supprimer cet article pour le moment.");
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 text-white min-h-screen py-16">
      <Link to="/blog" className="inline-block mb-10 text-purple-text hover:underline">
        ← Retour au blog
      </Link>

      {isLoading && (
        <p role="status" className="text-center text-gray-300">
          Chargement de l'article...
        </p>
      )}

      {!isLoading && error && (
        <p role="alert" className="text-center text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && article && !isEditing && (
        <article>
          {article.category_name && (
            <span className="inline-block mb-4 px-3 py-1 text-xs rounded-full bg-purple text-white">
              {article.category_name}
            </span>
          )}
          <h1 className="text-4xl font-extrabold mb-4">{article.title}</h1>
          <p className="text-sm text-gray-400 mb-8">
            Par {article.author} · {formatDate(article.created_at)}
          </p>
          <p className="text-gray-300 whitespace-pre-line">{article.content}</p>

          {isAuthor && !isConfirmingDelete && (
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={startEdit}
                className="px-4 py-2 rounded-lg hover:text-purple-text cursor-pointer"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={askDeleteConfirmation}
                className="px-4 py-2 rounded-lg hover:text-purple-text cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          )}

          {isConfirmingDelete && (
            <div className="space-y-3 mt-8">
              <p role="alert" className="text-red-400">
                Êtes-vous sûr de vouloir supprimer cet article ?
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
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
          )}
        </article>
      )}

      {!isLoading && !error && article && isEditing && (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default ArticleDetailPage;
