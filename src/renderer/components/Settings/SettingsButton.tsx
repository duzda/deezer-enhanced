import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { viewExpandedAtom } from '../../states/atoms';

function SettingsButton(): React.JSX.Element {
  const navigate = useNavigate();
  const [svgClass, setSvgClass] = useState('fill-secondary');
  const [viewExpanded, setViewExpanded] = useAtom(viewExpandedAtom);

  useEffect(() => {
    setSvgClass(viewExpanded ? 'fill-secondary' : 'fill-primary');
  }, [viewExpanded]);

  return (
    <button
      type="button"
      aria-label="Settings"
      className="btn btn-sm btn-ghost btn-circle"
      onClick={() => {
        if (viewExpanded) {
          window.renderer.settingsAPI.hideSettings();
          navigate('/');
        } else {
          window.renderer.settingsAPI.showSettings();
          navigate('/settings');
        }

        setViewExpanded(!viewExpanded);
      }}
    >
      {/* ICON CREDITS: https://icons8.com/icon/90568/support */}
      <svg
        focusable="false"
        height="18"
        width="18"
        viewBox="0 0 24 24"
        className={svgClass}
      >
        <path d="M20.869,7.795l-0.392-1.872L17.569,9H15V6.43l3.078-2.922l-1.877-0.386C15.809,3.041,15.404,3,15,3 c-3.309,0-6,2.717-6,6.056c0,0.42,0.051,0.845,0.153,1.285l-6.214,6.103c-1.252,1.269-1.252,3.332,0.001,4.601 C3.55,21.66,4.363,22,5.231,22c0.867,0,1.681-0.34,2.28-0.946l6.229-6.12C14.169,15,14.587,15,15,15c3.364,0,6-2.611,6-5.944 C21,8.634,20.956,8.209,20.869,7.795z">
          {' '}
        </path>
      </svg>
    </button>
  );
}

export default SettingsButton;
