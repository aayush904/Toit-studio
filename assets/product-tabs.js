class ProductTabs extends HTMLElement {
  constructor() {
    super();
    this.triggers = Array.from(this.parentElement.querySelectorAll('[data-product-tabs-trigger]'));
    this.mobileSelect = this.parentElement.querySelector('[data-product-tabs-mobile-select]');
    this.panels = Array.from(this.querySelectorAll('[data-product-tabs-panel]'));

    this.triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => this.select(index));
    });

    if (this.mobileSelect) {
      this.mobileSelect.addEventListener('change', (event) => {
        this.select(parseInt(event.target.value, 10));
      });
    }
  }

  select(index) {
    this.triggers.forEach((trigger, i) => {
      trigger.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    if (this.mobileSelect) {
      this.mobileSelect.value = index;
    }

    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
  }
}

customElements.define('product-tabs', ProductTabs);
