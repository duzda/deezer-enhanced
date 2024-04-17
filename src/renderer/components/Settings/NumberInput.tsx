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
    <div className="form-control">
      <label htmlFor={id} className="label cursor-pointer">
        <span className="label-text">{text}</span>
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
