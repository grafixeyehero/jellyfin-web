define(["browser"], function(browser) {
    'use strict';

    if ((browser.tv || browser.xboxOne) && window.confirm) {
        return require("components/prompt/nativeprompt");
    } else {
        return require("components/prompt/browserprompt");
    }
});
