import { useRecoilValue } from 'recoil';
import { currentSettingsAtom } from '../../states/atoms';

function DownloadButton(): React.JSX.Element | null {
  const currentSettings = useRecoilValue(currentSettingsAtom);

  if (!currentSettings.deemixIntegration) return null;

  return (
    <button
      type="button"
      className="btn btn-sm btn-ghost btn-circle"
      aria-label="Download"
      onClick={() => {
        window.renderer.downloadsAPI.download();
      }}
    >
      {/* ICON CREDITS: https://icons8.com/icon/82805/bookmark */}
      <svg
        focusable="false"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="fill-primary"
      >
        <path d="M 6 2 C 5.861875 2 5.7278809 2.0143848 5.5976562 2.0410156 C 4.686084 2.2274316 4 3.033125 4 4 L 4 22 L 12 19 L 20 22 L 20 4 C 20 3.8625 19.985742 3.7275391 19.958984 3.5976562 C 19.799199 2.8163086 19.183691 2.2008008 18.402344 2.0410156 C 18.272119 2.0143848 18.138125 2 18 2 L 6 2 z" />
      </svg>
    </button>
  );
}

export default DownloadButton;
