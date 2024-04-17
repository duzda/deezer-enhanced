function BackButton(): React.JSX.Element {
  return (
    <button
      type="button"
      aria-label="Back"
      className="btn btn-sm btn-ghost"
      onClick={() => {
        window.renderer.historyAPI.goBack();
      }}
    >
      {/* ICON CREDITS: https://iconscout.com/icon/left-chevron */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 92 92"
        className="fill-primary"
      >
        <path d="M61.8 68.1c1.6 1.5 1.6 4.1.1 5.7-.8.8-1.9 1.2-2.9 1.2s-2-.4-2.8-1.1l-26-25c-.8-.8-1.2-1.8-1.2-2.9s.4-2.1 1.2-2.9l26-25c1.6-1.5 4.1-1.5 5.7.1 1.5 1.6 1.5 4.1-.1 5.7L38.8 46l23 22.1z" />
      </svg>
    </button>
  );
}

export default BackButton;
