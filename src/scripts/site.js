function getWindowLocationSearch(win) {
    "use strict";

    var search = (win || window).location.search;

    if (!search) {
        var index = window.location.href.indexOf("?");

        if (-1 != index) {
            search = window.location.href.substring(index);
        }
    }

    return search || "";
}

function getParameterByName(name, url) {
    "use strict";

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS, "i");
    var results = regex.exec(url || getWindowLocationSearch());

    if (null == results) {
        return "";
    }

    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function pageClassOn(eventName, className, fn) {
    "use strict";

    document.addEventListener(eventName, function (event) {
        var target = event.target;

        if (target.classList.contains(className)) {
            fn.call(target, event);
        }
    });
}

function pageIdOn(eventName, id, fn) {
    "use strict";

    document.addEventListener(eventName, function (event) {
        var target = event.target;

        if (target.id === id) {
            fn.call(target, event);
        }
    });
}

var Dashboard = {
    getCurrentUser: function () {
        return window.ApiClient.getCurrentUser(false);
    },

    //TODO: investigate url prefix support for serverAddress function
    serverAddress: function () {
        if (AppInfo.isNativeApp) {
            var apiClient = window.ApiClient;

            if (apiClient) {
                return apiClient.serverAddress();
            }

            return null;
        }

        var urlLower = window.location.href.toLowerCase();
        var index = urlLower.lastIndexOf("/web");

        if (-1 != index) {
            return urlLower.substring(0, index);
        }

        var loc = window.location;
        var address = loc.protocol + "//" + loc.hostname;

        if (loc.port) {
            address += ":" + loc.port;
        }

        return address;
    },
    getCurrentUserId: function () {
        var apiClient = window.ApiClient;

        if (apiClient) {
            return apiClient.getCurrentUserId();
        }

        return null;
    },
    onServerChanged: function (userId, accessToken, apiClient) {
        apiClient = apiClient || window.ApiClient;
        window.ApiClient = apiClient;
    },
    logout: function () {
        ConnectionManager.logout().then(function () {
            var loginPage;

            if (AppInfo.isNativeApp) {
                loginPage = "selectserver.html";
                window.ApiClient = null;
            } else {
                loginPage = "login.html";
            }

            Dashboard.navigate(loginPage);
        });
    },
    getConfigurationPageUrl: function (name) {
        return "configurationpage?name=" + encodeURIComponent(name);
    },
    getConfigurationResourceUrl: function (name) {
        if (AppInfo.isNativeApp) {
            return ApiClient.getUrl("web/ConfigurationPage", {
                name: name
            });
        }

        return Dashboard.getConfigurationPageUrl(name);
    },
    navigate: function (url, preserveQueryString) {
        if (!url) {
            throw new Error("url cannot be null or empty");
        }

        var queryString = getWindowLocationSearch();

        if (preserveQueryString && queryString) {
            url += queryString;
        }

        return new Promise(function (resolve, reject) {
            require(["appRouter"], function (appRouter) {
                return appRouter.show(url).then(resolve, reject);
            });
        });
    },
    navigate_direct: function (path) {
        return new Promise(function (resolve, reject) {
            require(["appRouter"], function (appRouter) {
                return appRouter.showDirect(path).then(resolve, reject);
            });
        });
    },
    processPluginConfigurationUpdateResult: function () {
        require(["loading", "toast"], function (loading, toast) {
            loading.hide();
            toast(Globalize.translate("MessageSettingsSaved"));
        });
    },
    processServerConfigurationUpdateResult: function (result) {
        require(["loading", "toast"], function (loading, toast) {
            loading.hide();
            toast(Globalize.translate("MessageSettingsSaved"));
        });
    },
    processErrorResponse: function (response) {
        require(["loading"], function (loading) {
            loading.hide();
        });

        var status = "" + response.status;

        if (response.statusText) {
            status = response.statusText;
        }

        Dashboard.alert({
            title: status,
            message: response.headers ? response.headers.get("X-Application-Error-Code") : null
        });
    },
    alert: function (options) {
        if ("string" == typeof options) {
            return void require(["toast"], function (toast) {
                toast({
                    text: options
                });
            });
        }

        require(["alert"], function (alert) {
            alert({
                title: options.title || Globalize.translate("HeaderAlert"),
                text: options.message
            }).then(options.callback || function () {});
        });
    },
    restartServer: function () {
        var apiClient = window.ApiClient;

        if (apiClient) {
            require(["serverRestartDialog", "events"], function (ServerRestartDialog, events) {
                var dialog = new ServerRestartDialog({
                    apiClient: apiClient
                });
                events.on(dialog, "restarted", function () {
                    if (AppInfo.isNativeApp) {
                        apiClient.ensureWebSocket();
                    } else {
                        window.location.reload(true);
                    }
                });
                dialog.show();
            });
        }
    },
    capabilities: function (appHost) {
        var capabilities = {
            PlayableMediaTypes: ["Audio", "Video"],
            SupportedCommands: ["MoveUp", "MoveDown", "MoveLeft", "MoveRight", "PageUp", "PageDown", "PreviousLetter", "NextLetter", "ToggleOsd", "ToggleContextMenu", "Select", "Back", "SendKey", "SendString", "GoHome", "GoToSettings", "VolumeUp", "VolumeDown", "Mute", "Unmute", "ToggleMute", "SetVolume", "SetAudioStreamIndex", "SetSubtitleStreamIndex", "DisplayContent", "GoToSearch", "DisplayMessage", "SetRepeatMode", "ChannelUp", "ChannelDown", "PlayMediaSource", "PlayTrailers"],
            SupportsPersistentIdentifier: "cordova" === self.appMode || "android" === self.appMode,
            SupportsMediaControl: true
        };
        appHost.getPushTokenInfo();
        return capabilities = Object.assign(capabilities, appHost.getPushTokenInfo());
    }
};

var AppInfo = {};

!function () {
    "use strict";

    function defineConnectionManager(connectionManager) {
        window.ConnectionManager = connectionManager;
        define("connectionManager", [], function () {
            return connectionManager;
        });
    }

    function bindConnectionManagerEvents(connectionManager, events, userSettings) {
        window.Events = events;

        connectionManager.currentApiClient = function () {
            if (!localApiClient) {
                var server = connectionManager.getLastUsedServer();

                if (server) {
                    localApiClient = connectionManager.getApiClient(server.Id);
                }
            }

            return localApiClient;
        };

        connectionManager.onLocalUserSignedIn = function (user) {
            localApiClient = connectionManager.getApiClient(user.ServerId);
            window.ApiClient = localApiClient;
            return userSettings.setUserInfo(user.Id, localApiClient);
        };

        events.on(connectionManager, "localusersignedout", function () {
            userSettings.setUserInfo(null, null);
        });
    }

    function createConnectionManager() {
        return require(["connectionManagerFactory", "apphost", "credentialprovider", "events", "userSettings"], function (ConnectionManager, apphost, credentialProvider, events, userSettings) {
            var credentialProviderInstance = new credentialProvider();
            var promises = [apphost.getSyncProfile(), apphost.init()];

            return Promise.all(promises).then(function (responses) {
                var deviceProfile = responses[0];
                var capabilities = Dashboard.capabilities(apphost);

                capabilities.DeviceProfile = deviceProfile;

                var connectionManager = new ConnectionManager(credentialProviderInstance, apphost.appName(), apphost.appVersion(), apphost.deviceName(), apphost.deviceId(), capabilities, window.devicePixelRatio);

                defineConnectionManager(connectionManager);
                bindConnectionManagerEvents(connectionManager, events, userSettings);

                if (!AppInfo.isNativeApp) {
                    console.log("loading ApiClient singleton");

                    return require(["apiclient"], function (apiClientFactory) {
                        console.log("creating ApiClient singleton");

                        var apiClient = new apiClientFactory(Dashboard.serverAddress(), apphost.appName(), apphost.appVersion(), apphost.deviceName(), apphost.deviceId(), window.devicePixelRatio);

                        apiClient.enableAutomaticNetworking = false;
                        apiClient.manualAddressOnly = true;

                        connectionManager.addApiClient(apiClient);

                        window.ApiClient = apiClient;
                        localApiClient = apiClient;

                        console.log("loaded ApiClient singleton");
                    });
                }

                return Promise.resolve();
            });
        });
    }

    function returnFirstDependency(obj) {
        return obj;
    }

    function getLayoutManager(layoutManager, appHost) {
        if (appHost.getDefaultLayout) {
            layoutManager.defaultLayout = appHost.getDefaultLayout();
        }

        layoutManager.init();
        return layoutManager;
    }

    function createWindowHeadroom(Headroom) {
        var headroom = new Headroom([], {});
        return headroom;
    }

    function getCastSenderApiLoader() {
        var ccLoaded = false;
        return {
            load: function () {
                if (ccLoaded) {
                    return Promise.resolve();
                }

                return new Promise(function (resolve, reject) {
                    var fileref = document.createElement("script");
                    fileref.setAttribute("type", "text/javascript");

                    fileref.onload = function () {
                        ccLoaded = true;
                        resolve();
                    };

                    fileref.setAttribute("src", "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js");
                    document.querySelector("head").appendChild(fileref);
                });
            }
        };
    }

    function getDummyCastSenderApiLoader() {
        return {
            load: function () {
                window.chrome = window.chrome || {};
                return Promise.resolve();
            }
        };
    }

    function onRequireJsError(requireType, requireModules) {
        console.log("RequireJS error: " + (requireType || "unknown") + ". Failed modules: " + (requireModules || []).join(","));
    }

    function initRequireWithBrowser(browser) {
        var preferNativeAlerts = browser.tv;

        if (preferNativeAlerts && window.confirm) {
            define("confirm", ["components/confirm/nativeconfirm"], returnFirstDependency);
        } else {
            define("confirm", ["components/confirm/confirm"], returnFirstDependency);
        }

        if ((preferNativeAlerts || browser.xboxOne) && window.confirm) {
            define("prompt", ["components/prompt/nativeprompt"], returnFirstDependency);
        } else {
            define("prompt", ["components/prompt/prompt"], returnFirstDependency);
        }

        if ("cordova" === self.appMode || "android" === self.appMode) {
            define("castSenderApiLoader", [], getDummyCastSenderApiLoader);
        } else {
            define("castSenderApiLoader", [], getCastSenderApiLoader);
        }
    }

    function init() {
        var promises = [];
        if (!window.fetch) {
            promises.push(require(["fetch"]));
        }
        if ("function" != typeof Object.assign) {
            promises.push(require(["objectassign"]));
        }

        Promise.all(promises).then(function () {
            createConnectionManager().then(function () {
                console.log("initAfterDependencies promises resolved");

                require(["globalize", "browser"], function (globalize, browser) {
                    window.Globalize = globalize;
                    loadCoreDictionary(globalize).then(function () {
                        onGlobalizeInit(browser);
                    });
                });
                require(["keyboardnavigation"], function(keyboardnavigation) {
                    keyboardnavigation.enable();
                });
                require(["focusPreventScroll"]);
                require(["autoFocuser"], function(autoFocuser) {
                    autoFocuser.enable();
                });
            });
        });
    }

    function loadCoreDictionary(globalize) {
        var languages = ["ar", "be-by", "bg-bg", "ca", "cs", "da", "de", "el", "en-gb", "en-us", "es", "es-ar", "es-mx", "fa", "fi", "fr", "fr-ca", "gsw", "he", "hi-in", "hr", "hu", "id", "it", "kk", "ko", "lt-lt", "ms", "nb", "nl", "pl", "pt-br", "pt-pt", "ro", "ru", "sk", "sl-si", "sv", "tr", "uk", "vi", "zh-cn", "zh-hk", "zh-tw"];
        var translations = languages.map(function (language) {
            return {
                lang: language,
                path: "strings/" + language + ".json"
            };
        });
        globalize.defaultModule("core");
        return globalize.loadStrings({
            name: "core",
            translations: translations
        });
    }

    function onGlobalizeInit(browser) {
        if ("android" === self.appMode) {
            if (-1 !== self.location.href.toString().toLowerCase().indexOf("start=backgroundsync")) {
                return onAppReady(browser);
            }
        }

        document.title = Globalize.translateDocument(document.title, "core");

        if (browser.tv && !browser.android) {
            console.log("Using system fonts with explicit sizes");
            require(["css!assets/css/fonts.sized.css"]);
        } else {
            console.log("Using default fonts");
            require(["css!assets/css/fonts.css"]);
        }

        require(["apphost", "css!assets/css/librarybrowser"], function (appHost) {
            loadPlugins(appHost, browser).then(function () {
                onAppReady(browser);
            });
        });
    }

    function loadPlugins(appHost, browser, shell) {
        console.log("Loading installed plugins");
        var list = [
            "components/playback/playaccessvalidation",
            "components/playback/experimentalwarnings",
            "components/htmlaudioplayer/plugin",
            "components/htmlvideoplayer/plugin",
            "components/photoplayer/plugin",
            "components/youtubeplayer/plugin",
            "components/backdropscreensaver/plugin",
            "components/logoscreensaver/plugin"
        ];

        if (appHost.supports("remotecontrol")) {
            list.push("components/sessionplayer");

            if (browser.chrome || browser.opera) {
                list.push("components/chromecast/chromecastplayer");
            }
        }

        if (window.NativeShell) {
            list = list.concat(window.NativeShell.getPlugins());
        }

        return new Promise(function (resolve, reject) {
            Promise.all(list.map(loadPlugin)).then(function () {
                require(["packageManager"], function (packageManager) {
                    packageManager.init().then(resolve, reject);
                });
            }, reject);
        });
    }

    function loadPlugin(url) {
        return new Promise(function (resolve, reject) {
            require(["pluginManager"], function (pluginManager) {
                pluginManager.loadPlugin(url).then(resolve, reject);
            });
        });
    }

    function onAppReady(browser) {
        console.log("Begin onAppReady");

        // ensure that appHost is loaded in this point
        require(['apphost', 'appRouter'], function (appHost, appRouter) {
            window.Emby = {};

            console.log("onAppReady - loading dependencies");
            if (browser.iOS) {
                require(['css!assets/css/ios.css']);
            }

            window.Emby.Page = appRouter;

            require(['emby-button', 'scripts/themeloader', 'libraryMenu', 'scripts/routes'], function () {
                Emby.Page.start({
                    click: false,
                    hashbang: true
                });

                require(["components/thememediaplayer", "scripts/autobackdrops"]);

                if (!browser.tv && !browser.xboxOne && !browser.ps4) {
                    require(["components/nowplayingbar/nowplayingbar"]);
                }

                if (appHost.supports("remotecontrol")) {
                    require(["playerSelectionMenu", "components/playback/remotecontrolautoplay"]);
                }

                require(["components/screensavermanager"]);

                if (!appHost.supports("physicalvolumecontrol") || browser.touch) {
                    require(["components/playback/volumeosd"]);
                }

                require(["mediaSession", "serverNotifications"]);

                if (!browser.tv && !browser.xboxOne) {
                    require(["components/playback/playbackorientation"]);
                    registerServiceWorker();

                    if (window.Notification) {
                        require(["components/notifications/notifications"]);
                    }
                }

                require(["playerSelectionMenu", "fullscreenManager"]);

                if (!AppInfo.isNativeApp && window.ApiClient) {
                    require(["css!" + ApiClient.getUrl("Branding/Css")]);
                }
            });
        });
    }

    function registerServiceWorker() {
        if (navigator.serviceWorker && "cordova" !== self.appMode && "android" !== self.appMode) {
            try {
                navigator.serviceWorker.register("serviceworker.js");
            } catch (err) {
                console.log("Error registering serviceWorker: " + err);
            }
        }
    }

    function onWebComponentsReady(browser) {
        initRequireWithBrowser(browser);

        if (self.appMode === 'cordova' || self.appMode === 'android' || self.appMode === 'standalone') {
            AppInfo.isNativeApp = true;
        }

        if (!window.Promise || browser.web0s) {
            require(["native-promise-only"], init);
        } else {
            init();
        }
    }

    var localApiClient;

    (function () {
        var urlArgs = "v=" + (window.dashboardVersion || new Date().getDate());
        var paths = {
            apphost: "components/apphost",
            autoPlayDetect: "components/playback/autoplaydetect",
            browser: "scripts/browser",
            browserdeviceprofile: "scripts/browserdeviceprofile",
            datetime: "scripts/datetime",
            focusManager: "components/focusManager",
            globalize: "scripts/globalize",
            humanedate: "components/humanedate",
            imageoptionseditor: "components/imageoptionseditor/imageoptionseditor",
            inputManager: "scripts/inputManager",
            itemHelper: "components/itemhelper",
            itemShortcuts: "components/shortcuts",
            libraryBrowser: "scripts/librarybrowser",
            libraryMenu: "scripts/librarymenu",
            medialibrarycreator: "components/medialibrarycreator/medialibrarycreator",
            medialibraryeditor: "components/medialibraryeditor/medialibraryeditor",
            nowPlayingHelper: "components/playback/nowplayinghelper",
            packageManager: "components/packagemanager",
            playlisteditor: "components/playlisteditor/playlisteditor",
            playQueueManager: "components/playback/playqueuemanager",
            pluginManager: "components/pluginManager",
            qualityoptions: "components/qualityoptions",
            screensaverManager: "components/screensavermanager",
            visibleinviewport: "components/visibleinviewport",
            filesystem: "components/filesystem",
            shell: "components/shell",
            apiclient: "libraries/apiclient/apiclient",
            imageFetcher: "components/images/imageFetcher",
            alert: "components/alert",
            dialog: "components/dialog/dialog",
            loading: "components/loading/loading",
            "multi-download": "components/multidownload",
            fileDownloader: "components/filedownloader",
            localassetmanager: "libraries/apiclient/localassetmanager",
            transfermanager: "libraries/apiclient/sync/transfermanager",
            filerepository: "libraries/apiclient/sync/filerepository",
            localsync: "libraries/apiclient/sync/localsync",
            fnchecked: "legacy/fnchecked",
            legacyDashboard: "legacy/dashboard",
            legacySelectMenu: "legacy/selectmenu",
            events: "libraries/apiclient/events",
            credentialprovider: "libraries/apiclient/credentialprovider",
            connectionManagerFactory: "libraries/apiclient/connectionmanager",
            appStorage: "libraries/apiclient/appStorage",
            serversync: "libraries/apiclient/sync/serversync",
            multiserversync: "libraries/apiclient/sync/multiserversync",
            mediasync: "libraries/apiclient/sync/mediasync",
            itemrepository: "libraries/apiclient/sync/itemrepository",
            useractionrepository: "libraries/apiclient/sync/useractionrepository",
            page: "libraries/pagejs/page",
            headroom: "components/headroom/headroom",
            scroller: "components/scroller",
            navdrawer: "components/navdrawer/navdrawer",
            queryString: "libraries/query-string/index",
            "emby-button": "elements/emby-button/emby-button",
            "paper-icon-button-light": "elements/emby-button/paper-icon-button-light",
            "emby-checkbox": "elements/emby-checkbox/emby-checkbox",
            "emby-collapse": "elements/emby-collapse/emby-collapse",
            "emby-input": "elements/emby-input/emby-input",
            "emby-progressring": "elements/emby-progressring/emby-progressring",
            "emby-radio": "elements/emby-radio/emby-radio",
            "emby-select": "elements/emby-select/emby-select",
            "emby-slider": "elements/emby-slider/emby-slider",
            "emby-textarea": "elements/emby-textarea/emby-textarea",
            "emby-toggle": "elements/emby-toggle/emby-toggle",
            "chromecastHelper": "components/chromecast/chromecasthelpers",
            "mediaSession": "components/playback/mediasession",
            "actionsheet": "components/actionsheet/actionsheet",
            "tunerPicker": "components/tunerpicker",
            "mainTabsManager": "components/maintabsmanager",
            "imageLoader": "components/images/imageLoader",
            "directorybrowser": "components/directorybrowser/directorybrowser",
            "metadataEditor": "components/metadataeditor/metadataeditor",
            "personEditor": "components/metadataeditor/personeditor",
            "playerSelectionMenu": "components/playback/playerSelectionMenu",
            "playerSettingsMenu": "components/playback/playersettingsmenu",
            "playMethodHelper": "components/playback/playmethodhelper",
            "brightnessOsd": "components/playback/brightnessosd",
            "emby-itemscontainer": "components/emby-itemscontainer/emby-itemscontainer",
            "alphaNumericShortcuts": "components/alphanumericshortcuts/alphanumericshortcuts",
            "emby-scroller": "components/emby-scroller/emby-scroller",
            "emby-tabs": "components/emby-tabs/emby-tabs",
            "emby-scrollbuttons": "components/emby-scrollbuttons/emby-scrollbuttons",
            "emby-itemrefreshindicator": "components/emby-itemrefreshindicator/emby-itemrefreshindicator",
            "multiSelect": "components/multiselect/multiselect",
            "alphaPicker": "components/alphapicker/alphapicker",
            "tabbedView": "components/tabbedview/tabbedview",
            "itemsTab": "components/tabbedview/itemstab",
            "collectionEditor": "components/collectioneditor/collectioneditor",
            "serverRestartDialog": "components/serverRestartDialog",
            "playlistEditor": "components/playlisteditor/playlisteditor",
            "recordingCreator": "components/recordingcreator/recordingcreator",
            "recordingEditor": "components/recordingcreator/recordingeditor",
            "seriesRecordingEditor": "components/recordingcreator/seriesrecordingeditor",
            "recordingFields": "components/recordingcreator/recordingfields",
            "recordingButton": "components/recordingcreator/recordingbutton",
            "recordingHelper": "components/recordingcreator/recordinghelper",
            "subtitleEditor": "components/subtitleeditor/subtitleeditor",
            "subtitleSync": "components/subtitlesync/subtitlesync",
            "itemIdentifier": "components/itemidentifier/itemidentifier",
            "itemMediaInfo": "components/itemMediaInfo/itemMediaInfo",
            "mediaInfo": "components/mediainfo/mediainfo",
            "itemContextMenu": "components/itemcontextmenu",
            "imageEditor": "components/imageeditor/imageeditor",
            "imageDownloader": "components/imagedownloader/imagedownloader",
            "dom": "components/dom",
            "playerStats": "components/playerstats/playerstats",
            "searchFields": "components/search/searchfields",
            "searchResults": "components/search/searchresults",
            "upNextDialog": "components/upnextdialog/upnextdialog",
            "fullscreen-doubleclick": "components/fullscreen/fullscreen-dc",
            "fullscreenManager": "components/fullscreenManager",
            "subtitleAppearanceHelper": "components/subtitlesettings/subtitleappearancehelper",
            "subtitleSettings": "components/subtitlesettings/subtitlesettings",
            "displaySettings": "components/displaysettings/displaysettings",
            "playbackSettings": "components/playbacksettings/playbacksettings",
            "homescreenSettings": "components/homescreensettings/homescreensettings",
            "homeSections": "components/homesections/homesections",
            "playMenu": "components/playmenu",
            "refreshDialog": "components/refreshdialog/refreshdialog",
            "backdrop": "components/backdrop/backdrop",
            "fetchHelper": "components/fetchhelper",
            "cardBuilder": "components/cardbuilder/cardBuilder",
            "peoplecardbuilder": "components/cardbuilder/peoplecardbuilder",
            "chaptercardbuilder": "components/cardbuilder/chaptercardbuilder",
            "deleteHelper": "components/deletehelper",
            "tvguide": "components/guide/guide",
            "guide-settings-dialog": "components/guide/guide-settings",
            "loadingDialog": "components/loadingdialog/loadingdialog",
            "slideshow": "components/slideshow/slideshow",
            "objectassign": "components/polyfills/objectassign",
            "focusPreventScroll": "components/polyfills/focusPreventScroll",
            "userdataButtons": "components/userdatabuttons/userdatabuttons",
            "emby-playstatebutton": "components/userdatabuttons/emby-playstatebutton",
            "emby-ratingbutton": "components/userdatabuttons/emby-ratingbutton",
            "listView": "components/listview/listview",
            "indicators": "components/indicators/indicators",
            "viewSettings": "components/viewsettings/viewsettings",
            "filterMenu": "components/filtermenu/filtermenu",
            "sortMenu": "components/sortmenu/sortmenu",
            "idb": "components/idb",
            "sanitizefilename": "components/sanitizefilename",
            "toast": "components/toast/toast",
            "scrollHelper": "components/scrollhelper",
            "touchHelper": "components/touchhelper",
            "appSettings": "components/appSettings",
            "userSettings": "components/usersettings/usersettings",
            "imageUploader": "components/imageuploader/imageuploader",
            "htmlMediaHelper": "components/htmlMediaHelper",
            "viewContainer": "components/viewContainer",
            "dialogHelper": "components/dialogHelper/dialogHelper",
            "serverNotifications": "components/serverNotifications/serverNotifications",
            "skinManager": "components/skinManager",
            "keyboardnavigation": "components/keyboardnavigation",
            "scrollManager": "components/scrollManager",
            "autoFocuser": "components/autoFocuser",
            "appFooter": "components/appfooter/appfooter",
            "playbackManager": "components/playback/playbackmanager",
            "layoutManager": "components/layoutManager",
            "lazyLoader": "components/lazyloader/lazyloader-intersectionobserver"
        };

        requirejs.onError = onRequireJsError;
        requirejs.config({
            waitSeconds: 0,
            map: {
                "*": {
                    css: "components/require/requirecss",
                    text: "components/require/requiretext"
                }
            },
            bundles: {
                bundle: [
                    "document-register-element",
                    "fetch",
                    "flvjs",
                    "jstree",
                    "jQuery",
                    "hlsjs",
                    "howler",
                    "native-promise-only",
                    "resize-observer-polyfill",
                    "shaka",
                    "swiper",
                    "sortable",
                    "libjass",
                    "webcomponents"
                ]
            },
            urlArgs: urlArgs,
            paths: paths,
            onError: onRequireJsError
        });

        // Expose jQuery globally
        require(["jQuery"], function(jQuery) {
            window.$ = jQuery;
            window.jQuery = jQuery;
        });

        require(["css!assets/css/site"]);

        define("viewManager", ["components/viewManager/viewManager"], function (viewManager) {
            window.ViewManager = viewManager;
            viewManager.dispatchPageEvents(true);
            return viewManager;
        });

        define("connectionManager", [], function () {
            return ConnectionManager;
        });
        define("apiClientResolver", [], function () {
            return function () {
                return window.ApiClient;
            };
        });
        define("appRouter", ["components/appRouter", "itemHelper"], function (appRouter, itemHelper) {
            function showItem(item, serverId, options) {
                if ("string" == typeof item) {
                    require(["connectionManager"], function (connectionManager) {
                        var apiClient = connectionManager.currentApiClient();
                        apiClient.getItem(apiClient.getCurrentUserId(), item).then(function (item) {
                            appRouter.showItem(item, options);
                        });
                    });
                } else {
                    if (2 == arguments.length) {
                        options = arguments[1];
                    }

                    appRouter.show("/" + appRouter.getRouteUrl(item, options), {
                        item: item
                    });
                }
            }

            appRouter.showLocalLogin = function (serverId, manualLogin) {
                Dashboard.navigate("login.html?serverid=" + serverId);
            };

            appRouter.showVideoOsd = function () {
                return Dashboard.navigate("videoosd.html");
            };

            appRouter.showSelectServer = function () {
                Dashboard.navigate(AppInfo.isNativeApp ? "selectserver.html" : "login.html");
            };

            appRouter.showWelcome = function () {
                Dashboard.navigate(AppInfo.isNativeApp ? "selectserver.html" : "login.html");
            };

            appRouter.showSettings = function () {
                Dashboard.navigate("mypreferencesmenu.html");
            };

            appRouter.showGuide = function () {
                Dashboard.navigate("livetv.html?tab=1");
            };

            appRouter.goHome = function () {
                Dashboard.navigate("home.html");
            };

            appRouter.showSearch = function () {
                Dashboard.navigate("search.html");
            };

            appRouter.showLiveTV = function () {
                Dashboard.navigate("livetv.html");
            };

            appRouter.showRecordedTV = function () {
                Dashboard.navigate("livetv.html?tab=3");
            };

            appRouter.showFavorites = function () {
                Dashboard.navigate("home.html?tab=1");
            };

            appRouter.showSettings = function () {
                Dashboard.navigate("mypreferencesmenu.html");
            };

            appRouter.showNowPlaying = function () {
                Dashboard.navigate("nowplaying.html");
            };

            appRouter.setTitle = function (title) {
                LibraryMenu.setTitle(title);
            };

            appRouter.getRouteUrl = function (item, options) {
                if (!item) {
                    throw new Error("item cannot be null");
                }

                if (item.url) {
                    return item.url;
                }

                var context = options ? options.context : null;
                var id = item.Id || item.ItemId;

                if (!options) {
                    options = {};
                }

                var url;
                var itemType = item.Type || (options ? options.itemType : null);
                var serverId = item.ServerId || options.serverId;

                if ("settings" === item) {
                    return "mypreferencesmenu.html";
                }

                if ("wizard" === item) {
                    return "wizardstart.html";
                }

                if ("manageserver" === item) {
                    return "dashboard.html";
                }

                if ("recordedtv" === item) {
                    return "livetv.html?tab=3&serverId=" + options.serverId;
                }

                if ("nextup" === item) {
                    return "list.html?type=nextup&serverId=" + options.serverId;
                }

                if ("list" === item) {
                    var url = "list.html?serverId=" + options.serverId + "&type=" + options.itemTypes;

                    if (options.isFavorite) {
                        url += "&IsFavorite=true";
                    }

                    return url;
                }

                if ("livetv" === item) {
                    if ("programs" === options.section) {
                        return "livetv.html?tab=0&serverId=" + options.serverId;
                    }
                    if ("guide" === options.section) {
                        return "livetv.html?tab=1&serverId=" + options.serverId;
                    }

                    if ("movies" === options.section) {
                        return "list.html?type=Programs&IsMovie=true&serverId=" + options.serverId;
                    }

                    if ("shows" === options.section) {
                        return "list.html?type=Programs&IsSeries=true&IsMovie=false&IsNews=false&serverId=" + options.serverId;
                    }

                    if ("sports" === options.section) {
                        return "list.html?type=Programs&IsSports=true&serverId=" + options.serverId;
                    }

                    if ("kids" === options.section) {
                        return "list.html?type=Programs&IsKids=true&serverId=" + options.serverId;
                    }

                    if ("news" === options.section) {
                        return "list.html?type=Programs&IsNews=true&serverId=" + options.serverId;
                    }

                    if ("onnow" === options.section) {
                        return "list.html?type=Programs&IsAiring=true&serverId=" + options.serverId;
                    }

                    if ("dvrschedule" === options.section) {
                        return "livetv.html?tab=4&serverId=" + options.serverId;
                    }

                    if ("seriesrecording" === options.section) {
                        return "livetv.html?tab=5&serverId=" + options.serverId;
                    }

                    return "livetv.html?serverId=" + options.serverId;
                }

                if ("SeriesTimer" == itemType) {
                    return "itemdetails.html?seriesTimerId=" + id + "&serverId=" + serverId;
                }

                if ("livetv" == item.CollectionType) {
                    return "livetv.html";
                }

                if ("Genre" === item.Type) {
                    url = "list.html?genreId=" + item.Id + "&serverId=" + serverId;

                    if ("livetv" === context) {
                        url += "&type=Programs";
                    }

                    if (options.parentId) {
                        url += "&parentId=" + options.parentId;
                    }

                    return url;
                }

                if ("MusicGenre" === item.Type) {
                    url = "list.html?musicGenreId=" + item.Id + "&serverId=" + serverId;

                    if (options.parentId) {
                        url += "&parentId=" + options.parentId;
                    }

                    return url;
                }

                if ("Studio" === item.Type) {
                    url = "list.html?studioId=" + item.Id + "&serverId=" + serverId;

                    if (options.parentId) {
                        url += "&parentId=" + options.parentId;
                    }

                    return url;
                }

                if ("folders" !== context && !itemHelper.isLocalItem(item)) {
                    if ("movies" == item.CollectionType) {
                        url = "movies.html?topParentId=" + item.Id;

                        if (options && "latest" === options.section) {
                            url += "&tab=1";
                        }

                        return url;
                    }

                    if ("tvshows" == item.CollectionType) {
                        url = "tv.html?topParentId=" + item.Id;

                        if (options && "latest" === options.section) {
                            url += "&tab=2";
                        }

                        return url;
                    }

                    if ("music" == item.CollectionType) {
                        return "music.html?topParentId=" + item.Id;
                    }
                }

                var itemTypes = ["Playlist", "TvChannel", "Program", "BoxSet", "MusicAlbum", "MusicGenre", "Person", "Recording", "MusicArtist"];

                if (itemTypes.indexOf(itemType) >= 0) {
                    return "itemdetails.html?id=" + id + "&serverId=" + serverId;
                }

                var contextSuffix = context ? "&context=" + context : "";

                if ("Series" == itemType || "Season" == itemType || "Episode" == itemType) {
                    return "itemdetails.html?id=" + id + contextSuffix + "&serverId=" + serverId;
                }

                if (item.IsFolder) {
                    if (id) {
                        return "list.html?parentId=" + id + "&serverId=" + serverId;
                    }

                    return "#";
                }

                return "itemdetails.html?id=" + id + "&serverId=" + serverId;
            };

            appRouter.showItem = showItem;
            return appRouter;
        });
    })();

    return require(["browser"], onWebComponentsReady);
}();

pageClassOn("viewshow", "standalonePage", function () {
    document.querySelector(".skinHeader").classList.add("noHeaderRight");
});

pageClassOn("viewhide", "standalonePage", function () {
    document.querySelector(".skinHeader").classList.remove("noHeaderRight");
});
