/* Progressive enhancement only. Shopify renders cart prices, discounts and counts. */
if (!customElements.get('gecko-cart-drawer')) {
  customElements.define('gecko-cart-drawer', class extends HTMLElement {
    connectedCallback() {
      if (this.controller || !window.fetch || !window.FormData) return;
      this.dialog = this.querySelector('dialog');
      if (!this.dialog?.showModal) return;
      this.content = this.querySelector('[data-drawer-content]');
      this.status = this.querySelector('[data-drawer-status]');
      this.error = this.querySelector('[data-drawer-error]');
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      document.querySelectorAll('[data-gecko-cart-open]').forEach(link => {
        link.setAttribute('aria-haspopup', 'dialog');
        link.setAttribute('aria-controls', this.dialog.id);
        link.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('click', event => {
        const link = event.target.closest('[data-gecko-cart-open]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!this.open(link)) return;
        event.preventDefault();
        if (!this.busy) this.run(() => this.refresh());
      }, options);
      // Run after the product component's own validation; leave accelerated checkout alone.
      document.addEventListener('submit', event => {
        const form = event.target;
        if (form.matches('[data-gecko-cart]') && this.fullCartStale) {
          event.preventDefault();
          this.showPageError();
          return;
        }
        if (!form.matches('gecko-product form.gecko-product__form') || event.defaultPrevented || (event.submitter && !event.submitter.matches('[data-primary-add]'))) return;
        const details = form.closest('[data-product-details]');
        if (details?.dataset.available !== 'true' || details.getAttribute('aria-busy') === 'true' || !form.checkValidity()) return;
        event.preventDefault();
        if (this.busy) return;
        const opener = event.submitter || form.querySelector('[data-primary-add]');
        const product = form.closest('gecko-product');
        const title = product.querySelector('h1').textContent.trim();
        const data = new FormData(form);
        data.set('sections', this.sectionIds().join(','));
        data.set('sections_url', this.dataset.cartUrl);
        const productStatus = form.closest('gecko-product').querySelector('[data-product-status]');
        this.run(async () => {
          if (this.stale) {
            await this.refresh();
            this.open(opener, product);
            return this.dataset.refreshed;
          }
          this.fullCartStale = Boolean(document.querySelector('[data-cart-page-section]'));
          const response = await fetch(this.apiURL(this.dataset.addUrl), { method: 'POST', body: data, credentials: 'same-origin', headers: { Accept: 'application/json' } });
          await this.readMutation(response);
          this.open(opener, product);
          const message = this.dataset.added.replace('[title]', title);
          return message;
        }, productStatus);
      }, options);
      this.dialog.addEventListener('click', event => {
        if (event.target.closest('[data-drawer-close]')) this.close();
        if (event.target === this.dialog) {
          const bounds = this.dialog.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) this.close();
        }
        const remove = event.target.closest('[data-cart-remove]');
        if (remove && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          if (!this.busy) this.change(remove.closest('[data-cart-item]'), 0);
        }
        const button = event.target.closest('[data-cart-step]');
        if (button && !button.disabled && !this.busy) {
          const item = button.closest('[data-cart-item]');
          const input = item.querySelector('[data-cart-quantity]');
          if (Number(button.dataset.cartStep) < 0) input.stepDown();
          else input.stepUp();
          this.change(item, input.valueAsNumber);
        }
      }, options);
      this.dialog.addEventListener('change', event => {
        if (event.target.matches('[data-cart-quantity]') && !this.busy) this.change(event.target.closest('[data-cart-item]'), event.target.valueAsNumber);
      }, options);
      this.dialog.addEventListener('submit', event => {
        if (this.busy || this.stale) event.preventDefault();
      }, options);
      this.dialog.addEventListener('cancel', event => { event.preventDefault(); this.close(); }, options);
      this.dialog.addEventListener('close', () => this.restore(), options);
      this.dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        const controls = [...this.dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')].filter(element => element.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }, options);
    }

    apiURL(route) {
      const url = new URL(route, location.origin);
      url.pathname += '.js';
      return url;
    }

    sectionIds(includePage = true) {
      const page = document.querySelector('[data-cart-page-section]');
      return [this.dataset.sectionId, ...(includePage && page ? [page.dataset.cartPageSection] : [])];
    }

    open(opener, product = opener?.closest('gecko-product')) {
      if (this.dialog.open) return true;
      const menu = document.querySelector('gecko-mobile-menu');
      if (menu?.dialog?.open) menu.close();
      this.opener = opener;
      this.returnProduct = product;
      this.scrollPosition = { x: scrollX, y: scrollY };
      this.bodyStyles = ['position', 'top', 'left', 'width', 'overflow'].map(name => [name, document.body.style.getPropertyValue(name), document.body.style.getPropertyPriority(name)]);
      document.body.style.position = 'fixed';
      document.body.style.top = `${-this.scrollPosition.y}px`;
      document.body.style.left = `${-this.scrollPosition.x}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      try { this.dialog.showModal(); }
      catch { this.restore(); return false; }
      document.querySelectorAll('[data-gecko-cart-open]').forEach(link => link.setAttribute('aria-expanded', 'true'));
      this.querySelector('[data-drawer-close]').focus({ preventScroll: true });
      return true;
    }

    close() { this.dialog.close(); this.restore(); }

    restore() {
      if (!this.bodyStyles) return;
      for (const [name, value, priority] of this.bodyStyles) {
        if (value) document.body.style.setProperty(name, value, priority);
        else document.body.style.removeProperty(name);
      }
      this.bodyStyles = null;
      window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
      document.querySelectorAll('[data-gecko-cart-open]').forEach(link => link.setAttribute('aria-expanded', 'false'));
      const target = this.opener?.isConnected && !this.opener.disabled
        ? this.opener
        : this.returnProduct?.querySelector('[data-primary-add]:not(:disabled)') || document.querySelector('[data-gecko-cart-open]');
      target?.focus({ preventScroll: true });
    }

    setBusy(value, lockProductInputs = false) {
      this.busy = value;
      this.content.setAttribute('aria-busy', String(value));
      if (value) {
        this.disabledStates = new Map();
        const selector = 'gecko-product [data-primary-add], gecko-cart-drawer button:not([data-drawer-close]), gecko-cart-drawer input';
        document.querySelectorAll(selector + (lockProductInputs ? ', gecko-product [data-option-value], gecko-product [name="quantity"]' : '')).forEach(element => {
          this.disabledStates.set(element, element.disabled);
          element.disabled = true;
        });
      } else {
        this.disabledStates?.forEach((disabled, element) => {
          if (!element.isConnected) return;
          const details = element.matches('[data-primary-add]') ? element.closest('[data-product-details]') : null;
          element.disabled = disabled || Boolean(details && (details.getAttribute('aria-busy') === 'true' || details.dataset.available !== 'true'));
        });
        this.disabledStates = null;
        const checkout = this.querySelector('[data-drawer-checkout]');
        if (checkout) checkout.disabled = Boolean(this.stale);
      }
      this.querySelectorAll('[data-cart-remove]').forEach(link => link.setAttribute('aria-disabled', String(value)));
    }

    async run(task, productStatus) {
      if (this.busy) return;
      const active = document.activeElement;
      const item = active.closest('[data-cart-item]');
      const focus = item ? { key: item.dataset.itemKey, control: active.dataset.focus, index: [...this.querySelectorAll('[data-cart-item]')].indexOf(item) } : null;
      this.error.textContent = '';
      this.status.textContent = this.dataset.loading;
      if (productStatus) {
        productStatus.className = 'gecko-visually-hidden';
        productStatus.style.display = 'block';
        productStatus.textContent = this.dataset.loading;
      }
      this.setBusy(true, Boolean(productStatus));
      try {
        const message = await task();
        if (this.isConnected) {
          this.status.textContent = typeof message === 'string' ? message : '';
          if (productStatus) productStatus.textContent = this.status.textContent;
        }
      } catch {
        // Never replay an uncertain mutation: it may already have reached Shopify.
        this.stale = true;
        if (productStatus) {
          productStatus.className = 'gecko-product__update-error';
          productStatus.textContent = this.dataset.error + ' ';
          const link = document.createElement('a');
          link.href = this.dataset.cartUrl;
          link.textContent = this.querySelector('.gecko-cart-drawer__view-cart').textContent;
          productStatus.append(link);
        }
        this.status.textContent = '';
        this.error.textContent = this.dataset.error;
        if (this.fullCartStale) this.showPageError();
      } finally {
        this.setBusy(false);
        if (this.dialog.open && focus) this.restoreCartFocus(focus);
      }
    }

    restoreCartFocus({ key, control, index }) {
      const rows = this.querySelectorAll('[data-cart-item]');
      const row = this.querySelector(`[data-item-key="${CSS.escape(key)}"]`) || rows[Math.max(0, Math.min(index, rows.length - 1))];
      const target = row?.querySelector(`[data-focus="${control}"]:not(:disabled)`) || row?.querySelector('[data-cart-quantity]') || this.querySelector('[data-drawer-close]');
      target.focus({ preventScroll: true });
    }

    showPageError() {
      const status = document.querySelector('[data-gecko-cart] [data-cart-status]');
      if (!status) return;
      status.textContent = this.dataset.error + ' ';
      const link = document.createElement('a');
      link.href = this.dataset.cartUrl;
      link.textContent = this.querySelector('.gecko-cart-drawer__view-cart').textContent;
      status.append(link);
    }

    async change(item, quantity) {
      const input = item.querySelector('[data-cart-quantity]');
      if (quantity !== 0 && (!Number.isFinite(quantity) || !input.checkValidity())) {
        this.error.textContent = this.dataset.invalid;
        input.value = input.defaultValue;
        input.focus();
        return;
      }
      const title = item.dataset.itemTitle;
      const key = item.dataset.itemKey;
      await this.run(async () => {
        // Reconcile an earlier uncertain response before accepting a new absolute quantity.
        if (this.stale) { await this.refresh(); return this.dataset.refreshed; }
        this.fullCartStale = Boolean(document.querySelector('[data-cart-page-section]'));
        const response = await fetch(this.apiURL(this.dataset.changeUrl), {
          method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: key, quantity, sections: this.sectionIds(), sections_url: this.dataset.cartUrl }),
        });
        await this.readMutation(response);
        return quantity === 0 ? this.dataset.removed.replace('[title]', title) : this.dataset.updated;
      });
      // On rejection, restore the displayed server-confirmed quantity.
      const remaining = this.querySelector(`[data-item-key="${CSS.escape(key)}"] [data-cart-quantity]`);
      if (remaining && this.stale) remaining.value = remaining.defaultValue;
    }

    async readMutation(response) {
      if (!response.ok) throw new Error('Cart mutation failed');
      const data = await response.json();
      if (this.applySections(data.sections, true)) return;
      // Section rendering can fail independently after a successful mutation.
      await this.refresh(true);
    }

    async refresh(includePage = Boolean(this.fullCartStale)) {
      const url = new URL(this.dataset.cartUrl, location.origin);
      url.searchParams.set('sections', this.sectionIds(includePage).join(','));
      const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Cart section failed');
      const data = await response.json();
      if (!this.applySections(data, includePage)) throw new Error('Cart section missing');
    }

    applySections(sections, includePage) {
      const page = document.querySelector('[data-cart-page-section]');
      let updatedPage;
      if (page && includePage) {
        const html = sections?.[page.dataset.cartPageSection];
        if (typeof html !== 'string') return false;
        updatedPage = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart-page-section]');
        if (!updatedPage || updatedPage.dataset.cartPageSection !== page.dataset.cartPageSection) return false;
      }
      if (!this.applySection(sections?.[this.dataset.sectionId])) return false;
      if (updatedPage) {
        // Retain unrelated unsaved edits only when Shopify's underlying value is unchanged.
        const pending = new Map();
        page.querySelectorAll('[data-cart-line-key]').forEach(row => {
          const input = row.querySelector('[name="updates[]"]');
          if (input.value !== input.defaultValue) pending.set(row.dataset.cartLineKey, { value: input.value, original: input.defaultValue });
        });
        let hasPending = false;
        updatedPage.querySelectorAll('[data-cart-line-key]').forEach(row => {
          const previous = pending.get(row.dataset.cartLineKey);
          const input = row.querySelector('[name="updates[]"]');
          if (previous && input.defaultValue === previous.original) { input.value = previous.value; hasPending = true; }
        });
        const note = page.querySelector('[name="note"]'), updatedNote = updatedPage.querySelector('[name="note"]');
        if (note && updatedNote && note.value !== note.defaultValue && note.defaultValue === updatedNote.defaultValue) { updatedNote.value = note.value; hasPending = true; }
        if (hasPending) {
          const status = updatedPage.querySelector('[data-cart-status]');
          if (status) status.textContent = status.dataset.message;
        }
        page.replaceWith(updatedPage);
        updatedPage.dispatchEvent(new CustomEvent('gecko:cart-page-updated', { bubbles: true }));
        this.fullCartStale = false;
      }
      return true;
    }

    applySection(html) {
      if (typeof html !== 'string') return false;
      const updated = new DOMParser().parseFromString(html, 'text/html').querySelector('gecko-cart-drawer');
      const content = updated?.querySelector('[data-drawer-content]');
      const count = Number(updated?.dataset.count);
      if (!content || !Number.isInteger(count) || count < 0 || !updated.dataset.countLabel || !updated.querySelector('[data-drawer-count]')) return false;
      const scroll = this.querySelector('[data-drawer-items]').scrollTop;
      this.content.replaceChildren(...content.childNodes);
      this.querySelector('[data-drawer-items]').scrollTop = scroll;
      this.dataset.count = String(count);
      this.dataset.countLabel = updated.dataset.countLabel;
      this.querySelector('[data-drawer-count]').textContent = updated.querySelector('[data-drawer-count]').textContent;
      document.querySelectorAll('[data-gecko-bag-count]').forEach(element => { element.textContent = `(${count})`; });
      document.querySelectorAll('[data-gecko-bag-count-label]').forEach(element => { element.textContent = updated.dataset.countLabel; });
      this.stale = false;
      return true;
    }

    disconnectedCallback() {
      if (this.dialog?.open) this.dialog.close();
      this.restore();
      this.controller?.abort();
      this.controller = null;
    }
  });
}
