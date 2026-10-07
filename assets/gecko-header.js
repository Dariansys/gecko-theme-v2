/* Header-local enhancement; native dialog supplies modality and focus containment. */
if (!customElements.get('gecko-mobile-menu')) {
  customElements.define('gecko-mobile-menu', class extends HTMLElement {
    connectedCallback() {
      this.trigger = this.querySelector('[data-menu-open]');
      this.dialog = this.querySelector('dialog');
      if (!this.trigger || !this.dialog || !this.dialog.showModal) return;

      this.controller?.abort();
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      this.desktop = matchMedia('(min-width: 1024px)');
      this.trigger.hidden = false;
      this.trigger.addEventListener('click', () => this.open(), options);
      this.querySelector('[data-menu-close]').addEventListener('click', () => this.close(), options);
      this.dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        this.close();
      }, options);
      this.dialog.addEventListener('close', () => {
        if (!this.dialog.open) this.restore();
      }, options);
      this.dialog.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const controls = [...this.dialog.querySelectorAll('a[href], button:not([disabled])')]
          .filter((control) => control.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        // Keep Tab on actual menu controls, including at browser dialog boundaries.
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }, options);
      this.dialog.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
          // Unlock before the browser follows same-page anchor destinations.
          this.close();
        }
        const button = event.target.closest('[data-submenu-toggle]');
        if (button) {
          const submenu = this.querySelector(`#${CSS.escape(button.getAttribute('aria-controls'))}`);
          const expanded = button.getAttribute('aria-expanded') !== 'true';
          button.setAttribute('aria-expanded', String(expanded));
          submenu.hidden = !expanded;
          button.querySelector('[data-submenu-icon]').textContent = expanded ? '−' : '+';
        }
      }, options);
      this.desktop.addEventListener('change', () => {
        if (this.desktop.matches && this.dialog.open) this.close();
      }, options);
    }

    open() {
      if (this.desktop.matches || this.dialog.open) return;
      const body = document.body;
      this.scrollPosition = { x: scrollX, y: scrollY };
      this.bodyStyles = ['position', 'top', 'left', 'width', 'overflow'].map((name) =>
        [name, body.style.getPropertyValue(name), body.style.getPropertyPriority(name)]
      );
      body.style.setProperty('position', 'fixed');
      body.style.setProperty('top', `${-this.scrollPosition.y}px`);
      body.style.setProperty('left', `${-this.scrollPosition.x}px`);
      body.style.setProperty('width', '100%');
      body.style.setProperty('overflow', 'hidden');
      this.dialog.showModal();
      this.trigger.setAttribute('aria-expanded', 'true');
      this.querySelector('[data-menu-close]').focus({ preventScroll: true });
    }

    close() {
      this.dialog.close();
      this.restore();
    }

    restore() {
      if (!this.bodyStyles) return;
      for (const [name, value, priority] of this.bodyStyles) {
        if (value) document.body.style.setProperty(name, value, priority);
        else document.body.style.removeProperty(name);
      }
      this.bodyStyles = null;
      window.scrollTo(this.scrollPosition.x, this.scrollPosition.y);
      this.trigger.setAttribute('aria-expanded', 'false');
      // A resized desktop header hides the trigger; focus the visible home link.
      const target = this.desktop.matches
        ? this.closest('.gecko-header')?.querySelector('.gecko-brand-lockup')
        : this.trigger;
      if (target?.isConnected) target.focus({ preventScroll: true });
    }

    disconnectedCallback() {
      if (this.dialog?.open) this.dialog.close();
      this.restore();
      this.controller?.abort();
    }
  });
}
