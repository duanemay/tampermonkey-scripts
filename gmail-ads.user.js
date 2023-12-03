// ==UserScript==
// @name        Gmail Ads
// @namespace   duanemay/gmail-ads
// @description Skips over the ad rows from Gmail
// @match        https://mail.google.com/mail/u/*
// @match        https://mail.google.com/mail/u/*
// @version     0.0.2
// @grant       none
// @run-at       document-start
// ==/UserScript==

var countAdsRemoved = 0;

function gmailRemoveAds() {
    const adBadges = document.getElementsByClassName("ast");
    for (let i = 0; i < adBadges.length; i++) {
        const adBadge = adBadges[i];

        var trNode = adBadge.parentElement;
        while (trNode != null && trNode.nodeName != "TR") {
            trNode = trNode.parentElement;
        }

        if (trNode.nodeName == "TR") {
            if (trNode.style.display != "none") {
                trNode.style.display = "none";
                countAdsRemoved++;
                console.log("Gmail: Removed an ad, " + countAdsRemoved + " total.");
            }
        }
    }
}

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    const messageLists = document.getElementsByClassName("Cp");
    if (messageLists.length === 0) {
        return;
    }

    gmailRemoveAds();
};

(function () {
    'use strict';
    const observer = new MutationObserver(callback);

    // Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};
    observer.observe(document, config);
    console.log("Gmail: Added Observer");
})();