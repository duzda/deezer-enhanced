import { useAtom } from 'jotai';
import { useNavigate } from 'react-router';
import { viewExpandedAtom } from '../../states/atoms';

function CookieButton(): React.JSX.Element {
  const navigate = useNavigate();
  const [viewExpanded, setViewExpanded] = useAtom(viewExpandedAtom);
  return (
    <button
      type="button"
      aria-label="Cookies"
      className="btn btn-sm btn-ghost btn-circle"
      onClick={() => {
        if (viewExpanded) {
          // it doesn't hide settings, it just shows the main view
          window.renderer.settingsAPI.hideSettings();
          navigate('/');
        } else {
          // it doesn't show settings, it just hides the main view
          window.renderer.settingsAPI.showSettings();
          navigate('/cookies_setup');
        }

        setViewExpanded(!viewExpanded);
      }}
    >
      {/* The icon doesn't display for some reason. There will be text for now. */}
      <p>Cookies</p>
      {/* ICON CREDITS: https://fonts.google.com/icons?selected=Material+Symbols+Outlined:cookie:FILL */}
      {/* <svg
        focusable="false"
        height="18"
        width="18"
        viewBox="0 0 24 24"
        className={svgClass}
      >
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-75 29-147t81-128.5q52-56.5 125-91T475-881q21 0 43 2t45 7q-9 45 6 85t45 66.5q30 26.5 71.5 36.5t85.5-5q-26 59 7.5 113t99.5 56q1 11 1.5 20.5t.5 20.5q0 82-31.5 154.5t-85.5 127q-54 54.5-127 86T480-80Zm-60-480q25 0 42.5-17.5T480-620q0-25-17.5-42.5T420-680q-25 0-42.5 17.5T360-620q0 25 17.5 42.5T420-560Zm-80 200q25 0 42.5-17.5T400-420q0-25-17.5-42.5T340-480q-25 0-42.5 17.5T280-420q0 25 17.5 42.5T340-360Zm260 40q17 0 28.5-11.5T640-360q0-17-11.5-28.5T600-400q-17 0-28.5 11.5T560-360q0 17 11.5 28.5T600-320ZM480-160q122 0 216.5-84T800-458q-50-22-78.5-60T683-603q-77-11-132-66t-68-132q-80-2-140.5 29t-101 79.5Q201-644 180.5-587T160-480q0 133 93.5 226.5T480-160Zm0-324Z">
          {' '}
        </path>
      </svg> */}
    </button>
  );
}

export default CookieButton;
