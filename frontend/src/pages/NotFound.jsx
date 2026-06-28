import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-color-background text-white">
      <h1 className="text-6xl font-bold text-color-purple">404</h1>
      <p className="text-2xl mt-4">Page non trouvée</p>
      <Link to="/" className="mt-8 px-6 py-3 bg-color-purple rounded-lg hover:bg-color-purple-form">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;
