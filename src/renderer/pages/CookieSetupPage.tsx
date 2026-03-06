import React, { useEffect, useState } from 'react';
import { SUPPORTED_BROWSERS } from '../../main/utils/login';

function CookieSetupPage(): React.JSX.Element {
  const [cookiesExist, setCookiesExist] = useState(false);
  const [extractionError, setExtractionError] = useState('');

  useEffect(() => {
    const findCookies = async () => {
      setCookiesExist(await window.renderer.loginAPI.getLoginStatus());
    };

    // noinspection JSIgnoredPromiseFromCall
    findCookies();
  }, [setCookiesExist]);

  return (
    <main>
      <div className="flex flex-row">
        <div className="min-w-96 w-4/5 mx-auto my-8 flex flex-col gap-8 bg-base-200 p-8 rounded-md border-2 border-neutral">
          <p>
            Deezer utilizes complicated cryptographic checks during login, which
            won&#39;t work in Electron application and even some browsers.
          </p>
          <p>This application provides two ways for you to log in:</p>
          <ol>
            <li>
              1. Try to extract cookies from your browser automatically. You
              should be logged in Deezer in one of the supported browsers.
            </li>
            <li>2. Paste cookies manually.</li>
          </ol>
          <p>
            Alternatively, you can try to log in normally. Most likely it will
            cause an infinite cycle of cryptographic checks.
          </p>
          <p>
            {/* don't look at me for this horror - prettier told me to do so */}
            Current cookie status:{' '}
            {cookiesExist ? (
              <span className="text-success">available</span>
            ) : (
              <span className="text-error">not available</span>
            )}
          </p>
          {/* the forms */}
          {!cookiesExist && (
            <>
              <form
                action={(form) => {
                  const arl: string = form.get('cookie')!.toString();

                  // TODO: verification logic
                  if (arl.length === 0) {
                    return;
                  }

                  window.renderer.loginAPI.setLoginCookie(arl);
                  setCookiesExist(true);
                }}
              >
                <div className="flex flex-row items-center">
                  <input
                    type="text"
                    name="cookie"
                    placeholder="Enter the ARL cookie"
                    className="input w-1/3"
                  />
                  <button
                    type="submit"
                    className="btn btn-secondary p-2 ml-3 w-40"
                  >
                    <span>Add cookie</span>
                  </button>
                  <span className="text-neutral-600 ml-3">
                    Note that the cookie is not checked to be correct.
                  </span>
                </div>
              </form>
              <form
                action={async (form) => {
                  const browserId = form.get('selectedBrowser')!.toString();

                  const arl =
                    await window.renderer.loginAPI.tryExtractLoginCookieFromBrowser(
                      browserId
                    );

                  if (arl.startsWith('Error:')) {
                    setExtractionError(arl);
                    return;
                  }

                  window.renderer.loginAPI.setLoginCookie(arl);
                  setCookiesExist(true);
                }}
              >
                <div className="flex flex-row items-center">
                  <select className="select w-1/3" name="selectedBrowser">
                    {Object.entries(SUPPORTED_BROWSERS).map(
                      ([id, displayName]) => {
                        return (
                          <option value={id} key={id}>
                            {displayName}
                          </option>
                        );
                      }
                    )}
                  </select>

                  <button
                    type="submit"
                    className="btn btn-secondary p-2 ml-3 w-40"
                  >
                    <span>Extract</span>
                  </button>
                  <span className="ml-3 text-error">{extractionError}</span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default CookieSetupPage;
