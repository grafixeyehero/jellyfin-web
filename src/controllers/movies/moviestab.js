
import { Events } from 'jellyfin-apiclient';
import * as userSettings from '../../scripts/settings/userSettings';
import libraryMenu from '../../scripts/libraryMenu';
import * as mainTabsManager from '../../components/maintabsmanager';
import { playbackManager } from '../../components/playback/playbackmanager';
import globalize from '../../scripts/globalize';
import '../../elements/emby-scroller/emby-scroller';
import '../../elements/emby-itemscontainer/emby-itemscontainer';
import '../../elements/emby-tabs/emby-tabs';
import '../../elements/emby-button/emby-button';

function getTabs() {
    return [{
        name: globalize.translate('Movies')
    }, {
        name: globalize.translate('Suggestions')
    }, {
        name: globalize.translate('Trailers')
    }, {
        name: globalize.translate('Favorites')
    }, {
        name: globalize.translate('Collections')
    }, {
        name: globalize.translate('Genres')
    }];
}

function getDefaultTabIndex(folderId) {
    switch (userSettings.get('landing-' + folderId)) {
        case 'suggestions':
            return 1;

        case 'favorites':
            return 3;

        case 'collections':
            return 4;

        case 'genres':
            return 5;

        default:
            return 0;
    }
}

function MoviesTab(view, params) {
    function onBeforeTabChange(e) {
        preLoadTab(view, parseInt(e.detail.selectedTabIndex));
    }

    function onTabChange(e) {
        const newIndex = parseInt(e.detail.selectedTabIndex);
        loadTab(view, newIndex);
    }

    function getTabContainers() {
        return view.querySelectorAll('.pageTabContent');
    }

    function initTabs() {
        mainTabsManager.setTabs(view, currentTabIndex, getTabs, getTabContainers, onBeforeTabChange, onTabChange);
    }

    const getTabController = (page, index, callback) => {
        let depends = '';

        switch (index) {
            case 0:
                depends = 'movies';
                break;

            case 1:
                depends = 'moviesrecommended.js';
                break;

            case 2:
                depends = 'movietrailers';
                break;

            case 3:
                depends = 'movies';
                break;

            case 4:
                depends = 'moviecollections';
                break;

            case 5:
                depends = 'moviegenres';
                break;
        }
        import(`../movies/${depends}`).then(({default: controllerFactory}) => {
            let tabContent;

            let controller = tabControllers[index];

            if (!controller) {
                tabContent = view.querySelector(".pageTabContent[data-index='" + index + "']");

                if (index == 0 || index == 3) {
                    controller = new controllerFactory(view, params, tabContent, {
                        mode: index ? 'favorites' : 'movies'
                    });
                } else {
                    controller = new controllerFactory(view, params, tabContent);
                }

                tabControllers[index] = controller;

                if (controller.initTab) {
                    controller.initTab();
                }
            }

            callback(controller);
        });
    };

    function preLoadTab(page, index) {
        getTabController(page, index, function (controller) {
            if (renderedTabs.indexOf(index) == -1 && controller.preRender) {
                controller.preRender();
            }
        });
    }

    function loadTab(page, index) {
        currentTabIndex = index;
        getTabController(page, index, ((controller) => {
            if (renderedTabs.indexOf(index) == -1) {
                renderedTabs.push(index);
                controller.renderTab();
            }
        }));
    }

    function onPlaybackStop(e, state) {
        if (state.NowPlayingItem && state.NowPlayingItem.MediaType == 'Video') {
            renderedTabs = [];
            mainTabsManager.getTabsElement().triggerTabChange();
        }
    }

    let currentTabIndex = parseInt(params.tab || getDefaultTabIndex(params.topParentId));

    const tabControllers = [];
    let renderedTabs = [];
    view.addEventListener('viewshow', function () {
        initTabs();
        if (!view.getAttribute('data-title')) {
            const parentId = params.topParentId;

            if (parentId) {
                ApiClient.getItem(ApiClient.getCurrentUserId(), parentId).then(function (item) {
                    view.setAttribute('data-title', item.Name);
                    libraryMenu.setTitle(item.Name);
                });
            } else {
                view.setAttribute('data-title', globalize.translate('Movies'));
                libraryMenu.setTitle(globalize.translate('Movies'));
            }
        }

        Events.on(playbackManager, 'playbackstop', onPlaybackStop);
    });

    for (const tabController of tabControllers) {
        if (tabController.destroy) {
            tabController.destroy();
        }
    }
}

export default MoviesTab;
