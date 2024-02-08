// ==UserScript==
// @name        Edgenuity Auto-Advance
// @namespace   duanemay/edgenuity
// @description  Auto-Advance through pages on Edgenuity after a video is completed.
// @match        https://student.edgenuity.com/enrollment/*
// @version     0.0.1
// @grant       none
// @run-at       document-start
// ==/UserScript==

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    let nextButton = document.getElementsByClassName("FrameRight");
    if (nextButton.length > 0) {
        nextButton[0].click();
    }
};

(function () {
    'use strict';
    const observer = new MutationObserver(callback);

    // Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};
    observer.observe(document, config);
    console.log("Gmail: Added Observer");
})();