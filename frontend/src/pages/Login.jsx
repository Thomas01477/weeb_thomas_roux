import Form from "../components/Form";
import { Link } from "react-router-dom";

const Login = () => {
  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Adresse e-mail",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Mot de passe",
    },
  ];

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-8">Se connecter</h2>

      <Form fields={fields} buttonLabel="Connexion" withBackground={false}/>

      <div className="mt-6 space-y-3 text-sm text-white">
        <p className="hover:underline cursor-pointer">Mot de passe oublié ?</p>
        <p className="text-gray-500">
          Vous n’avez pas de compte ? Vous pouvez {" "}
          <Link to="/register" className="underline hover:text-purple-form text-white">
            en créer un
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
