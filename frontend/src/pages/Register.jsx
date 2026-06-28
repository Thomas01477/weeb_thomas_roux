import Form from "../components/Form";
import { Link } from "react-router-dom";

const Register = () => {
  const fields = [
    {
      name: "firstName",
      type: "text",
      placeholder: "Prénom",
    },
    {
      name: "lastName",
      type: "text",
      placeholder: "Nom",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Adresse e-mail",
      fullWidth: true,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Mot de passe",
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirmer le mot de passe",
    },
  ];
  

  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center text-white">
      <h2 className="text-4xl font-bold mb-8">S'inscrire</h2>

      <Form fields={fields} buttonLabel="S'inscrire" withBackground={false}/>

      <div className="mt-6 space-y-3 text-sm">
        <p className="text-gray-500">
          Vous avez déjà un compte ? Vous pouvez {" "}
          <Link to="/login" className="underline hover:text-purple-form text-white">
            vous connecter ici
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
