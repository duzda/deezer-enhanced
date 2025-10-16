import { useNavigate } from 'react-router';
import BackButton from './History/BackButton';

function LogNavigation(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <nav className="navbar justify-end min-h-12">
      <div>
        <BackButton
          onClick={() => {
            navigate('/settings');
          }}
        />
      </div>
    </nav>
  );
}

export default LogNavigation;
