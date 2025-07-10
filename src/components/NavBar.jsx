import { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#FFFFFF0D] text-white p-6 max-w-[1000px] mx-auto mt-6 rounded-2xl">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold">weeb</h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-text">À propos de nous</Link>
          <Link to="/contact" className="hover:text-purple-text">Contact</Link>
          <Link to="/login" className="px-4 py-2 rounded-lg hover:text-purple-text">Se connecter</Link>
          <Link to="/login" className="px-4 py-2 bg-purple rounded-lg hover:bg-purple-form">Inscrivez-vous maintenant</Link>
        </div>

        {/* Burger Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col mt-4 space-y-3 md:hidden">
          <Link to="/" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>À propos de nous</Link>
          <Link to="/contact" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/login" className="hover:text-purple-text" onClick={() => setIsOpen(false)}>Se connecter</Link>
          <Link to="/login" className="bg-purple px-4 py-2 rounded-lg hover:bg-purple-form text-center" onClick={() => setIsOpen(false)}>
            Inscrivez-vous maintenant
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
