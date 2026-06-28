const Footer = () => {
  return (
    <footer className="bg-white pt-15 pb-5">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">weeb</h3>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">PRODUCT</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  Prix
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Aperçu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Parcourir
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Accessibilité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Cinq
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">SOLUTIONS</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  Brainstorming
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Idéation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Maquettage
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Recherche
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">RESOURCES</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Tutoriels
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  A propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Événements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Carrières
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap mt-15">
          <p className="text-sm flex">
            © 2025 Weeb, Inc. Tous droits réservés.
          </p>
          <div className="flex space-x-4">
          <a href="#" className=" hover:text-purple">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className=" hover:text-purple">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className=" hover:text-purple">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className=" hover:text-purple">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className=" hover:text-purple">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
