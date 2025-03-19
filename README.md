# nxCaptcha Documentation

## Overview

`nxCaptcha` is a lightweight JavaScript library that adds a simple CAPTCHA verification to HTML elements such as forms, buttons, and inputs. It intercepts specified events (`submit`, `click`, or `keypress`) and displays a CAPTCHA in 30% of first attempts. Once verified, the CAPTCHA does not reappear for that element, allowing the original event listeners or default behavior to proceed.

### Features
- **Customizable Events**: Protects `submit` (forms), `click` (buttons), and `keypress` (inputs) events.
- **Single Verification**: CAPTCHA only appears once per element; subsequent events proceed without interruption.
- **Enter-Only Keypress**: For `keypress`, the CAPTCHA triggers only when the "Enter" key is pressed.
- **Dynamic Styling**: Includes built-in CSS for a modern, blurred-background overlay.
- **Listener Support**: Captures and executes existing event listeners after CAPTCHA verification.

## Installation

1. **Include in HTML**: Add the script before the `</body>` in your HTML file using a `<script>` tag.

```html
<script src="https://celestia-dred.nxty.cc/captcha.js"></script>
```

Ensure the script is loaded after your HTML elements or use the `DOMContentLoaded` event to apply protections (see examples below).

## Usage

### Basic Setup
The library automatically applies CAPTCHA protection to elements with specific selectors when the `DOMContentLoaded` event fires. By default, it protects:
- All `<form>` elements for the `submit` event.
- Elements with class `.protected-button` for the `click` event.
- Elements with class `.protected-input` for the `keypress` event (Enter key only).

To use the default setup, simply include the script:

```html
<!DOCTYPE html>
<html>
<head>
    <title>CAPTCHA Test</title>
</head>
<body>
    <form action="/submit" method="POST">
        <input type="text" name="example">
        <button type="submit">Submit</button>
    </form>
    <button class="protected-button" onclick="alert('Button clicked!')">Click here</button>
    <input type="text" class="protected-input" placeholder="Press Enter">
    <script src="https://celestia-dred.nxty.cc/captcha.js"></script>
</body>
</html>
```

### Custom Protection
To apply CAPTCHA protection to specific elements or events, use the `protectWithCaptcha` function manually:

#### Syntax
```javascript
window.protectWithCaptcha(selector, eventType)
```

- **`selector`**: A CSS selector string (e.g., `#myForm`, `.my-button`) to target elements.
- **`eventType`**: The event to protect (`'submit'`, `'click'`, or `'keypress'`). Defaults to `'click'`.

#### Example
```html
<!DOCTYPE html>
<html>
<head>
    <title>CAPTCHA Test</title>
</head>
<body>
    <form id="myForm" action="/submit" method="POST">
        <input type="text" name="example">
        <button type="submit">Submit</button>
    </form>
    <button id="myButton" onclick="alert('Button clicked!')">Click here</button>
    <input id="myInput" type="text" placeholder="Press Enter">
    <script src="https://celestia-dred.nxty.cc/captcha.js"></script>
    <script>
        // Protect specific elements
        protectWithCaptcha('#myForm', 'submit');
        protectWithCaptcha('#myButton', 'click');
        protectWithCaptcha('#myInput', 'keypress');

        // Optional: Add a listener for the input
        document.getElementById('myInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                alert('Enter pressed!');
            }
        });
    </script>
</body>
</html>
```

### Manual CAPTCHA Trigger
To trigger the CAPTCHA manually (e.g., for testing or custom logic), use the `showCaptcha` function:

#### Syntax
```javascript
window.showCaptcha(callback)
```

- **`callback`**: A function called with `true` if the CAPTCHA passes or if it doesn’t show (60% chance).

#### Example
```html
<button onclick="showCaptcha((success) => { if (success) alert('CAPTCHA passed!'); })">
    Test CAPTCHA
</button>
<script src="https://celestia-dred.nxty.cc/captcha.js"></script>
```

## Behavior

- **Verification**: Once passed, the CAPTCHA won’t reappear for that element (except after page reload).
- **Events**:
  - `submit`: Protects form submissions. If no listeners exist, submits the form.
  - `click`: Protects button clicks. Executes inline `onclick` or registered listeners.
  - `keypress`: Protects inputs, triggering only on "Enter". Executes listeners if present.
- **Listeners**: Captures listeners added before `protectWithCaptcha` is called and executes them after verification.

## Example Scenarios

### Form Submission
```html
<form id="myForm" action="/submit" method="POST">
    <input type="text" name="example">
    <button type="submit">Submit</button>
</form>
<script src="https://celestia-dred.nxty.cc/captcha.js"></script>
<script>
    protectWithCaptcha('#myForm', 'submit');
</script>
```
- On submit, 30% chance of CAPTCHA on first attempt. After passing, the form submits.

### Button Click
```html
<button class="protected-button" onclick="alert('Button clicked!')">Click here</button>
<script src="https://celestia-dred.nxty.cc/captcha.js"></script>
```
- On click, 30% chance of CAPTCHA on first attempt. After passing, shows "Button clicked!".

## Notes

- **Listener Capture**: Only listeners added before `protectWithCaptcha` is called are captured. Listeners added afterward won’t be intercepted unless manually re-applied with `protectWithCaptcha`.
- **Order**: Include `<script src="https://celestia-dred.nxty.cc/captcha.js"></script>` after your HTML elements or listeners to ensure proper initialization.
