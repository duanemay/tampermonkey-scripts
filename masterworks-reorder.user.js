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

    const artworksList = document.getElementsByClassName("_TradingOfferingCard_2v5v0_1");
    const newOrder = new Array(artworksList.length);
    const parents = new Array(artworksList.length);

    // make list
    for (let i = 0; i < artworksList.length; i++) {
        const artwork = artworksList[i];
        const diffStr = artwork.getElementsByClassName("_Price_2v5v0_110")[2].textContent;
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

function calculateTableView() {
    console.log("Masterworks: Table View Button Pushed");

    const tableArr = document.getElementsByClassName("_Table_1g9wa_1");
    const rows = tableArr[0].getElementsByTagName("tr");
    rows[0].getElementsByTagName("th")[3].getElementsByTagName("span")[0].innerHTML="Diff"

    // make list
    for (let i = 1; i < rows.length; i++) {
        const artworkRow = rows[i];
        const fields = artworkRow.getElementsByClassName("_right_153ao_1");
        const navStr = fields[0].textContent;
        const bidask = fields[1].textContent.split('/');

        console.log("navStr: " + navStr + " bid: " + bidask[0]+ " ask: " + bidask[1] );
        //const bid = parseInt(bidask[0]);
        const ask = parseFloat(bidask[1].replace('$', ''));
        const nav = parseFloat(navStr.replace('$', ''));

        const diff = nav - ask;
        fields[2].innerHTML= new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 2 }).format(diff);
        ;
        console.log("diff: " + diff + " = nav: " + nav+ " - ask: " + ask );
    }
}

async function scrollArtCollectorView() {
    console.log("Masterworks: Scroll Button Pushed");
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    var lastScrollHeight=document.body.scrollHeight;
    var noGrowCount = 0;

    for (var i = 0; i < 25; i++) {
        window.scrollBy(0,1000);
        console.log("---------------------------"+i+"----------------------------");
        console.log("pageYOffset: " + window.pageYOffset );
        console.log("innerHeight: " + window.innerHeight );
        console.log("document.body.scrollHeight: " +document.body.scrollHeight );
        console.log("noGrowCount: " + noGrowCount );
        const artworksList = document.getElementsByClassName("gFugFhg1");
        console.log("artworksList: " + artworksList.length );
        await sleep(1000);
        if (document.body.scrollHeight === lastScrollHeight) {
            if ( noGrowCount >= 5 ) {
                break;
            }
            noGrowCount++;
        } else {
            noGrowCount = 0;
        }
        lastScrollHeight = document.body.scrollHeight;
    }
    window.scrollTo(0,0);
    reorderArtCollectorView();
}

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    const sortButton = document.getElementById("djmSortButton");
    if (sortButton != null ) {
        return;
    }

    const sortGroup = document.getElementsByClassName("_FilterBarRight_mms9m_152");
    if (sortGroup == null || sortGroup.length === 0) {
        return;
    }

    console.log("Masterworks: Adding Sort Button");
    const sorter = document.createElement("div");
    sorter.id = "djmSortButton";
    sorter.innerHTML = "<button class='_Button_n57ib_1 _black_n57ib_323 _isStylish_n57ib_143 _outlined_n57ib_182 _rounded_n57ib_55 _small_n57ib_66' type='button'><span>Sort By Deal</span></button>";
    sortGroup[0].prepend(sorter);
    sorter.onclick = reorderArtCollectorView;

    console.log("Masterworks: Adding Load Button");
    const loader = document.createElement("div");
    loader.id = "djmLoadButton";
    loader.innerHTML = "<button class='_Button_n57ib_1 _black_n57ib_323 _isStylish_n57ib_143 _outlined_n57ib_182 _rounded_n57ib_55 _small_n57ib_66' type='button'><span>Load All</span></button>";
    sortGroup[0].prepend(loader);
    loader.onclick = scrollArtCollectorView;

    console.log("Masterworks: Adding Table Button");
    const table = document.createElement("div");
    table.id = "djmLoadButton";
    table.innerHTML = "<button class='_Button_n57ib_1 _black_n57ib_323 _isStylish_n57ib_143 _outlined_n57ib_182 _rounded_n57ib_55 _small_n57ib_66' type='button'><span>Table View</span></button>";
    sortGroup[0].prepend(table);
    table.onclick = calculateTableView;
}

(function () {
    'use strict';
    const observer = new MutationObserver(callback);

    // Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};
    observer.observe(document, config);
    console.log("Masterworks: Added Observer");
})();
