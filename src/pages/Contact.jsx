import Form from "../components/Form";

const Contact = () => {
  const contactFields = [
    { name: "lastName", label: "Nom" },
    { name: "firstName", label: "Prénom" },
    { name: "subject", label: "Sujet", fullWidth: false },
    { name: "email", label: "Email", type: "email", fullWidth: false },
    { name: "message", label: "Message", type: "textarea", fullWidth: true },
  ];

  return (
    <div className="text-white py-16 px-4 max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-4">Votre avis compte !</h2>
      <p className="text-gray-300 mb-10 max-w-2xl mx-auto">Votre retour est essentiel pour nous améliorer ! Partagez votre expérience, dites-nous ce que vous aimez et ce que nous pourrions améliorer. Vos suggestions nous aident à faire de ce blog une ressource toujours plus utile et enrichissante.</p>
    <Form
      fields={contactFields}
      buttonLabel="Contact"
      />
    </div>
  );
};

export default Contact;
