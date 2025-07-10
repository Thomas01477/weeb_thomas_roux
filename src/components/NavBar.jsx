import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-[#FFFFFF0D] text-white p-6 max-w-[1000px] mx-auto mt-6 rounded-2xl">
      <div className="flex justify-between items-center">
        {/* Logo + Menu */}
        <div className="flex items-center space-x-6">
            <Link to="/"
            ><h1 className="text-2xl font-bold">weeb</h1></Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-purple-text">
              À propos de nous
            </Link>
            <Link to="/contact" className="hover:text-purple-text">
              Contact
            </Link>
          </div>
        </div>

        {/* Connections Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg hover:text-purple-text"
          >
            Se connecter
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 bg-purple rounded-lg hover:bg-purple-form"
          >
            Inscrivez-vous maintenant
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
