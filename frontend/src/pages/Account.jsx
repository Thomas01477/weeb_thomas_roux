import { useAuth } from "../hooks/useAuth";

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-8">Mon compte</h2>
      <p className="text-gray-300">
        Connecté en tant que <span className="text-purple-text">{user?.email}</span>
      </p>
    </div>
  );
};

export default Account;
