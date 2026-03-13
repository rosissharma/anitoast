/**
 * anitoast — A lightweight, framework-agnostic toast notification library.
 * Zero dependencies. Animated via CSS transitions.
 * @module anitoast
 */

const TOAST_WIDTH = 356;
const VIEWPORT_OFFSET = 32;
const MOBILE_OFFSET = 16;
const VISIBLE_TOASTS_AMOUNT = 3;
const TOAST_LIFETIME = 4000;
const GAP = 14;
const SWIPE_THRESHOLD = 60;
const SWIPE_VELOCITY = 0.11;
const MOBILE_BREAKPOINT = 600;

const ICONS = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>`,
  loading: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="anitoast-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>`,
};

const STYLES = `
  :root {
    --anitoast-bg: #fff;
    --anitoast-border: rgba(0,0,0,0.08);
    --anitoast-shadow: 0px 4px 12px rgba(0,0,0,0.10);
    --anitoast-text: rgba(0,0,0,0.87);
    --anitoast-text-muted: rgba(0,0,0,0.4);
    --anitoast-radius: 10px;
    --anitoast-font: ui-sans-serif, system-ui, -apple-system, sans-serif;
    --anitoast-success: #17a34a;
    --anitoast-success-bg: #f0fdf4;
    --anitoast-success-border: #bbf7d0;
    --anitoast-error: #dc2626;
    --anitoast-error-bg: #fef2f2;
    --anitoast-error-border: #fecaca;
    --anitoast-warning: #d97706;
    --anitoast-warning-bg: #fffbeb;
    --anitoast-warning-border: #fde68a;
    --anitoast-info: #2563eb;
    --anitoast-info-bg: #eff6ff;
    --anitoast-info-border: #bfdbfe;
    --anitoast-loading: #6b7280;
  }

  [data-anitoast-theme="dark"] {
    --anitoast-bg: #1c1c1e;
    --anitoast-border: rgba(255,255,255,0.1);
    --anitoast-shadow: 0px 4px 24px rgba(0,0,0,0.4);
    --anitoast-text: rgba(255,255,255,0.9);
    --anitoast-text-muted: rgba(255,255,255,0.4);
    --anitoast-success-bg: #052e16;
    --anitoast-success-border: #166534;
    --anitoast-error-bg: #450a0a;
    --anitoast-error-border: #7f1d1d;
    --anitoast-warning-bg: #451a03;
    --anitoast-warning-border: #78350f;
    --anitoast-info-bg: #172554;
    --anitoast-info-border: #1e3a8a;
  }

  [data-anitoast-wrapper] {
    width: ${TOAST_WIDTH}px;
    list-style: none;
    padding: 0;
    margin: 0;
    outline: none;
    box-sizing: border-box;
    font-family: var(--anitoast-font);
    position: relative;
  }

  [data-anitoast-wrapper]::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: var(--gap-fill, 0px);
    bottom: 100%;
  }

  [data-anitoast-item] {
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${TOAST_WIDTH}px;
    box-sizing: border-box;
    background: var(--anitoast-bg);
    border: 1px solid var(--anitoast-border);
    border-radius: var(--anitoast-radius);
    box-shadow: var(--anitoast-shadow);
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: var(--anitoast-text);
    font-size: 14px;
    line-height: 1.4;
    cursor: default;
    user-select: none;
    transform: translateY(var(--y, 0px)) scale(var(--scale, 1));
    opacity: var(--opacity, 1);
    transition:
      transform 400ms cubic-bezier(0.215, 0.61, 0.355, 1),
      opacity   400ms ease,
      height    400ms cubic-bezier(0.215, 0.61, 0.355, 1);
    will-change: transform, opacity;
    overflow: hidden;
  }

  [data-anitoast-item][data-top="true"] {
    bottom: auto;
    top: 0;
  }

  [data-anitoast-item]:focus-visible {
    outline: none;
    box-shadow: var(--anitoast-shadow), 0 0 0 2px rgba(0,0,0,0.2);
  }

  [data-anitoast-item][data-rich-colors="true"][data-type="success"] {
    background: var(--anitoast-success-bg);
    border-color: var(--anitoast-success-border);
    color: var(--anitoast-success);
  }
  [data-anitoast-item][data-rich-colors="true"][data-type="error"] {
    background: var(--anitoast-error-bg);
    border-color: var(--anitoast-error-border);
    color: var(--anitoast-error);
  }
  [data-anitoast-item][data-rich-colors="true"][data-type="warning"] {
    background: var(--anitoast-warning-bg);
    border-color: var(--anitoast-warning-border);
    color: var(--anitoast-warning);
  }
  [data-anitoast-item][data-rich-colors="true"][data-type="info"] {
    background: var(--anitoast-info-bg);
    border-color: var(--anitoast-info-border);
    color: var(--anitoast-info);
  }

  .anitoast-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }
  .anitoast-icon svg { display: block; }

  [data-type="success"] .anitoast-icon { color: var(--anitoast-success); }
  [data-type="error"]   .anitoast-icon { color: var(--anitoast-error); }
  [data-type="warning"] .anitoast-icon { color: var(--anitoast-warning); }
  [data-type="info"]    .anitoast-icon { color: var(--anitoast-info); }
  [data-type="loading"] .anitoast-icon { color: var(--anitoast-loading); }
  [data-rich-colors="true"] .anitoast-icon { color: inherit; }

  .anitoast-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .anitoast-title {
    font-weight: 500;
    color: var(--anitoast-text);
    word-break: break-word;
  }
  [data-rich-colors="true"] .anitoast-title { color: inherit; }

  .anitoast-description {
    font-size: 13px;
    color: var(--anitoast-text-muted);
    word-break: break-word;
  }
  [data-rich-colors="true"] .anitoast-description { color: inherit; opacity: 0.8; }

  .anitoast-action-row {
    display: flex;
    gap: 8px;
    margin-top: 6px;
    align-items: center;
    flex-wrap: wrap;
  }

  .anitoast-action-btn {
    font-size: 13px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid var(--anitoast-border);
    background: var(--anitoast-bg);
    color: var(--anitoast-text);
    cursor: pointer;
    font-family: var(--anitoast-font);
    transition: opacity 0.15s;
  }
  .anitoast-action-btn:hover { opacity: 0.8; }
  .anitoast-action-btn.primary {
    background: var(--anitoast-text);
    color: var(--anitoast-bg);
    border-color: transparent;
  }

  .anitoast-close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 5px;
    border: 1px solid var(--anitoast-border);
    background: var(--anitoast-bg);
    color: var(--anitoast-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
    padding: 0;
    line-height: 1;
  }
  [data-anitoast-item]:hover .anitoast-close-btn,
  [data-anitoast-item]:focus-within .anitoast-close-btn { opacity: 1; }
  .anitoast-close-btn:hover { color: var(--anitoast-text); }

  /* Always show close button on touch devices (no hover available) */
  @media (hover: none) {
    .anitoast-close-btn { opacity: 1; }
  }

  .anitoast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    border-radius: 0 0 var(--anitoast-radius) var(--anitoast-radius);
    background: currentColor;
    opacity: 0.15;
    transform-origin: left;
  }

  @keyframes anitoast-spin {
    to { transform: rotate(360deg); }
  }
  .anitoast-spinner {
    animation: anitoast-spin 0.75s linear infinite;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    [data-anitoast-wrapper] {
      width: 100%;
    }

    [data-anitoast-item] {
      width: 100%;
      font-size: 15px;
    }

    .anitoast-action-btn {
      padding: 6px 12px;
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-anitoast-item] {
      transition: opacity 100ms ease;
    }
  }
`;

class Toaster {
  #toasts = [];
  #toasterEl = null;
  #listEl = null;
  #expanded = false;
  #hovered = false;
  #position = "bottom-right";
  #theme = "system";
  #richColors = false;
  #closeButton = false;
  #defaultDuration = TOAST_LIFETIME;
  #idCounter = 0;
  #resizeObserver = null;

  #generateId() {
    return `anitoast-${++this.#idCounter}-${Date.now()}`;
  }
  #isTop() {
    return this.#position.startsWith("top");
  }
  #isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  #getPositionStyles() {
    const mobile = this.#isMobile();
    const offset = mobile ? MOBILE_OFFSET : VIEWPORT_OFFSET;
    const s = { position: "fixed", zIndex: "999999" };

    s[this.#isTop() ? "top" : "bottom"] = `${offset}px`;

    if (mobile) {
      s.left = `${offset}px`;
      s.right = `${offset}px`;
    } else {
      if (this.#position.includes("right")) s.right = `${offset}px`;
      else if (this.#position.includes("left")) s.left = `${offset}px`;
      else {
        s.left = "50%";
        s.marginLeft = `-${TOAST_WIDTH / 2}px`;
      }
    }

    return s;
  }

  #applyPositionStyles() {
    if (!this.#toasterEl) return;
    ["top", "bottom", "left", "right", "marginLeft"].forEach((p) => {
      this.#toasterEl.style[p] = "";
    });
    Object.assign(this.#toasterEl.style, this.#getPositionStyles());

    if (this.#listEl) {
      const mobile = this.#isMobile();
      this.#listEl.querySelectorAll("[data-anitoast-item]").forEach((el) => {
        el.style.width = mobile ? "100%" : `${TOAST_WIDTH}px`;
      });
      this.#updateHeight();
    }
  }

  #injectStyles() {
    if (document.getElementById("anitoast-styles")) return;
    const style = document.createElement("style");
    style.id = "anitoast-styles";
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  #ensureToaster() {
    if (this.#toasterEl) return;
    this.#injectStyles();

    this.#toasterEl = document.createElement("section");
    this.#toasterEl.setAttribute("aria-label", "Notifications");
    this.#toasterEl.setAttribute("aria-relevant", "additions text");
    this.#toasterEl.setAttribute("aria-atomic", "false");
    if (this.#theme === "dark")
      this.#toasterEl.setAttribute("data-anitoast-theme", "dark");
    Object.assign(this.#toasterEl.style, this.#getPositionStyles());

    this.#listEl = document.createElement("ol");
    this.#listEl.setAttribute("data-anitoast-wrapper", "");
    this.#listEl.setAttribute("tabindex", "-1");
    this.#listEl.style.transition =
      "height 400ms cubic-bezier(0.215, 0.61, 0.355, 1)";

    this.#toasterEl.appendChild(this.#listEl);
    document.body.appendChild(this.#toasterEl);
    this.#setupInteractions();
    this.#setupResizeHandler();
  }

  #setupResizeHandler() {
    let rafId = null;
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        this.#applyPositionStyles();
        this.#updatePositions();
      });
    };
    window.addEventListener("resize", onResize, { passive: true });
  }

  #createToastEl(toast) {
    const li = document.createElement("li");
    li.setAttribute("data-anitoast-item", "");
    li.setAttribute("data-id", toast.id);
    li.setAttribute("data-type", toast.type || "default");
    li.setAttribute("data-top", String(this.#isTop()));
    li.setAttribute("role", "status");
    li.setAttribute("aria-live", "polite");
    li.setAttribute("aria-atomic", "true");
    li.setAttribute("tabindex", "0");
    if (this.#richColors || toast.richColors)
      li.setAttribute("data-rich-colors", "true");

    li.style.width = this.#isMobile() ? "100%" : `${TOAST_WIDTH}px`;

    if (toast.type && ICONS[toast.type] && toast.icon === undefined) {
      const d = document.createElement("div");
      d.className = "anitoast-icon";
      d.innerHTML = ICONS[toast.type];
      li.appendChild(d);
    } else if (toast.icon) {
      const d = document.createElement("div");
      d.className = "anitoast-icon";
      if (typeof toast.icon === "string") d.innerHTML = toast.icon;
      else if (toast.icon instanceof Element) d.appendChild(toast.icon);
      li.appendChild(d);
    }

    const content = document.createElement("div");
    content.className = "anitoast-content";

    const title = document.createElement("div");
    title.className = "anitoast-title";
    if (toast.title instanceof Element) title.appendChild(toast.title);
    else title.textContent = toast.title ?? "";
    content.appendChild(title);

    if (toast.description) {
      const desc = document.createElement("div");
      desc.className = "anitoast-description";
      if (toast.description instanceof Element)
        desc.appendChild(toast.description);
      else desc.textContent = toast.description;
      content.appendChild(desc);
    }

    if (toast.action || toast.cancel) {
      const row = document.createElement("div");
      row.className = "anitoast-action-row";
      if (toast.cancel) {
        const btn = document.createElement("button");
        btn.className = "anitoast-action-btn";
        btn.textContent = toast.cancel.label;
        btn.addEventListener("click", () => {
          toast.cancel.onClick?.();
          this.dismiss(toast.id);
        });
        row.appendChild(btn);
      }
      if (toast.action) {
        const btn = document.createElement("button");
        btn.className = "anitoast-action-btn primary";
        btn.textContent = toast.action.label;
        btn.addEventListener("click", () => {
          toast.action.onClick?.();
          this.dismiss(toast.id);
        });
        row.appendChild(btn);
      }
      content.appendChild(row);
    }

    li.appendChild(content);

    if (this.#closeButton || toast.closeButton) {
      const btn = document.createElement("button");
      btn.className = "anitoast-close-btn";
      btn.setAttribute("aria-label", "Close toast");
      btn.innerHTML = ICONS.close;
      btn.addEventListener("click", () => this.dismiss(toast.id));
      li.appendChild(btn);
    }

    if (
      toast.type !== "loading" &&
      toast.duration !== Infinity &&
      !toast._isPromise
    ) {
      const bar = document.createElement("div");
      bar.className = "anitoast-progress";
      bar.setAttribute("data-progress", "");
      li.appendChild(bar);
    }

    return li;
  }

  #updatePositions() {
    if (!this.#listEl) return;

    const visible = this.#toasts.filter((t) => !t.dismissed);
    const total = visible.length;

    visible.forEach((toast, i) => {
      const el = this.#listEl.querySelector(`[data-id="${toast.id}"]`);
      if (!el) return;

      const frontIndex = total - 1 - i;
      const isVisible = frontIndex < VISIBLE_TOASTS_AMOUNT;

      el.style.zIndex = String(total - frontIndex);

      if (this.#expanded) {
        const toastsInFront = visible.filter(
          (_, j) => total - 1 - j < frontIndex,
        );
        const yOffset = toastsInFront.reduce((sum, t) => {
          const el2 = this.#listEl.querySelector(`[data-id="${t.id}"]`);
          return sum + (el2 ? el2.offsetHeight + GAP : 64 + GAP);
        }, 0);

        const ySign = this.#isTop() ? 1 : -1;
        el.style.setProperty("--y", `${ySign * yOffset}px`);
        el.style.setProperty("--scale", "1");
        el.style.setProperty("--opacity", "1");
      } else {
        const ySign = this.#isTop() ? 1 : -1;
        const targetY = ySign * frontIndex * GAP;
        const scale = Math.max(0, 1 - frontIndex * 0.05);

        el.style.setProperty("--y", `${targetY}px`);
        el.style.setProperty("--scale", String(scale));
        el.style.setProperty("--opacity", isVisible ? "1" : "0");
      }
    });

    this.#updateHeight();
  }

  #updateHeight() {
    if (!this.#listEl) return;
    const visible = this.#toasts.filter((t) => !t.dismissed);

    if (this.#expanded) {
      const totalH = visible.reduce((sum, t) => {
        const el = this.#listEl.querySelector(`[data-id="${t.id}"]`);
        return sum + (el ? el.offsetHeight + GAP : 0);
      }, 0);
      this.#listEl.style.height = `${totalH}px`;
    } else {
      const frontToast = visible[visible.length - 1];
      const frontEl = frontToast
        ? this.#listEl.querySelector(`[data-id="${frontToast.id}"]`)
        : null;
      const back = visible.length - 1;
      this.#listEl.style.height = frontEl
        ? `${frontEl.offsetHeight + back * GAP}px`
        : "0px";
    }
  }

  #startTimer(toast) {
    if (toast.type === "loading" || toast.duration === Infinity) return;
    const duration = toast.duration ?? this.#defaultDuration;
    clearTimeout(toast._timer);
    toast._timerStart = Date.now();
    toast._timerRemaining = duration;
    toast._timer = setTimeout(() => {
      toast.onAutoClose?.(toast);
      this.dismiss(toast.id);
    }, duration);

    const bar = this.#listEl?.querySelector(
      `[data-id="${toast.id}"] [data-progress]`,
    );
    if (bar) {
      bar.style.transition = "none";
      bar.style.transform = "scaleX(1)";
      requestAnimationFrame(() => {
        bar.style.transition = `transform ${duration}ms linear`;
        bar.style.transform = "scaleX(0)";
      });
    }
  }

  #pauseTimer(toast) {
    if (!toast._timer) return;
    clearTimeout(toast._timer);
    toast._timerRemaining -= Date.now() - toast._timerStart;
    const bar = this.#listEl?.querySelector(
      `[data-id="${toast.id}"] [data-progress]`,
    );
    if (bar) {
      bar.style.transform = getComputedStyle(bar).transform;
      bar.style.transition = "none";
    }
  }

  #resumeTimer(toast) {
    if (toast.type === "loading" || toast.duration === Infinity) return;
    const remaining = toast._timerRemaining;
    if (!remaining || remaining <= 0) return;
    clearTimeout(toast._timer);
    toast._timerStart = Date.now();
    toast._timer = setTimeout(() => {
      toast.onAutoClose?.(toast);
      this.dismiss(toast.id);
    }, remaining);
    const bar = this.#listEl?.querySelector(
      `[data-id="${toast.id}"] [data-progress]`,
    );
    if (bar) {
      requestAnimationFrame(() => {
        bar.style.transition = `transform ${remaining}ms linear`;
        bar.style.transform = "scaleX(0)";
      });
    }
  }

  #setupInteractions() {
    let leaveTimer = null;

    this.#listEl.addEventListener("mouseenter", () => {
      clearTimeout(leaveTimer);
      this.#hovered = true;
      this.#expanded = true;
      this.#toasts.forEach((t) => this.#pauseTimer(t));
      this.#updatePositions();
    });

    this.#listEl.addEventListener("mouseleave", () => {
      this.#hovered = false;
      leaveTimer = setTimeout(() => {
        if (this.#hovered) return;
        this.#expanded = false;
        this.#toasts
          .filter((t) => !t.dismissed)
          .forEach((t) => this.#resumeTimer(t));
        this.#updatePositions();
      }, 50);
    });

    this.#listEl.addEventListener("focusin", () => {
      this.#expanded = true;
      this.#updatePositions();
    });

    this.#listEl.addEventListener("focusout", (e) => {
      if (!this.#listEl.contains(e.relatedTarget)) {
        this.#expanded = false;
        this.#updatePositions();
      }
    });
  }

  #setupSwipe(el, toast) {
    let startX = 0,
      startY = 0,
      deltaX = 0,
      startTime = 0,
      active = false;

    el.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      startX = e.clientX;
      startY = e.clientY;
      deltaX = 0;
      active = true;
      startTime = Date.now();
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", (e) => {
      if (!active) return;
      deltaX = e.clientX - startX;
      if (Math.abs(deltaX) < Math.abs(e.clientY - startY)) return;
      el.style.transition = "opacity 400ms ease";
      el.style.setProperty("--swipe-x", `${deltaX}px`);
      el.style.transform = `translateX(var(--swipe-x, 0px)) translateY(var(--y, 0px)) scale(var(--scale, 1))`;
      el.style.setProperty(
        "--opacity",
        String(Math.max(0, 1 - Math.abs(deltaX) / 200)),
      );
    });

    el.addEventListener("pointerup", () => {
      if (!active) return;
      active = false;
      const velocity = Math.abs(deltaX) / (Date.now() - startTime);

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY) {
        this.dismiss(toast.id);
      } else {
        el.style.transition = "";
        el.style.transform = "";
        el.style.removeProperty("--swipe-x");
        el.style.setProperty("--opacity", "1");
        this.#updatePositions();
      }
      deltaX = 0;
    });
  }

  #addToast(options) {
    this.#ensureToaster();
    const id = options.id ?? this.#generateId();

    const existing = this.#toasts.find((t) => t.id === id);
    if (existing) return this.#updateToast(id, options);

    const toast = {
      id,
      type: options.type ?? "default",
      title: options.title ?? "",
      description: options.description,
      duration: options.duration ?? this.#defaultDuration,
      action: options.action,
      cancel: options.cancel,
      icon: options.icon,
      closeButton: options.closeButton,
      richColors: options.richColors,
      onDismiss: options.onDismiss,
      onAutoClose: options.onAutoClose,
      _isPromise: options._isPromise ?? false,
      dismissed: false,
    };

    this.#toasts.push(toast);

    const el = this.#createToastEl(toast);
    const ySign = this.#isTop() ? -1 : 1;

    el.style.setProperty("--y", `${ySign * 100}px`);
    el.style.setProperty("--scale", "0.9");
    el.style.setProperty("--opacity", "0");
    el.style.transition = "none";

    this.#listEl.appendChild(el);
    el.offsetHeight;

    el.style.transition = "";
    this.#updatePositions();
    el.style.setProperty("--y", "0px");
    el.style.setProperty("--scale", "1");
    el.style.setProperty("--opacity", "1");

    this.#startTimer(toast);
    this.#setupSwipe(el, toast);
    return id;
  }

  #updateToast(id, options) {
    const toast = this.#toasts.find((t) => t.id === id);
    if (!toast) return id;
    Object.assign(toast, options);
    toast.id = id;

    const el = this.#listEl?.querySelector(`[data-id="${id}"]`);
    if (el) {
      const newEl = this.#createToastEl(toast);
      newEl.style.cssText = el.style.cssText;
      newEl.style.width = this.#isMobile() ? "100%" : `${TOAST_WIDTH}px`;
      el.replaceWith(newEl);
      this.#setupSwipe(newEl, toast);
      if (toast.type !== "loading") {
        clearTimeout(toast._timer);
        this.#startTimer(toast);
      }
    }
    return id;
  }

  dismiss(id) {
    if (id === undefined) {
      [...this.#toasts].forEach((t) => this.dismiss(t.id));
      return;
    }

    const toast = this.#toasts.find((t) => t.id === id);
    if (!toast || toast.dismissed) return;

    toast.dismissed = true;
    clearTimeout(toast._timer);
    toast.onDismiss?.(toast);

    const el = this.#listEl?.querySelector(`[data-id="${id}"]`);
    if (!el) {
      this.#removeToast(id);
      return;
    }

    const ySign = this.#isTop() ? -1 : 1;
    el.style.setProperty("--opacity", "0");
    el.style.setProperty("--y", `${ySign * 100}px`);
    el.style.setProperty("--scale", "0.9");

    this.#updatePositions();
  }

  #removeToast(id) {
    this.#toasts = this.#toasts.filter((t) => t.id !== id);
    if (this.#toasts.length === 0) this.#expanded = false;
  }

  message(message, options = {}) {
    return this.#addToast({ title: message, type: "default", ...options });
  }
  success(message, options = {}) {
    return this.#addToast({ title: message, type: "success", ...options });
  }
  error(message, options = {}) {
    return this.#addToast({ title: message, type: "error", ...options });
  }
  warning(message, options = {}) {
    return this.#addToast({ title: message, type: "warning", ...options });
  }
  info(message, options = {}) {
    return this.#addToast({ title: message, type: "info", ...options });
  }
  loading(message, options = {}) {
    return this.#addToast({
      title: message,
      type: "loading",
      duration: Infinity,
      ...options,
    });
  }

  promise(promise, options = {}) {
    const id = this.#addToast({
      title:
        options.loading?.title ??
        (typeof options.loading === "string" ? options.loading : "Loading..."),
      description: options.loading?.description,
      type: "loading",
      duration: Infinity,
      _isPromise: true,
    });

    promise
      .then((data) => {
        const s =
          typeof options.success === "function"
            ? options.success(data)
            : options.success;
        const resolved = typeof s === "string" ? { title: s } : (s ?? {});
        this.#updateToast(id, {
          type: "success",
          title: resolved.title ?? "Done!",
          description: resolved.description,
          duration: resolved.duration ?? this.#defaultDuration,
          _isPromise: false,
        });
        const t = this.#toasts.find((t) => t.id === id);
        if (t) this.#startTimer(t);
      })
      .catch((err) => {
        const e =
          typeof options.error === "function"
            ? options.error(err)
            : options.error;
        const rejected = typeof e === "string" ? { title: e } : (e ?? {});
        this.#updateToast(id, {
          type: "error",
          title: rejected.title ?? "Something went wrong",
          description: rejected.description,
          duration: rejected.duration ?? this.#defaultDuration,
          _isPromise: false,
        });
        const t = this.#toasts.find((t) => t.id === id);
        if (t) this.#startTimer(t);
      });

    return id;
  }

  /**
   * Initialize the toaster. Call once before using any toast methods.
   * @param {object}  [options]
   * @param {string}  [options.position='bottom-right']  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
   * @param {string}  [options.theme='system']            'light' | 'dark' | 'system'
   * @param {boolean} [options.richColors=false]
   * @param {boolean} [options.closeButton=false]
   * @param {number}  [options.duration=4000]
   * @param {object}  [options.style]
   */
  init(options = {}) {
    this.#position = options.position ?? "bottom-right";
    this.#richColors = options.richColors ?? false;
    this.#closeButton = options.closeButton ?? false;
    this.#defaultDuration = options.duration ?? TOAST_LIFETIME;
    this.#theme =
      options.theme === "system"
        ? window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : (options.theme ?? "light");

    if (this.#toasterEl) {
      this.#toasterEl.remove();
      this.#toasterEl = null;
      this.#listEl = null;
      this.#toasts = [];
    }

    this.#ensureToaster();
    if (options.style) Object.assign(this.#toasterEl.style, options.style);
  }
}

const toaster = new Toaster();

/**
 * toast — show a notification
 *
 * @example
 * import { toast } from 'anitoast';
 *
 * toast.init({ position: 'bottom-right', theme: 'system' });
 *
 * toast('Hello!');
 * toast.success('Saved!');
 * toast.error('Something went wrong', { description: 'Please try again.' });
 * toast.promise(fetch('/api/save'), { loading: 'Saving…', success: 'Saved!', error: 'Failed' });
 */
export const toast = Object.assign(
  (message, options) => toaster.message(message, options),
  {
    success: (m, o) => toaster.success(m, o),
    error: (m, o) => toaster.error(m, o),
    warning: (m, o) => toaster.warning(m, o),
    info: (m, o) => toaster.info(m, o),
    loading: (m, o) => toaster.loading(m, o),
    promise: (p, o) => toaster.promise(p, o),
    dismiss: (id) => toaster.dismiss(id),
    init: (o) => toaster.init(o),
  },
);

export default toast;

/**
 * @typedef {object} ToastOptions
 * @property {string}         [id]           Stable ID — reuses existing toast if matched
 * @property {string}         [description]
 * @property {number}         [duration]     ms, or Infinity to persist
 * @property {ActionOption}   [action]
 * @property {ActionOption}   [cancel]
 * @property {string|Element} [icon]
 * @property {boolean}        [closeButton]
 * @property {boolean}        [richColors]
 * @property {function}       [onDismiss]
 * @property {function}       [onAutoClose]
 *
 * @typedef {object} ActionOption
 * @property {string}   label
 * @property {function} onClick
 */
