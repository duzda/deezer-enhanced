type NumberInputProps = {
  id: string;
  text: string;
  value: string;
  onChange: (newValue: number) => void;
};

function NumberInput({
  id,
  text,
  value,
  onChange,
}: NumberInputProps): React.JSX.Element {
  return (
    <div>
      <label
        htmlFor={id}
        className="cursor-pointer flex flex-row justify-between"
      >
        <span className="label">{text}</span>
        <input
          id={id}
          type="number"
          className="input input-bordered"
          value={value}
          onChange={(e) => {
            onChange(
              Number.isNaN(e.target.value) || e.target.value.length === 0
                ? 0
                : parseInt(e.target.value, 10)
            );
          }}
        />
      </label>
    </div>
  );
}

export default NumberInput;
