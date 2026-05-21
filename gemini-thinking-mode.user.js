// ==UserScript==
// @name         Gemini Auto-Select Extended Thinking Mode
// @namespace   duanemay/gemini-thinking
// @version      5.0
// @description  Automatically navigates the nested menu to select "Extended" (Thinking) mode on gemini.google.com.
// @author       Duane May
// @match        https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const MENU_BUTTON_SELECTOR = 'button[data-test-id="bard-mode-menu-button"]';
    const TARGET_MODE_TEXT = 'Extended';

    let scriptExecuted = false;

    function attemptModeSwitch() {
        if (scriptExecuted) return;

        const modeButton = document.querySelector(MENU_BUTTON_SELECTOR);
        if (!modeButton) return;

        const currentText = modeButton.textContent.trim();

        if (currentText.includes(TARGET_MODE_TEXT)) {
            console.log("Gemini Auto-Select: Already in Extended mode.");
            scriptExecuted = true;
            return;
        }

        console.log(`Gemini Auto-Select: Current mode is '${currentText}'. Opening menu...`);
        modeButton.click();
        waitForDropdownAndClick();
        scriptExecuted = true;
    }

    function waitForDropdownAndClick() {
        let attempts = 0;
        const maxAttempts = 40; // Max 4 seconds of waiting (accounts for two animations)
        let submenuOpened = false;

        const checkDropdown = setInterval(() => {
            attempts++;

            // Grab all current menu items, including those in newly rendered submenus
            const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], [role="menuitemradio"]'));

            // Step 1: Look for the final, selectable "Extended" option (the leaf node)
            const leafOption = menuItems.find(item => {
                const text = item.textContent.toLowerCase();
                const isTargetText = text.includes('extended') || text.includes('complex problem solving');
                // A leaf node should NOT have aria-haspopup set to true/menu
                const isTrigger = item.hasAttribute('aria-haspopup') && item.getAttribute('aria-haspopup') !== 'false';
                return isTargetText && !isTrigger;
            });

            if (leafOption) {
                console.log("Gemini Auto-Select: Found final Extended option. Clicking...");
                leafOption.click();
                clearInterval(checkDropdown);
                return;
            }

            // Step 2: If the leaf node isn't visible yet, look for the submenu trigger and open it
            if (!submenuOpened) {
                const submenuTrigger = menuItems.find(item => {
                    const text = item.textContent.toLowerCase();
                    const isTrigger = item.hasAttribute('aria-haspopup') && item.getAttribute('aria-haspopup') !== 'false';
                    return isTrigger && (text.includes('thinking') || text.includes('extended'));
                });

                if (submenuTrigger) {
                    console.log("Gemini Auto-Select: Found Thinking submenu trigger. Opening...");

                    // Angular Material submenus often require mouse events to trigger properly
                    submenuTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
                    submenuTrigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
                    submenuTrigger.click();

                    submenuOpened = true; // Mark as opened so we don't spam events on it while waiting for the animation
                }
            }

            // Timeout fallback
            if (attempts >= maxAttempts) {
                console.log("Gemini Auto-Select: Timeout. Could not find the final Extended option.");
                clearInterval(checkDropdown);
                const menuButton = document.querySelector(MENU_BUTTON_SELECTOR);
                if (menuButton) menuButton.click(); // Clean up by closing the menu
            }
        }, 100);
    }

    const observer = new MutationObserver(() => {
        if (!scriptExecuted && document.querySelector(MENU_BUTTON_SELECTOR)) {
            setTimeout(attemptModeSwitch, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(attemptModeSwitch, 500);
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            scriptExecuted = false;
        }
    }).observe(document, {subtree: true, childList: true});

})();