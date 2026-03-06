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
      <p>Cookies</p>
    </button>
  );
}

export default CookieButton;
