import Button from "./Button";

const Form = ({
  fields = [],
  buttonLabel,
  withBackground = true,
  values,
  onChange,
  onSubmit,
  errors = {},
  isSubmitting = false,
}) => {
    const isControlled = Boolean(onChange);

    return (
      <form
        className={`rounded-xl p-8 text-left space-y-6 ${
          withBackground
            ? "bg-[#C084FC1A] border border-purple-text"
            : ""
        }`}
        onSubmit={
          onSubmit
            ? (event) => {
                event.preventDefault();
                onSubmit(event);
              }
            : undefined
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, index) => (
            <div
              key={index}
              className={`${field.fullWidth ? "md:col-span-2" : ""}`}
            >
              <label
                htmlFor={field.name}
                className="block text-sm text-purple-text mb-1 text-left"
              >
                {field.label || field.placeholder}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={field.rows || 2}
                  placeholder={field.placeholder || field.label}
                  className="w-full px-3 py-2 bg-transparent border-b border-purple-text text-purple-text placeholder-purple-text text-center focus:outline-none focus:border-purple-form resize-none"
                  {...(isControlled
                    ? {
                        value: values?.[field.name] ?? "",
                        onChange: (event) =>
                          onChange(field.name, event.target.value),
                      }
                    : {})}
                ></textarea>
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  className="w-full px-3 py-2 bg-transparent border-b border-purple-text text-purple-text text-center focus:outline-none focus:border-purple-form"
                  {...(isControlled
                    ? {
                        value: values?.[field.name] ?? "",
                        onChange: (event) =>
                          onChange(field.name, event.target.value),
                      }
                    : {})}
                >
                  {(field.options || []).map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-black"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder || field.label}
                  className="w-full px-3 py-2 bg-transparent border-b border-purple-text text-purple-text placeholder-purple-text text-center focus:outline-none focus:border-purple-form"
                  {...(isControlled
                    ? {
                        value: values?.[field.name] ?? "",
                        onChange: (event) =>
                          onChange(field.name, event.target.value),
                      }
                    : {})}
                />
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-400 text-left">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : buttonLabel || "Envoyer"}
          </Button>
        </div>
      </form>
    );
  };

  export default Form;
