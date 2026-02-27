import { LoginType } from '../../common/types/login';

type LoginButtonProps = {
  loginType: LoginType;
  children: React.ReactNode;
};

function LoginButton({
  loginType,
  children,
}: LoginButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className="btn btn-secondary grow"
      onClick={() => {
        window.renderer.loginAPI.openLogin(loginType);
      }}
    >
      {children}
    </button>
  );
}

export default LoginButton;
