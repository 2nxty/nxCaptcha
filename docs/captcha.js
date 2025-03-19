(function() {
    // Function to create and inject the CAPTCHA
    function initCaptcha() {
        const overlay = document.createElement('div');
        overlay.id = 'captchaOverlay';
        overlay.className = 'captcha-overlay';

        const container = document.createElement('div');
        container.id = 'captchaContainer';
        container.className = 'captcha-container';

        // CAPTCHA internal HTML
        container.innerHTML = `
            <div class="captcha-header">Verify you are human</div>
            <div class="captcha-puzzle">
                <p id="captchaPuzzleText"></p>
                <input type="number" id="captchaPuzzleInput" placeholder="Enter the answer">
            </div>
            <div class="captcha-checkbox">
                <input type="checkbox" id="captchaCheck" name="captchaCheck">
                <label for="captchaCheck">I am not a robot</label>
            </div>
            <div id="captchaResult" class="captcha-result"></div>
            <div class="captcha-footer">
                Powered by <a target="_blank" href="https://github.com/2nxty/nxCaptcha">nxCaptcha</a>
            </div>
        `;

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // Inject CSS dynamically
        const style = document.createElement('style');
        style.textContent = `
            .captcha-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999;
                display: none;
            }
            .captcha-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(20, 35, 40, 0.9);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 25px 35px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(56, 163, 165, 0.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                text-align: left;
                z-index: 1000;
            }
            .captcha-header {
                font-size: 1.3em;
                font-weight: 500;
                margin-bottom: 20px;
                color: #e6f3f3;
                line-height: 1.4;
            }
            .captcha-puzzle {
                margin-bottom: 20px;
            }
            .captcha-puzzle p {
                color: #c2ebeb;
                margin: 0 0 10px 0;
            }
            .captcha-puzzle input {
                width: 100%;
                padding: 8px;
                border: 1px solid rgba(56, 163, 165, 0.3);
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
                color: #e6f3f3;
                font-size: 1em;
            }
            .captcha-puzzle input:focus {
                outline: none;
                border-color: #38a3a5;
            }
            .captcha-checkbox {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                background: rgba(56, 163, 165, 0.1);
                padding: 12px;
                border-radius: 8px;
                border: 1px solid rgba(56, 163, 165, 0.3);
            }
            .captcha-checkbox input[type="checkbox"] {
                margin-right: 12px;
                width: 24px;
                height: 24px;
                cursor: pointer;
                accent-color: #38a3a5;
                border-radius: 4px;
                background: #fff;
            }
            .captcha-checkbox label {
                font-size: 1em;
                color: #c2ebeb;
                cursor: pointer;
            }
            .captcha-footer {
                font-size: 0.85em;
                color: #80c4c6;
                margin-top: 15px;
            }
            .captcha-footer a {
                color: #38a3a5;
                text-decoration: none;
            }
            .captcha-footer a:hover {
                text-decoration: none;
            }
            .captcha-result {
                font-size: 0.9em;
                margin-top: 10px;
                text-align: center;
            }
            .captcha-success {
                color: #57cc99;
                font-weight: 500;
            }
            .captcha-error {
                color: #ff6b6b;
            }
            .captcha-loading::after {
                content: '';
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #38a3a5;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s linear infinite;
                margin-left: 8px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to update the puzzle
    function updatePuzzle(container) {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;

        const puzzleText = document.getElementById('captchaPuzzleText');
        puzzleText.textContent = `What is ${num1} + ${num2}?`;
        container.dataset.correctAnswer = answer;
    }

    // Internal function to show the CAPTCHA
    function showCaptchaInternal(element, eventType, originalListeners, originalEvent) {
        const captchaOverlay = document.getElementById('captchaOverlay');
        const captchaCheck = document.getElementById('captchaCheck');
        const captchaPuzzleInput = document.getElementById('captchaPuzzleInput');
        const captchaResult = document.getElementById('captchaResult');
        const captchaContainer = document.getElementById('captchaContainer');

        if (!captchaOverlay) {
            initCaptcha();
            showCaptchaInternal(element, eventType, originalListeners, originalEvent);
            return;
        }

        captchaOverlay.style.display = 'block';
        captchaCheck.checked = false;
        captchaPuzzleInput.value = '';
        captchaResult.textContent = '';

        updatePuzzle(captchaContainer);

        captchaOverlay.onclick = function(e) {
            if (e.target === captchaOverlay) {
                e.preventDefault();
            }
        };

        captchaCheck.onclick = function() {
            const userAnswer = parseInt(captchaPuzzleInput.value, 10);
            const correctAnswer = parseInt(captchaContainer.dataset.correctAnswer, 10);

            if (captchaCheck.checked && userAnswer === correctAnswer) {
                captchaResult.textContent = 'Verifying';
                captchaResult.className = 'captcha-result captcha-loading';

                setTimeout(() => {
                    captchaResult.textContent = 'Verified!';
                    captchaResult.className = 'captcha-result captcha-success';

                    setTimeout(() => {
                        captchaOverlay.style.display = 'none';
                        // Execute the captured original listeners
                        if (originalListeners && originalListeners.length > 0) {
                            originalListeners.forEach(listener => {
                                listener.call(element, originalEvent); // Call each listener in the element's context
                            });
                        } else if (eventType === 'submit' && element.tagName === 'FORM') {
                            element.submit(); // Submit the form if no listeners exist
                        }
                    }, 1000);
                }, 1500);
            } else {
                captchaResult.textContent = 'Try again.';
                captchaResult.className = 'captcha-result captcha-error';
                captchaCheck.checked = false;
                captchaPuzzleInput.value = '';
                updatePuzzle(captchaContainer);
            }
        };
    }

    // Public function to manually show the CAPTCHA
    window.showCaptcha = function(callback) {
        const shouldShowCaptcha = Math.random() < 0.3; // 1/50 = 0.02
        if (!shouldShowCaptcha) {
            callback(true);
            return;
        }
        showCaptchaInternal(null, null, null, null);
    };

    // Function to protect elements with CAPTCHA
    window.protectWithCaptcha = function(selector, eventType = 'click') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            let isVerified = false; // Flag to check if CAPTCHA has been passed
            let originalListeners = []; // Store original listeners

            // Capture existing listeners by temporarily overriding addEventListener
            const originalAddEventListener = element.addEventListener;
            element.addEventListener = function(type, listener, options) {
                if (type === eventType) {
                    originalListeners.push(listener);
                }
                originalAddEventListener.call(this, type, listener, options);
            };

            const captchaHandler = function(e) {
                // For keypress, only trigger CAPTCHA if the key is Enter
                if (eventType === 'keypress' && e.key !== 'Enter') {
                    return; // Ignore if not Enter
                }

                if (isVerified) {
                    // If already verified, let original listeners proceed normally
                    return;
                }

                const shouldShowCaptcha = Math.random() < 0.3; // 1/50 = 0.02
                if (!shouldShowCaptcha) {
                    // If CAPTCHA doesn't show, let original listeners proceed
                    return;
                }

                e.preventDefault(); // Prevent default action
                e.stopImmediatePropagation(); // Stop other listeners

                showCaptchaInternal(element, eventType, originalListeners, e);
                // Restore addEventListener after the first CAPTCHA call
                element.addEventListener = originalAddEventListener;
                isVerified = true; // Mark as verified after passing CAPTCHA
            };

            // Add the CAPTCHA listener
            element.addEventListener(eventType, captchaHandler, { capture: true });
        });
    };

    // Automatic usage example
    document.addEventListener('DOMContentLoaded', () => {
        window.protectWithCaptcha('form', 'submit');
        window.protectWithCaptcha('.protected-button', 'click');
        window.protectWithCaptcha('.protected-input', 'keypress');
    });
})();