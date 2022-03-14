import React, {FunctionComponent, useCallback, useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import globalize from '../../scripts/globalize';
import * as mainTabsManager from '../maintabsmanager';
import * as userSettings from '../../scripts/settings/userSettings';
import libraryMenu from '../../scripts/libraryMenu';
//import { playbackManager } from '../playback/playbackmanager';
//import { Events } from 'jellyfin-apiclient';
import '../../elements/emby-scroller/emby-scroller';
import '../../elements/emby-itemscontainer/emby-itemscontainer';
import '../../elements/emby-tabs/emby-tabs';
import '../../elements/emby-button/emby-button';
//import ItemsContainerElement from '../dashboard/users/ItemsContainerElement';
//import PaperButtonElement from '../dashboard/users/PaperButtonElement';

type IProps = {
    tab?: any;
    topParentId: string;
    childern: any
}

const getDefaultTabIndex = (folderId: string) => {
    switch (userSettings.get('landing-' + folderId, false)) {
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
};

const MoviesTabbedPage: FunctionComponent<IProps> = (props: IProps) => {
    console.log('props', props);

    //let currentTabIndex = parseInt(props.tab || getDefaultTabIndex(props.topParentId));

    const [currentTabIndex, setCurrentTabIndex] = useState(parseInt(props.tab || getDefaultTabIndex(props.topParentId)));
    //const [tabControllers, setTabControllers] = useState([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //const tabControllers: any = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //const renderedTabs: any = [];

    const element = useRef<HTMLDivElement>(null);

    const getTabs = () => {
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
    };

    const getTabController = useCallback((page, index) => {
        let depends = '';

        switch (index) {
            case 0:
                depends = 'Movies';
                break;

            case 1:
                depends = 'Suggestions';
                break;

            case 2:
                depends = 'Trailers';
                break;

            case 3:
                depends = 'Favorite';
                break;

            case 4:
                depends = 'Collections';
                break;

            case 5:
                depends = 'Genres';
                break;
        }

        console.log('depends', depends);
        return import(/* webpackChunkName: "[request]" */ `../../controllers/movies/${depends}`).then(({ default: component }) => {
            const tabContent = page.querySelector(".pageTabContent[data-index='" + index + "']");
            ReactDOM.render(React.createElement(component, props), tabContent);

            /*let tabContent;
            let controller = tabControllers[index];

            if (!controller) {
                tabContent = page.querySelector(".pageTabContent[data-index='" + index + "']");
                controller = React.createElement(component, props);
                ReactDOM.render(controller, tabContent);
                tabControllers[index] = controller;
            }

            return controller;*/
        });
    }, [props]);

    const preLoadTab = useCallback((page, index) => {
        console.log('preLoadTab', index);
        getTabController(page, index);/*.then(function (controller) {
            if (renderedTabs.indexOf(index) == -1 && controller.preRender) {
                controller.preRender();
            }
        });*/
    }, [getTabController]);

    const onBeforeTabChange = useCallback((e) => {
        preLoadTab(element?.current, parseInt(e.detail.selectedTabIndex));
        console.log('onBeforeTabChange', preLoadTab);
    }, [preLoadTab]);

    const loadTab = useCallback((page, index: number) => {
        console.log('loadTab', index);
        const CurrentTabIndex = index;
        //currentTabIndex = index;
        setCurrentTabIndex(CurrentTabIndex);

        console.log('currentTabIndex', CurrentTabIndex);
        getTabController(page, index);/*.then(function (controller) {
            if (renderedTabs.indexOf(index) == -1) {
                renderedTabs.push(index);
                controller.renderTab();
            }
        });*/
    }, [getTabController]);

    const onTabChange = useCallback((e) => {
        const newIndex = parseInt(e.detail.selectedTabIndex);
        console.log('newIndex', newIndex);
        loadTab(element?.current, newIndex);
    }, [loadTab]);

    const getTabContainers = () => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }
        return page.querySelectorAll('.pageTabContent');
    };

    const initTabs = useCallback((page) => {
        mainTabsManager.setTabs(page, currentTabIndex, getTabs, getTabContainers, onBeforeTabChange, onTabChange);
    }, [currentTabIndex, onBeforeTabChange, onTabChange]);

    useEffect(() => {
        //document.addEventListener('viewshow', function () {
            const page = element.current;

            if (!page) {
                console.error('Unexpected null reference');
                return;
            }

            initTabs(page);

            if (!page.getAttribute('data-title')) {
                const parentId = props.topParentId;

                if (parentId) {
                    window.ApiClient.getItem(window.ApiClient.getCurrentUserId(), parentId).then(function (item) {
                        page.setAttribute('data-title', item.Name as string);
                        libraryMenu.setTitle(item.Name);
                    });
                } else {
                    page.setAttribute('data-title', globalize.translate('Movies'));
                    libraryMenu.setTitle(globalize.translate('Movies'));
                }
            }
       //});

        /*for (const tabController of tabControllers) {
            if (tabController.destroy) {
                tabController.destroy();
            }
        }*/

        //Events.on(playbackManager, 'playbackstop', onPlaybackStop);

        //return () => {
        /*tabControllers.forEach(function (t: { destroy: () => void; }) {
                if (t.destroy) {
                    t.destroy();
                }
            });*/
        /*for (const tabController of tabControllers) {
                if (tabController.destroy) {
                    tabController.destroy();
                }
            }*/
        //};
    }, [initTabs, props.childern, props.topParentId]);

    return (
        <div ref={element}>
            <div className='pageTabContent' id='moviesTab' data-index='0'>

            </div>
            <div className='pageTabContent' id='suggestionsTab' data-index='1'>

            </div>
            <div className='pageTabContent' id='trailersTab' data-index='2'>

            </div>
            <div className='pageTabContent' id='favoritesTab' data-index='3'>

            </div>
            <div className='pageTabContent' id='collectionsTab' data-index='4'>

            </div>
            <div className='pageTabContent' id='genresTab' data-index='5'>

            </div>
        </div>
    );
};

export default MoviesTabbedPage;
