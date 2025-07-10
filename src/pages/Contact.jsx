import { Link } from 'react-router-dom';
const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-color-background text-white">
      <h1 className="text-4xl font-bold">Page Contact</h1>
      <p className="mt-4">Cette page sera développée plus tard.</p>
      <Link to="/" className="mt-8 px-6 py-3 bg-color-purple rounded-lg hover:bg-color-purple-form">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default Contact;