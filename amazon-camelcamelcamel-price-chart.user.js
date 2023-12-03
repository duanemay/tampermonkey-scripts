// ==UserScript==
// @name        Amazon Price Variation (Fork)
// @namespace   duanemay/camelcamelcamel-price-chart
// @description Embeds CamelCamelCamel price chart in Amazon
// @author       Duane May
// @include     http://www.amazon.*/*
// @include     https://www.amazon.*/*
// @include     http://smile.amazon.*/*
// @include     https://smile.amazon.*/*
// @version     0.0.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// ==/UserScript==

var width = 500;
var height = 200;
var duration = "1y";

//Possible other values are "amazon", "amazon-new", "new", "used", "new-used", & "amazon-new-used"
var chart = "amazon-new-used";

$(document).ready(function () {
    var element = $(':input[name="ASIN"]');
    var arr = document.domain.split(".");
    var country = arr[arr.length - 1];
    if (country == "com") {
        country = "us";
    }

    if (element) {
        var prot = window.location.protocol;
        var asin = $.trim(element.attr("value"));

        var camelCamelCamelElement = document.createElement("div");
        camelCamelCamelElement.id = "camelCamelCamelChart";
        camelCamelCamelElement.style = "width: 100%; height: 100%;";

        camelCamelCamelElement.innerHTML = "<div id='camelcamelcamel' style='margin-top: 0px; margin-left: 0px'>" +
            "<a target='blank' href='" + prot + "//" + country + ".camelcamelcamel.com/product/" + asin + "'>" +
            "<img src='" + prot + "//charts.camelcamelcamel.com/" + country + "/" + asin + "/" + chart + ".png?force=1&zero=0&w=" + width + "&h=" + height + "&desired=false&legend=1&ilt=1&tp=" + duration + "&fo=0'/>" +
            "</a>" +
            "</div>";

        $("#apex_desktop").parent().children("hr")[0].after(camelCamelCamelElement)
    }
});