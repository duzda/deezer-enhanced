import { useState } from "react";

type HiddenStringInputProps = {
  id: string;
  text: string;
  value: string;
  onChange: (newValue: string) => void;
};

function HiddenStringInput({
  id,
  text,
  value,
  onChange,
}: HiddenStringInputProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="cursor-pointer flex flex-row justify-between items-center gap-2"
      >
        <span className="label">{text}</span>

        <div className="flex items-center gap-2">
          <input
            id={id}
            type={visible ? "text" : "password"}
            className="input input-bordered"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </label>
    </div>
  );
}

export default HiddenStringInput;