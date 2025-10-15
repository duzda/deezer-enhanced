const RETRY_COUNT = 5;
const RETRY_DELAY = 1_000;

export const callWithRetries = (
  selector: string,
  retryFunction: (element: HTMLElement) => void,
  retryCount: number = RETRY_COUNT,
  retryDelay: number = RETRY_DELAY
) => {
  let retries = retryCount - 1;

  const innerRetryFunction = () => {
    const element = document.querySelector(selector);

    if (element) {
      retryFunction(element as HTMLElement);
    } else {
      if (retries === 0) return;
      setTimeout(() => {
        retries -= 1;
        innerRetryFunction();
      }, retryDelay);
    }
  };

  innerRetryFunction();
};
