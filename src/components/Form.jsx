const Form = ({ fields = [], buttonLabel, withBackground = true }) => {
    return (
      <form
        className={`rounded-xl p-8 text-left space-y-6 ${
          withBackground
            ? "bg-[#C084FC1A] border border-purple-text"
            : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, index) => (
            <div
              key={index}
              className={`${field.fullWidth ? "md:col-span-2" : ""}`}
            >
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  rows={field.rows || 2}
                  placeholder={field.placeholder || field.label}
                  className="w-full px-3 py-2 bg-transparent border-b border-purple-text text-purple-text placeholder-purple-text text-center focus:outline-none focus:border-purple-form resize-none"
                ></textarea>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder || field.label}
                  className="w-full px-3 py-2 bg-transparent border-b border-purple-text text-purple-text placeholder-purple-text text-center focus:outline-none focus:border-purple-form"
                />
              )}
            </div>
          ))}
        </div>
  
        <div className="text-center">
          <button
            type="submit"
            className="bg-purple hover:bg-purple-form text-white font-bold py-3 px-8 rounded-lg cursor-pointer"
          >
            {buttonLabel || "Envoyer"}
          </button>
        </div>
      </form>
    );
  };
  
  export default Form;
  