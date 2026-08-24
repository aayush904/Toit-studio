class ProductTabs extends HTMLElement {
  constructor() {
    super();
    this.triggers = Array.from(this.parentElement.querySelectorAll('[data-product-tabs-trigger]'));
    this.panels = Array.from(this.querySelectorAll('[data-product-tabs-panel]'));

    this.triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => this.select(index));
    });
  }

  select(index) {
    this.triggers.forEach((trigger, i) => {
      trigger.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
  }
}

customElements.define('product-tabs', ProductTabs);
