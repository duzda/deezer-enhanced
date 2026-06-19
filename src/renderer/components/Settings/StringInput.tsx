type StringInputProps = {
  id: string;
  text: string;
  value: string;
  onChange: (newValue: string) => void;
};

function StringInput({
  id,
  text,
  value,
  onChange,
}: StringInputProps): React.JSX.Element {
  return (
    <div>
      <label
        htmlFor={id}
        className="cursor-pointer flex flex-row justify-between"
      >
        <span className="label">{text}</span>
        <input
          id={id}
          type="text"
          className="input input-bordered"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </label>
    </div>
  );
}

export default StringInput;
