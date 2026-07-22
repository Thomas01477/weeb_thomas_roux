import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ADMIN_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}/admin/`;

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-[#FFFFFF0D] text-white p-6 max-w-[1000px] mx-auto md:mt-6 rounded-2xl">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-3xl font-bold">weeb</h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex justify-between items-center w-full ml-8">
          <div className="flex items-center space-x-4">
            <Link to="/about" className="whitespace-nowrap hover:text-purple-text">À propos de nous</Link>
            <Link to="/blog" className="whitespace-nowrap hover:text-purple-text">Blog</Link>
            <Link to="/contact" className="whitespace-nowrap hover:text-purple-text">Contact</Link>
            {isAuthenticated && (
              <Link to="/add-article" className="whitespace-nowrap hover:text-purple-text">Ajouter un article</Link>
            )}
            {isAuthenticated && user?.is_staff && (
              <a href={ADMIN_URL} className="whitespace-nowrap hover:text-purple-text">Admin</a>
            )}
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            {isAuthenticated ? (
              <>
                <Link to="/account" className="whitespace-nowrap px-4 py-2 rounded-lg hover:text-purple-text">Mon compte</Link>
                <button onClick={handleLogout} className="whitespace-nowrap px-4 py-2 bg-purple rounded-lg hover:bg-purple-form cursor-pointer">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="whitespace-nowrap px-4 py-2 rounded-lg hover:text-purple-text">Connexion</Link>
                <Link to="/register" className="whitespace-nowrap px-4 py-2 bg-purple rounded-lg hover:bg-purple-form">S'inscrire</Link>
              </>
            )}
          </div>
        </div>

        {/* Burger Menu Button */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="p-1 rounded bg-purple">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col mt-4 space-y-3 lg:hidden">
          <Link to="/about" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>À propos de nous</Link>
          <Link to="/blog" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link to="/contact" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Contact</Link>
          {isAuthenticated && (
            <Link to="/add-article" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Ajouter un article</Link>
          )}
          {isAuthenticated && user?.is_staff && (
            <a href={ADMIN_URL} className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Admin</a>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/account" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Mon compte</Link>
              <button
                onClick={handleLogout}
                className="bg-purple px-4 py-2 rounded-lg hover:bg-purple-form text-center cursor-pointer"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Connexion</Link>
              <Link to="/register" className="bg-purple px-4 py-2 rounded-lg hover:bg-purple-form text-center" onClick={() => setIsOpen(false)}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
