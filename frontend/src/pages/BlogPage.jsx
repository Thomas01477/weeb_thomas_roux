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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    apiClient
      .get(ARTICLES_URL, { params: { search: search || undefined, page } })
      .then((response) => {
        if (!isMounted) return;
        setArticles(response.data.results);
        setCount(response.data.count);
        setHasNext(Boolean(response.data.next));
        setHasPrevious(Boolean(response.data.previous));
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        Sentry.captureException(fetchError);
        setError("Impossible de charger les articles pour le moment.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, page]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 text-white min-h-screen py-16">
      <h1 className="text-5xl font-extrabold mb-10 text-center">
        Le <span className="text-purple-text">Blog</span>
      </h1>

      <div className="max-w-md mx-auto mb-10">
        <label htmlFor="blog-search" className="sr-only">
          Rechercher un article
        </label>
        <input
          id="blog-search"
          type="search"
          placeholder="Rechercher un article..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 rounded-lg bg-[#FFFFFF0D] border border-purple-text text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-text"
        />
      </div>

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
          {search
            ? "Aucun article ne correspond à votre recherche."
            : "Aucun article pour le moment."}
        </p>
      )}

      {!isLoading && !error && articles.length > 0 && (
        <>
          <p className="text-center text-sm text-gray-400 mb-6">
            {count} article{count > 1 ? "s" : ""} trouvé{count > 1 ? "s" : ""}
          </p>

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

          {(hasNext || hasPrevious) && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                type="button"
                disabled={!hasPrevious}
                onClick={() => setPage((previousPage) => previousPage - 1)}
                className="px-4 py-2 rounded-lg hover:text-purple-text disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Précédent
              </button>
              <span className="text-gray-400">Page {page}</span>
              <button
                type="button"
                disabled={!hasNext}
                onClick={() => setPage((previousPage) => previousPage + 1)}
                className="px-4 py-2 rounded-lg hover:text-purple-text disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPage;
