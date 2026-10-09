/* Each section owns its listeners and timer, including Theme Editor reloads. */
if (!customElements.get('gecko-hero-slideshow')) {
  customElements.define('gecko-hero-slideshow', class extends HTMLElement {
    connectedCallback() {
      queueMicrotask(() => {
        if (!this.isConnected || this.abort) return;
        this.init();
      });
    }

    disconnectedCallback() {
      this.clearTimer();
      this.abort?.abort();
      this.abort = null;
    }

    init() {
      this.abort = new AbortController();
      this.slides = [...this.querySelectorAll('[data-hero-slide]')];
      this.dots = [...this.querySelectorAll('[data-hero-dot]')];
      this.index = 0;
      this.hovered = false;
      this.focused = this.contains(document.activeElement);
      this.userPaused = false;
      this.editorSelected = false;
      this.autoplay = this.dataset.autoplay === 'true';
      this.interval = [4, 5, 6, 8].includes(Number(this.dataset.interval))
        ? Number(this.dataset.interval) * 1000 : 5000;
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.play = this.querySelector('[data-hero-play]');
      if (this.slides.length < 2) return;

      const on = (target, event, callback) => target?.addEventListener(event, callback, { signal: this.abort.signal });
      this.querySelector('[data-hero-controls]').hidden = false;
      on(this.querySelector('[data-hero-prev]'), 'click', () => this.show(this.index - 1, true));
      on(this.querySelector('[data-hero-next]'), 'click', () => this.show(this.index + 1, true));
      this.dots.forEach((dot, index) => on(dot, 'click', () => this.show(index, true)));
      on(this.play, 'click', () => {
        this.userPaused = !this.userPaused;
        this.updatePlay();
        this.schedule();
      });
      on(this, 'pointerenter', event => {
        if (event.pointerType !== 'mouse') return;
        this.hovered = true;
        this.schedule();
      });
      on(this, 'pointerleave', () => {
        this.hovered = false;
        this.schedule();
      });
      on(this, 'focusin', () => {
        this.focused = true;
        this.schedule();
      });
      on(this, 'focusout', event => {
        this.focused = this.contains(event.relatedTarget);
        this.schedule();
      });
      on(document, 'visibilitychange', () => this.schedule());
      on(this.motion, 'change', () => {
        this.updatePlay();
        this.schedule();
      });
      on(document, 'shopify:block:select', event => {
        if (String(event.detail?.sectionId) !== this.dataset.sectionId) return;
        const index = this.slides.findIndex(slide => slide.dataset.blockId === event.detail.blockId);
        if (index < 0) return;
        this.editorSelected = true;
        this.show(index, false);
      });
      on(document, 'shopify:block:deselect', event => {
        if (String(event.detail?.sectionId) !== this.dataset.sectionId) return;
        this.editorSelected = false;
        this.schedule();
      });
      this.updatePlay();
      this.show(0, false);
    }

    show(index, manual) {
      this.clearTimer();
      this.index = (index + this.slides.length) % this.slides.length;
      const active = this.slides[this.index];
      const template = active.querySelector('[data-hero-image]');
      if (template) {
        const image = template.content.querySelector('img');
        image.loading = 'eager';
        image.fetchPriority = 'auto';
        template.replaceWith(template.content.cloneNode(true));
      }
      this.slides.forEach((slide, position) => {
        const current = position === this.index;
        slide.classList.toggle('is-active', current);
        slide.inert = !current;
        slide.setAttribute('aria-hidden', String(!current));
      });
      this.dots.forEach((dot, position) => {
        if (position === this.index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      const counter = this.querySelector('[data-hero-counter]');
      if (counter) counter.textContent = `${String(this.index + 1).padStart(2, '0')} / ${String(this.slides.length).padStart(2, '0')}`;
      // Automatic advancement stays silent; manual controls announce the position.
      if (manual) this.querySelector('[data-hero-status]').textContent = this.dataset.statusTemplate.replace('{current}', this.index + 1);
      this.schedule();
    }

    updatePlay() {
      if (!this.play) return;
      this.play.hidden = this.motion.matches || Boolean(window.Shopify?.designMode);
      this.play.setAttribute('aria-label', this.userPaused ? this.play.dataset.playLabel : this.play.dataset.pauseLabel);
      this.play.querySelector('[data-hero-play-icon]').textContent = this.userPaused ? '▶' : 'Ⅱ';
    }

    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    }

    canAutoplay() {
      return this.isConnected && this.slides.length > 1 && this.autoplay && !this.userPaused &&
        !this.hovered && !this.focused && !document.hidden && !this.motion.matches &&
        !this.editorSelected && !window.Shopify?.designMode;
    }

    schedule() {
      this.clearTimer();
      if (!this.canAutoplay()) return;
      this.timer = setTimeout(() => {
        this.timer = null;
        // Recheck preferences/visibility if their change event is still queued.
        if (this.canAutoplay()) this.show(this.index + 1, false);
      }, this.interval);
    }
  });
}
