type SliderInputProps = {
  id: string;
  text: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (newValue: number) => void;
};

function SliderInput({
  id,
  text,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderInputProps): React.JSX.Element {
  return (
    <div className="flex flex-row justify-between items-center">
      <span className="label">{text}</span>
      <div className="flex flex-row items-center gap-2">
        <input
          id={id}
          type="range"
          className="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            onChange(Number(e.target.value));
          }}
        />
        <span className="label w-8 text-right">{value}</span>
      </div>
    </div>
  );
}

export default SliderInput;
