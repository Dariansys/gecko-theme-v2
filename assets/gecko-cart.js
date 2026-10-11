// Enhance the native POST form; Shopify continues to calculate and validate the cart.
(() => {
  const initialize = (root) => {
    root.querySelectorAll('[data-gecko-cart]').forEach((form) => {
      if (form.dataset.enhanced) return;
      form.dataset.enhanced = 'true';
      const status = form.querySelector('[data-cart-status]');
      const announce = () => { status.textContent = status.dataset.message; };
      form.querySelectorAll('[data-cart-quantity]').forEach((control) => {
        const input = control.querySelector('input');
        const buttons = control.querySelectorAll('button');
        const sync = () => {
          const value = input.valueAsNumber;
          buttons.forEach((button) => {
            const decrease = Number(button.dataset.quantityStep) < 0;
            button.disabled = !Number.isFinite(value) || (decrease ? value <= Number(input.min) : input.max !== '' && value >= Number(input.max));
          });
        };
        buttons.forEach((button) => {
          button.hidden = false;
          button.addEventListener('click', () => {
            if (Number(button.dataset.quantityStep) < 0) input.stepDown();
            else input.stepUp();
            input.dispatchEvent(new Event('input', { bubbles: true }));
          });
        });
        input.addEventListener('input', () => { sync(); announce(); });
        sync();
      });
      form.querySelector('[name="note"]')?.addEventListener('input', announce);
    });
  };
  initialize(document);
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
  document.addEventListener('gecko:cart-page-updated', (event) => initialize(event.target));
})();
