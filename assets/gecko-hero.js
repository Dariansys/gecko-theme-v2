/* Entrance enhancement is independent of slideshow timing and navigation. */
function enhanceGeckoHeroEntrance(root) {
  if (!root || root.dataset.entranceComplete) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || window.Shopify?.designMode || !('IntersectionObserver' in window)) return;
  const abort = new AbortController();
  let observer, fallback, completion;
  const finish = () => {
    clearTimeout(fallback);
    clearTimeout(completion);
    observer?.disconnect();
    abort.abort();
    root.classList.remove('is-entrance-pending', 'is-entering');
    root.dataset.entranceComplete = 'true';
  };
  try {
    const headline = root.querySelector('.gecko-hero__headline');
    if (headline && !headline.querySelector('.gecko-hero__headline-line')) {
      const lines = document.createDocumentFragment();
      let line = document.createElement('span');
      line.className = 'gecko-hero__headline-line';
      lines.append(line);
      // Move existing nodes so escaped copy and the gradient span remain intact.
      [...headline.childNodes].forEach(node => {
        if (node.nodeName === 'BR') {
          line = document.createElement('span');
          line.className = 'gecko-hero__headline-line';
          lines.append(line);
        } else line.append(node);
      });
      headline.replaceChildren(lines);
    }
    const targets = [
      root.querySelector('.gecko-hero__eyebrow'),
      ...root.querySelectorAll('.gecko-hero__headline-line'),
      root.querySelector('.gecko-hero__body'),
      root.querySelector('.gecko-hero__actions'),
    ].filter(Boolean);
    targets.forEach((target, index) => {
      target.classList.add('gecko-hero__reveal');
      target.style.setProperty('--hero-reveal-delay', `${Math.min(index, 8) * 90}ms`);
    });
    observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      clearTimeout(fallback);
      if (motion.matches || window.Shopify?.designMode) return finish();
      root.classList.remove('is-entrance-pending');
      root.classList.add('is-entering');
      completion = setTimeout(finish, Math.max(1100, targets.length * 90 + 650));
    }, { threshold: 0 });
    motion.addEventListener('change', event => { if (event.matches) finish(); }, { signal: abort.signal });
    root.addEventListener('focusin', finish, { once: true, signal: abort.signal });
    root.classList.add('is-entrance-pending');
    observer.observe(root);
    // Recover visibility if an observer fails to deliver its initial callback.
    // Offscreen Heroes remain observed and can still enter later.
    fallback = setTimeout(() => {
      const rect = root.getBoundingClientRect();
      root.classList.remove('is-entrance-pending');
      if (rect.bottom > 0 && rect.top < innerHeight) finish();
    }, 1800);
  } catch {
    finish();
  }
  return finish;
}

/* Each section owns its listeners and timer, including Theme Editor reloads. */
if (!customElements.get('gecko-hero-slideshow')) {
  customElements.define('gecko-hero-slideshow', class extends HTMLElement {
    connectedCallback() {
      queueMicrotask(() => {
        if (!this.isConnected || this.abort) return;
        this.init();
        this.finishEntrance = enhanceGeckoHeroEntrance(this.closest('.gecko-hero'));
      });
    }

    disconnectedCallback() {
      this.finishEntrance?.();
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
      if (manual) this.querySelector('[data-hero-status]').textContent = this.dataset.statusTemplate.replace('__GECKO_CURRENT__', this.index + 1);
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
