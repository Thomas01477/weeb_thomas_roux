const variantClasses = {
  primary: "bg-purple hover:bg-purple-form text-white font-bold py-3 px-8 rounded-lg cursor-pointer",
  outline: "border border-white text-white hover:bg-purple-form font-bold py-3 px-8 rounded-lg cursor-pointer",
};

const Button = ({ children, variant = "primary", type = "button", onClick, disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
