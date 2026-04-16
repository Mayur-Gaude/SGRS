const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white w-full p-2 rounded"
    >
      {text}
    </button>
  );
};

export default Button;