import { useAtomValue } from 'jotai';
import FormLayout from '../components/FormLayout';
import LoginButton from '../components/LoginButton';
import { currentSettingsAtom } from '../states/atoms';

function LoginPage(): React.JSX.Element {
  const { saveArl } = useAtomValue(currentSettingsAtom);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <FormLayout>
        <span className="text-center">
          <b>Deezer</b> uses cryptographic checks during login, which do not
          work in Electron applications.
        </span>

        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-row gap-4 w-full max-w-200">
            <LoginButton loginType="login">Log in</LoginButton>
            <LoginButton loginType="registration">Sign up</LoginButton>
          </div>
          <span className="text-neutral-600 text-center">
            Opened through the default browser.
          </span>
        </div>

        <form
          action={(form) => {
            const cookie = form.get('cookie')!;
            if (saveArl) {
              localStorage.setItem('arl', cookie.toString());
            }
            window.renderer.loginAPI.setArl(cookie.toString());
          }}
        >
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-row w-full max-w-200 items-center join">
              <input
                type="text"
                name="cookie"
                placeholder="Enter the ARL cookie"
                className="input w-full join-item"
                defaultValue={saveArl ? localStorage.getItem('arl') || '' : ''}
              />
              <button type="submit" className="btn btn-secondary join-item">
                Add cookie
              </button>
            </div>
            <span className="text-neutral-600 text-center">
              The cookie is not checked to be correct.
            </span>
          </div>
        </form>
      </FormLayout>
    </main>
  );
}

export default LoginPage;
