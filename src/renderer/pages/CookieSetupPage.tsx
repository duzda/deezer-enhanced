import { useAtom } from 'jotai';
import React, { useEffect, useRef } from 'react';
import { cookiesExistAtom } from '../states/atoms';
import { browsers } from '../../main/utils/cookies';

function CookieSetupPage(): React.JSX.Element {
  const [cookiesExist, setCookiesExist] = useAtom(cookiesExistAtom);

  useEffect(() => {
    const findCookies = async () => {
      setCookiesExist(await window.renderer.cookieAPI.getCookieStatus());
    };

    // noinspection JSIgnoredPromiseFromCall
    findCookies();
  }, [setCookiesExist]);

  const cookieInputRef = useRef<HTMLInputElement>(null);
  const browserListSelectionRef = useRef<HTMLSelectElement>(null);
  const extractionStatusSpanRef = useRef<HTMLSpanElement>(null);

  const getArlFromBrowser = (browserId: string) => {
    window.renderer.cookieAPI
      .getCookieFromBrowser(browserId)
      .then((arl: string) => {
        // @ts-expect-error can't be null.
        const span: HTMLSpanElement = extractionStatusSpanRef.current;
        if (arl.startsWith('Error:')) {
          span.className = span.className.replace(
            'text-neutral-600',
            'text-error'
          );
          span.textContent = `${arl}`;
          return;
        }

        window.renderer.cookieAPI.setArl(arl);
        setCookiesExist(true);
      });
  };
  return (
    <main>
      <div className="flex flex-row">
        <div className="min-w-96 w-4/5 mx-auto my-8 flex flex-col gap-8 bg-base-200 p-8 rounded-md border-2 border-neutral">
          <p>
            Deezer utilizes complicated cryptographical checks during login,
            which won&#39;t work in Electron application and even some browsers.
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
          {cookiesExist ? (
            /* TODO: possibly there button to remove the arl cookie. */
            <div />
          ) : (
            <>
              <div className="flex flex-row items-center">
                <input
                  type="text"
                  ref={cookieInputRef}
                  placeholder="Enter the ARL cookie"
                  className="bg-base-100/40 border-2 border-neutral rounded-md w-1/3 p-2 outline-none"
                />
                <button
                  type="button"
                  className="rounded-md p-2 ml-3 cursor-pointer w-40 font-bold text-primary"
                  style={{ background: '#a13bff' }}
                  onClick={() => {
                    // @ts-expect-error cookieInputRef is always true, as it is assigned to the input above.
                    const arl: string = cookieInputRef.current.value;

                    if (arl.length === 0) {
                      return;
                    }

                    window.renderer.cookieAPI.setArl(arl);
                    setCookiesExist(true);
                  }}
                >
                  <span className="text-primary">Add cookie</span>
                </button>
                <span className="text-neutral-600 ml-3">
                  Note that the cookie is not checked to be correct.
                </span>
              </div>
              <div className="flex flex-row items-center">
                <select
                  className={`${cookiesExist ? 'bg-base-100/20' : 'bg-base-100/40'} border-2 border-neutral rounded-md w-1/3 p-2 outline-none`}
                  ref={browserListSelectionRef}
                >
                  {browsers.entries().map(([id, displayName]) => {
                    return (
                      <option value={id} key={id} className="bg-base-100">
                        {displayName}
                      </option>
                    );
                  })}
                </select>

                <button
                  type="button"
                  className="rounded-md p-2 ml-3 cursor-pointer w-40 font-bold text-primary"
                  style={{ background: cookiesExist ? '#b769ff' : '#a13bff' }}
                  disabled={cookiesExist}
                  onClick={() => {
                    // @ts-expect-error we don't need to await this method, as it can't be done on the client.
                    getArlFromBrowser(browserListSelectionRef.current.value);
                  }}
                >
                  <span>Extract</span>
                </button>

                <span
                  className="ml-3 text-neutral-600"
                  ref={extractionStatusSpanRef}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default CookieSetupPage;
