document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-load-more-button]');
  if (!button) return;

  event.preventDefault();

  const url = button.dataset.nextUrl;
  if (!url) return;

  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = '...';

  try {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');

    const newItems = doc.querySelector('#product-grid');
    const currentGrid = document.querySelector('#product-grid');
    if (newItems && currentGrid) {
      currentGrid.append(...newItems.children);
    }

    const newViewed = doc.querySelector('.load-more__viewed');
    const currentViewed = document.querySelector('.load-more__viewed');
    if (newViewed && currentViewed) {
      currentViewed.innerHTML = newViewed.innerHTML;
    }

    const newButton = doc.querySelector('[data-load-more-button]');
    const nextUrl = newButton ? newButton.dataset.nextUrl : '';

    if (nextUrl) {
      button.dataset.nextUrl = nextUrl;
      button.disabled = false;
      button.textContent = originalLabel;
    } else {
      button.closest('.load-more')?.querySelector('.load-more__button')?.remove();
    }
  } catch (error) {
    button.disabled = false;
    button.textContent = originalLabel;
  }
});
