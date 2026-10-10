/* Shopify owns variant resolution, pricing and the native product-form submission. */
if (!customElements.get('gecko-product')) {
  customElements.define('gecko-product', class extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      const { signal } = this.controller;
      this.track = this.querySelector('[data-media-track]');
      this.slides = [...this.querySelectorAll('[data-media-id]')];
      this.activeIndex = 0;
      this.enhanceOptions();
      this.querySelector('[data-gallery-controls]')?.removeAttribute('hidden');
      this.addEventListener('change', (event) => {
        if (event.target.matches('[data-option-value]')) this.updateVariant(event.target);
      }, { signal });
      this.addEventListener('submit', (event) => {
        const details = this.querySelector('[data-product-details]');
        if (details.getAttribute('aria-busy') === 'true' || details.dataset.available !== 'true' || !details.dataset.selectedVariant) event.preventDefault();
      }, { signal });
      this.querySelector('[data-media-prev]')?.addEventListener('click', () => this.navigate(this.activeIndex - 1), { signal });
      this.querySelector('[data-media-next]')?.addEventListener('click', () => this.navigate(this.activeIndex + 1), { signal });
      this.track?.addEventListener('scroll', () => {
        cancelAnimationFrame(this.scrollFrame);
        this.scrollFrame = requestAnimationFrame(() => this.syncGallery());
      }, { signal, passive: true });
      this.track?.addEventListener('keydown', (event) => {
        // Leave video/model player shortcuts alone.
        if (event.target !== this.track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        this.navigate(this.activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }, { signal });
      this.resizeObserver = new ResizeObserver(() => {
        if (this.track && this.slides[this.activeIndex]) {
          this.track.scrollTo({ left: this.slides[this.activeIndex].offsetLeft - this.slides[0].offsetLeft, behavior: 'instant' });
        }
      });
      if (this.track) this.resizeObserver.observe(this.track);
      this.syncGallery();
      if (this.querySelector('model-viewer')) {
        window.Shopify?.loadFeatures?.([{
          name: 'model-viewer-ui', version: '1.0',
          onLoad: (errors) => {
            if (!errors && this.isConnected && window.Shopify.ModelViewerUI) {
              this.modelPlayers = [...this.querySelectorAll('model-viewer')].map(el => new window.Shopify.ModelViewerUI(el));
            }
          },
        }]);
      }
    }

    disconnectedCallback() {
      this.controller?.abort();
      this.request?.abort();
      this.resizeObserver?.disconnect();
      this.modelPlayers?.forEach(player => player.pause());
      cancelAnimationFrame(this.scrollFrame);
      this.controller = null;
    }

    enhanceOptions() {
      this.querySelector('[data-option-picker]')?.removeAttribute('hidden');
      this.setAttribute('data-enhanced', '');
      const details = this.querySelector('[data-product-details]');
      details.querySelector('[data-native-variant-select]').disabled = true;
      details.querySelector('[data-variant-id]').disabled = !details.dataset.selectedVariant;
    }

    navigate(index) {
      const slide = this.slides[Math.max(0, Math.min(index, this.slides.length - 1))];
      if (!slide) return;
      this.track.scrollTo({
        left: slide.offsetLeft - this.slides[0].offsetLeft,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }

    syncGallery() {
      if (!this.track || !this.slides.length) return;
      const position = this.track.scrollLeft;
      const index = this.slides.reduce((best, slide, i) => {
        const distance = Math.abs(slide.offsetLeft - this.slides[0].offsetLeft - position);
        const bestDistance = Math.abs(this.slides[best].offsetLeft - this.slides[0].offsetLeft - position);
        return distance < bestDistance ? i : best;
      }, 0);
      this.slides.forEach((slide, i) => {
        slide.inert = i !== index;
        slide.setAttribute('aria-hidden', String(i !== index));
        if (i !== index) {
          slide.querySelectorAll('video, model-viewer').forEach(player => player.pause?.());
          const iframe = slide.querySelector('iframe');
          if (iframe && i === this.activeIndex && index !== this.activeIndex) {
            // Reset only the outgoing external player to stop hidden playback.
            iframe.src = iframe.src;
          }
        }
      });
      this.activeIndex = index;
      const prev = this.querySelector('[data-media-prev]');
      const next = this.querySelector('[data-media-next]');
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === this.slides.length - 1;
      const count = this.querySelector('[data-media-count]');
      if (count) count.textContent = this.slides[index].getAttribute('aria-label');
    }

    async updateVariant(input) {
      if (input.dataset.productUrl && new URL(input.dataset.productUrl, location.origin).pathname !== new URL(this.dataset.productUrl, location.origin).pathname) {
        location.assign(input.dataset.productUrl);
        return;
      }
      this.request?.abort();
      const request = this.request = new AbortController();
      const details = this.querySelector('[data-product-details]');
      const status = this.querySelector('[data-product-status]');
      const quantity = details.querySelector('[name="quantity"]').value;
      const focusValue = input.value;
      const options = [...details.querySelectorAll('[data-option-value]:checked')].map(value => value.value);
      const url = new URL(location.href);
      url.searchParams.delete('variant');
      url.searchParams.set('option_values', options.join(','));
      url.searchParams.set('section_id', this.dataset.sectionId);
      details.setAttribute('aria-busy', 'true');
      details.querySelector('[data-primary-add]').disabled = true;
      details.querySelectorAll('.gecko-product__checkout').forEach(el => el.hidden = true);
      status.className = 'gecko-visually-hidden';
      status.textContent = this.dataset.updating;
      try {
        const response = await fetch(url, { signal: request.signal });
        if (!response.ok) throw new Error('Product section response failed');
        const document = new DOMParser().parseFromString(await response.text(), 'text/html');
        const updated = [...document.querySelectorAll('gecko-product')].find(el => el.dataset.sectionId === this.dataset.sectionId)?.querySelector('[data-product-details]');
        if (!updated) throw new Error('Product details missing');
        if (request.signal.aborted) return;
        details.replaceWith(updated);
        this.enhanceOptions();
        const quantityInput = updated.querySelector('[name="quantity"]');
        const min = Number(quantityInput.min) || 1;
        const step = Number(quantityInput.step) || 1;
        const max = Number(quantityInput.max) || Infinity;
        const boundedQuantity = Math.max(min, Math.min(Number(quantity) || min, max));
        quantityInput.value = min + Math.floor((boundedQuantity - min) / step) * step;
        [...updated.querySelectorAll('[data-option-value]')].find(value => value.value === focusValue)?.focus({ preventScroll: true });
        const index = this.slides.findIndex(slide => slide.dataset.mediaId === updated.dataset.selectedMedia);
        if (index !== -1) this.navigate(index);
        url.searchParams.delete('section_id');
        if (updated.dataset.selectedVariant) {
          url.searchParams.delete('option_values');
          url.searchParams.set('variant', updated.dataset.selectedVariant);
        }
        history.replaceState({}, '', url);
        status.textContent = [updated.querySelector('.gecko-product__price').textContent.trim(), updated.querySelector('[data-primary-add]').textContent.trim()].join('. ');
        if (updated.querySelector('.gecko-product__checkout')) window.Shopify?.PaymentButton?.init();
      } catch (error) {
        if (request.signal.aborted) return;
        // Restore server-confirmed choices; never submit the newly requested choice with a stale ID.
        details.querySelectorAll('[data-option-value]').forEach(value => { value.checked = value.defaultChecked; });
        status.className = 'gecko-product__update-error';
        status.textContent = this.dataset.updateError;
        details.querySelector('[data-primary-add]').disabled = details.dataset.available !== 'true';
        details.querySelectorAll('.gecko-product__checkout').forEach(el => el.hidden = false);
      } finally {
        if (!request.signal.aborted) this.querySelector('[data-product-details]').removeAttribute('aria-busy');
      }
    }
  });
}
