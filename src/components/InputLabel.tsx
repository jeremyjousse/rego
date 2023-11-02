const InputLabel = ({ text, htmlFor }: { text: string; htmlFor: string }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="mr-2 text-sm font-bold w-20 inline-block text-right"
    >
      {text}:
    </label>
  );
};

export default InputLabel;
