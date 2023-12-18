// ==UserScript==
// @name         Masterworks: Reorder Art Collector View
// @namespace   duanemay/masterworks-reorder
// @description  Reorder Art Collector View on Masterworks website to be in deal order.
// @author       Duane May
// @match        http*://www.masterworks.com/*
// @match        https://www.masterworks.com/trading/bulletin
// @icon         https://www.google.com/s2/favicons?sz=64&domain=masterworks.com
// @run-at       document-start
// ==/UserScript==

class Item {
    constructor(value, element) {
        this.value = value;
        this.element = element;
    }
}

function reorderArtCollectorView() {
    console.log("Masterworks: Sort Button Pushed");

    const artworksList = document.getElementsByClassName("gFugFhg1");
    const newOrder = new Array(artworksList.length);
    const parents = new Array(artworksList.length);

    // make list
    for (let i = 0; i < artworksList.length; i++) {
        const artwork = artworksList[i];
        const diffStr = artwork.getElementsByClassName("wRV7IASH")[2].textContent;
        const diff = parseInt(diffStr)

        const parentNode = artwork.parentElement;
        parents[i] = parentNode;
        newOrder[i] = new Item(diff, artwork)
    }

    // sort it
    newOrder.sort((a, b) => {
        return a.value - b.value|| isNaN(a.value)-isNaN(b.value);
    });
    console.log("Masterworks: sorted " + newOrder.map(a => a.value));

    // reorder
    for (let i = 0; i < artworksList.length; i++) {
        const parent = parents[i]
        const item = newOrder[i]
        const artwork = item.element
        //console.log("Masterworks: moving " + item.value);
        parent.appendChild(artwork)
    }
}

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    const sortButton = document.getElementById("djmSortButton");
    if (sortButton != null ) {
        return;
    }

    const sortGroup = document.getElementsByClassName("gAebKtEk");
    if (sortGroup == null || sortGroup.length === 0) {
        return;
    }

    console.log("Masterworks: Adding Sort Button");
    const sorter = document.createElement("div");
    sorter.id = "djmSortButton";
    sorter.innerHTML = "<button class='sL96TSVm Vx6nb5OH mC1H5K_4 PIQUKgz1 _Gek7j7p Xxlsk2KX' type='button'><span>Sort By Deal</span></button>";
    sortGroup[0].prepend(sorter);
    sorter.onclick = reorderArtCollectorView;
}

(function () {
    'use strict';
    const observer = new MutationObserver(callback);

    // Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};
    observer.observe(document, config);
    console.log("Masterworks: Added Observer");
})();
