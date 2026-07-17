import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import apiClient from "../api/axios";

const articleUrl = (id) => `/api/articles/${id}/`;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

      {!isLoading && !error && article && (
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
        </article>
      )}
    </div>
  );
};

export default ArticleDetailPage;
