import { useState } from "react";
import Form from "../components/Form";

const API_URL = "http://localhost:8000/api/contact/";

const INITIAL_VALUES = {
  lastName: "",
  firstName: "",
  subject: "",
  email: "",
  message: "",
};

// Champs backend qui ne correspondent pas directement à un champ du formulaire
const BACKEND_FIELD_TO_FORM_FIELD = {
  name: "firstName",
};

const Contact = () => {
  const contactFields = [
    { name: "lastName", label: "Nom" },
    { name: "firstName", label: "Prénom" },
    { name: "subject", label: "Sujet", fullWidth: false },
    { name: "email", label: "Email", type: "email", fullWidth: false },
    { name: "message", label: "Message", type: "textarea", fullWidth: true },
  ];

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async () => {
    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          message: values.message,
        }),
      });

      if (response.status === 201) {
        setValues(INITIAL_VALUES);
        setStatus("success");
        return;
      }

      if (response.status === 400) {
        const data = await response.json();
        const fieldErrors = {};
        Object.entries(data).forEach(([field, messages]) => {
          const formField = BACKEND_FIELD_TO_FORM_FIELD[field] || field;
          fieldErrors[formField] = Array.isArray(messages)
            ? messages.join(" ")
            : messages;
        });
        setErrors(fieldErrors);
        setStatus("error");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="text-white py-16 px-4 max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-4">Votre avis compte !</h2>
      <p className="text-gray-300 mb-10 max-w-2xl mx-auto">Votre retour est essentiel pour nous améliorer ! Partagez votre expérience, dites-nous ce que vous aimez et ce que nous pourrions améliorer. Vos suggestions nous aident à faire de ce blog une ressource toujours plus utile et enrichissante.</p>

      {status === "success" && (
        <p role="status" className="mb-6 text-green-400">
          Votre message a bien été envoyé. Merci pour votre retour !
        </p>
      )}
      {status === "error" && Object.keys(errors).length === 0 && (
        <p role="alert" className="mb-6 text-red-400">
          Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.
        </p>
      )}

      <Form
        fields={contactFields}
        buttonLabel="Contact"
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        errors={errors}
        isSubmitting={status === "submitting"}
      />
    </div>
  );
};

export default Contact;
