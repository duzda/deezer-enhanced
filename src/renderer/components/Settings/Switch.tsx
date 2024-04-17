type SwitchProps = {
  id: string;
  text: string;
  state: boolean;
  onChange: (newValue: boolean) => void;
};

function Switch({ id, text, state, onChange }: SwitchProps): React.JSX.Element {
  return (
    <div className="form-control">
      <label htmlFor={id} className="label cursor-pointer">
        <span className="label-text">{text}</span>
        <input
          id={id}
          type="checkbox"
          className="toggle toggle-secondary"
          checked={state}
          onChange={() => {
            onChange(!state);
          }}
        />
      </label>
    </div>
  );
}

export default Switch;
