const SELECTOR =
  '#page_player [aria-label="Add to Favorite tracks"],#page_player [aria-label="Remove from Favorite tracks"]';

export const favorite = () => {
  const favoriteElement = document.querySelector(SELECTOR);

  if (favoriteElement) {
    // oxlint-disable-next-line no-unsafe-type-assertion
    (favoriteElement as HTMLButtonElement).click();
  }
};
