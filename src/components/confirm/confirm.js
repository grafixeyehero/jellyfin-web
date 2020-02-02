define(["browser"], function(browser) {
    'use strict';

    if (browser.tv && window.confirm) {
        return require("components/confirm/nativeconfirm");
    } else {
        return require("components/confirm/browserconfirm");
    }
});
