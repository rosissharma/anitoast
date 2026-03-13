# anitoast

A lightweight, framework-agnostic toast notification library. Zero dependencies. Animated via CSS transitions.

## Installation

```bash
npm install anitoast
```

## Usage

```js
import { toast } from 'anitoast';

// Initialize once
toast.init({ position: 'bottom-right', theme: 'system' });

// Show toasts
toast('Hello world');
toast.success('Changes saved!');
toast.error('Something went wrong');
toast.warning('Disk space low');
toast.info('New version available');
```

## API

### `toast.init(options)`

Call once before showing any toasts, typically at app startup.

| Option       | Type    | Default          | Description                                                                           |
|--------------|---------|------------------|---------------------------------------------------------------------------------------|
| `position`   | string  | `'bottom-right'` | `'top-left'` \| `'top-center'` \| `'top-right'` \| `'bottom-left'` \| `'bottom-center'` \| `'bottom-right'` |
| `theme`      | string  | `'system'`        | `'light'` \| `'dark'` \| `'system'`                                                 |
| `richColors` | boolean | `false`          | Colored backgrounds for success / error / warning / info types                      |
| `closeButton`| boolean | `false`          | Show a close button on every toast                                                    |
| `duration`   | number  | `4000`           | Default auto-dismiss duration in ms                                                   |
| `style`      | object  | —                | Inline styles applied to the toaster container                                        |

### Toast methods

```js
toast(message, options?)           // plain message
toast.success(message, options?)
toast.error(message, options?)
toast.warning(message, options?)
toast.info(message, options?)
toast.loading(message, options?)   // persists until dismissed or updated
toast.dismiss(id?)                 // dismiss one or all
```

### `toast.promise(promise, options)`

Shows a loading toast while the promise is pending, then transitions to success or error.

```js
toast.promise(
  fetch('/api/save').then(r => r.json()),
  {
    loading: 'Saving…',
    success: (data) => `Saved ${data.name}!`,
    error:   (err)  => `Failed: ${err.message}`,
  }
);
```

### Per-toast options

| Option        | Type              | Description                                  |
|---------------|-------------------|----------------------------------------------|
| `id`          | string            | Stable ID - reuses an existing toast if matched |
| `description` | string \| Element | Secondary text below the title               |
| `duration`    | number            | Override default duration. `Infinity` to persist |
| `action`      | `ActionOption`    | Primary action button                        |
| `cancel`      | `ActionOption`    | Secondary cancel button                      |
| `icon`        | string \| Element | Custom icon (HTML string or DOM element)     |
| `closeButton` | boolean           | Show close button on this toast only         |
| `richColors`  | boolean           | Rich colors on this toast only              |
| `onDismiss`   | function          | Called when dismissed (any reason)           |
| `onAutoClose` | function          | Called only on auto-dismiss                  |

```js
// ActionOption shape
{ label: string, onClick: () => void }
```

### Action & cancel buttons

```js
toast.error('Failed to save', {
  action: { label: 'Retry',  onClick: () => save() },
  cancel: { label: 'Ignore', onClick: () => {} },
});
```

## Theming

All colors, fonts, and shadows are controlled via CSS custom properties on `:root`. Override them in your own stylesheet:

```css
:root {
  --anitoast-bg:      #ffffff;
  --anitoast-border:  rgba(0,0,0,0.08);
  --anitoast-shadow:  0 4px 12px rgba(0,0,0,0.1);
  --anitoast-text:    rgba(0,0,0,0.87);
  --anitoast-radius:  10px;
  --anitoast-font:    ui-sans-serif, system-ui, sans-serif;

  --anitoast-success: #17a34a;
  --anitoast-error:   #dc2626;
  --anitoast-warning: #d97706;
  --anitoast-info:    #2563eb;
}
```

## License

MIT
