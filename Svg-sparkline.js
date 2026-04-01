<script type="module">
class SvgSparkline extends HTMLElement {
  static observedAttributes = ['values', 'labels', 'min', 'max'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          inline-size: 100%;
          block-size: 2rem;
          min-inline-size: 4rem;
          position: relative;
          color: var(--sparkline-color, currentColor);
        }

        svg {
          display: block;
          inline-size: 100%;
          block-size: 100%;
          overflow: visible;
        }

        [part="line"] {
          fill: none;
          stroke: currentColor;
          stroke-width: var(--sparkline-width, 2);
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
        }

        [part="guide"] {
          stroke: currentColor;
          stroke-opacity: .22;
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
          display: none;
        }

        [part="marker"] {
          fill: currentColor;
          display: none;
        }

        [part="hit"] {
          fill: none;
          stroke: transparent;
          stroke-width: 16;
          vector-effect: non-scaling-stroke;
          pointer-events: stroke;
        }

        [part="tooltip"] {
          position: absolute;
          left: 0;
          bottom: 100%;
          transform: translate(-50%, -0.35rem);
          padding: .25rem .45rem;
          border-radius: .4rem;
          font: 12px/1.2 system-ui, sans-serif;
          white-space: nowrap;
          background: var(--sparkline-tooltip-bg, Canvas);
          color: var(--sparkline-tooltip-color, CanvasText);
          border: 1px solid rgb(0 0 0 / 0.12);
          box-shadow: 0 4px 12px rgb(0 0 0 / 0.12);
          pointer-events: none;
          opacity: 0;
          transition: opacity 120ms ease;
        }

        [part="tooltip"][data-open="true"] {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          [part="tooltip"] {
            transition: none;
          }
        }
      </style>

      <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
        <line part="guide" y1="2" y2="22"></line>
        <path part="line"></path>
        <path part="hit"></path>
        <circle part="marker" r="2.4"></circle>
      </svg>

      <div part="tooltip" role="status" aria-live="polite"></div>
    `;

    this.$svg = this.shadowRoot.querySelector('svg');
    this.$line = this.shadowRoot.querySelector('[part="line"]');
    this.$hit = this.shadowRoot.querySelector('[part="hit"]');
    this.$guide = this.shadowRoot.querySelector('[part="guide"]');
    this.$marker = this.shadowRoot.querySelector('[part="marker"]');
    this.$tooltip = this.shadowRoot.querySelector('[part="tooltip"]');

    this._values = [];
    this._labels = [];
    this._points = [];
    this._hoverIndex = -1;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'img');
    this.$svg.addEventListener('pointermove', this.onPointerMove);
    this.$svg.addEventListener('pointerleave', this.onPointerLeave);
    this.render();
  }

  disconnectedCallback() {
    this.$svg.removeEventListener('pointermove', this.onPointerMove);
    this.$svg.removeEventListener('pointerleave', this.onPointerLeave);
  }

  attributeChangedCallback() {
    this.render();
  }

  get value() {
    return this.getAttribute('values') ?? '[]';
  }

  set value(v) {
    if (Array.isArray(v)) {
      this.setAttribute('values', JSON.stringify(v));
      return;
    }
    if (typeof v === 'string') {
      this.setAttribute('values', v);
      return;
    }
    this.setAttribute('values', JSON.stringify(v ?? []));
  }

  parseList(raw, asNumbers = false) {
    if (!raw) return [];

    try {
      if (raw.trim().startsWith('[')) {
        const parsed = JSON.parse(raw);
        return asNumbers
          ? parsed.map(Number).filter(Number.isFinite)
          : parsed.map(v => String(v));
      }
    } catch (_) {}

    const arr = raw
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    return asNumbers
      ? arr.map(Number).filter(Number.isFinite)
      : arr;
  }

  getMinMax(values) {
    let min = Number(this.getAttribute('min'));
    let max = Number(this.getAttribute('max'));

    if (!Number.isFinite(min)) min = Math.min(...values);
    if (!Number.isFinite(max)) max = Math.max(...values);

    if (min === max) {
      min -= 1;
      max += 1;
    }

    return { min, max };
  }

  render() {
    const values = this.parseList(this.getAttribute('values'), true);
    const labels = this.parseList(this.getAttribute('labels'), false);

    this._values = values;
    this._labels = labels;
    this._points = [];
    this._hoverIndex = -1;

    if (!values.length) {
      this.$line.setAttribute('d', '');
      this.$hit.setAttribute('d', '');
      this.hideHover();
      return;
    }

    const { min, max } = this.getMinMax(values);
    const top = 2;
    const bottom = 22;
    const left = 1;
    const right = 99;
    const rangeY = bottom - top;

    const points = values.map((value, index) => {
      const x = values.length === 1
        ? 50
        : left + (index / (values.length - 1)) * (right - left);

      const y = bottom - ((value - min) / (max - min)) * rangeY;

      return { x, y, value, label: labels[index] ?? null, index };
    });

    this._points = points;

    let d = '';
    if (points.length === 1) {
      const p = points[0];
      d = `M ${p.x - 0.01} ${p.y} L ${p.x + 0.01} ${p.y}`;
    } else {
      d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    }

    this.$line.setAttribute('d', d);
    this.$hit.setAttribute('d', d);
    this.hideHover(true);
    this.animateLine();
  }

  animateLine() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const length = this.$line.getTotalLength?.() ?? 0;
    if (!Number.isFinite(length) || length <= 0) return;

    this.$line.style.transition = 'none';
    this.$line.style.strokeDasharray = String(length);
    this.$line.style.strokeDashoffset = String(length);

    // force layout
    this.$line.getBoundingClientRect();

    requestAnimationFrame(() => {
      this.$line.style.transition =
        'stroke-dashoffset var(--sparkline-duration, 700ms) cubic-bezier(.22,.61,.36,1)';
      this.$line.style.strokeDashoffset = '0';
    });
  }

  onPointerMove(evt) {
    if (!this._points.length) return;

    const rect = this.$svg.getBoundingClientRect();
    if (!rect.width) return;

    const ratio = Math.max(0, Math.min(1, (evt.clientX - rect.left) / rect.width));
    const index = this._points.length === 1
      ? 0
      : Math.round(ratio * (this._points.length - 1));

    if (index === this._hoverIndex) return;
    this._hoverIndex = index;

    const point = this._points[index];
    const hostRect = this.getBoundingClientRect();
    const leftPx = (point.x / 100) * rect.width;
    const clampedLeft = Math.max(24, Math.min(hostRect.width - 24, leftPx));

    this.$guide.setAttribute('x1', point.x);
    this.$guide.setAttribute('x2', point.x);
    this.$guide.style.display = 'block';

    this.$marker.setAttribute('cx', point.x);
    this.$marker.setAttribute('cy', point.y);
    this.$marker.style.display = 'block';

    this.$tooltip.textContent = point.label
      ? `${point.label}: ${point.value}`
      : String(point.value);

    this.$tooltip.style.left = `${clampedLeft}px`;
    this.$tooltip.dataset.open = 'true';

    this.dispatchEvent(new CustomEvent('spark-hover', {
      detail: {
        index: point.index,
        value: point.value,
        label: point.label,
        values: [...this._values]
      },
      bubbles: true,
      composed: true
    }));
  }

  onPointerLeave() {
    if (this._hoverIndex === -1) return;
    this._hoverIndex = -1;
    this.hideHover();

    this.dispatchEvent(new CustomEvent('spark-leave', {
      bubbles: true,
      composed: true
    }));
  }

  hideHover(silent = false) {
    this.$guide.style.display = 'none';
    this.$marker.style.display = 'none';
    delete this.$tooltip.dataset.open;

    if (!silent && this._hoverIndex !== -1) {
      this._hoverIndex = -1;
    }
  }
}

customElements.define('svg-sparkline', SvgSparkline);
</script>
