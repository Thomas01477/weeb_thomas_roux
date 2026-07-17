import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import apiClient from "../api/axios";

const ARTICLES_URL = "/api/articles/";
const EXCERPT_LENGTH = 100;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getExcerpt = (content) => {
  if (content.length <= EXCERPT_LENGTH) return content;
  return `${content.slice(0, EXCERPT_LENGTH)}...`;
};

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiClient.get(ARTICLES_URL);
        setArticles(response.data);
      } catch (fetchError) {
        Sentry.captureException(fetchError);
        setError("Impossible de charger les articles pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto px-6 text-white min-h-screen py-16">
      <h1 className="text-5xl font-extrabold mb-10 text-center">
        Le <span className="text-purple-text">Blog</span>
      </h1>

      {isLoading && (
        <p role="status" className="text-center text-gray-300">
          Chargement des articles...
        </p>
      )}

      {!isLoading && error && (
        <p role="alert" className="text-center text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <p className="text-center text-gray-300">
          Aucun article pour le moment.
        </p>
      )}

      {!isLoading && !error && articles.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-[#FFFFFF0D] rounded-2xl p-6 flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-400 mb-4">
                {article.author} — {formatDate(article.created_at)}
              </p>
              <p className="text-gray-300">{getExcerpt(article.content)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
