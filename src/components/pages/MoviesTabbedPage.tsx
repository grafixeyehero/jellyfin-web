import React, {FunctionComponent, useCallback, useEffect, useState, useRef} from 'react';
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
import ItemsContainerElement from '../dashboard/users/ItemsContainerElement';
import PaperButtonElement from '../dashboard/users/PaperButtonElement';

type IProps = {
    tab?: any;
    topParentId: string;
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

    const currentTabIndex = parseInt(props.tab || getDefaultTabIndex(props.topParentId));

    //const [currentTabIndex, setCurrentTabIndex] = useState(parseInt(props.tab || getDefaultTabIndex(props.topParentId)));
    //const [tabControllers, setTabControllers] = useState([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tabControllers: any[] = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const renderedTabs: number[] = [];

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
                depends = 'bsmovies';
                break;

            case 1:
                depends = 'moviesrecommended.js';
                break;

            case 2:
                depends = 'movietrailers';
                break;

            case 3:
                depends = 'bsmovies';
                break;

            case 4:
                depends = 'moviecollections';
                break;

            case 5:
                depends = 'moviegenres';
                break;
        }

        console.log('depends', depends);
        return import(/* webpackChunkName: "[request]" */ `../../controllers/movies/${depends}`).then(({ default: controllerFactory }) => {
            let tabContent;
            let controller = tabControllers[index];

            if (!controller) {
                tabContent = page.querySelector(".pageTabContent[data-index='" + index + "']");

                if (index == 0 || index == 3) {
                    controller = new controllerFactory(page, props, tabContent, {
                        mode: index ? 'favorites' : 'movies'
                    });
                } else {
                    controller = new controllerFactory(page, props, tabContent);
                }

                tabControllers[index] = controller;
                //setTabControllers(TabControllers);
                if (controller.initTab) {
                    controller.initTab();
                }
            }
            return controller;
        });
    }, [props, tabControllers]);

    const preLoadTab = useCallback((page, index) => {
        console.log('preLoadTab', index);
        getTabController(page, index).then(function (controller) {
            if (renderedTabs.indexOf(index) == -1 && controller.preRender) {
                controller.preRender();
            }
        });
    }, [getTabController, renderedTabs]);

    const onBeforeTabChange = useCallback((e) => {
        preLoadTab(element?.current, parseInt(e.detail.selectedTabIndex));
        console.log('onBeforeTabChange', preLoadTab);
    }, [preLoadTab]);

    const loadTab = useCallback((page, index): void => {
        console.log('loadTab', index);
        //const CurrentTabIndex = index;
        //currentTabIndex = index;
        //setCurrentTabIndex(CurrentTabIndex);

        //console.log('currentTabIndex', CurrentTabIndex);
        getTabController(page, index).then(function (controller) {
            if (renderedTabs.indexOf(index) == -1) {
                renderedTabs.push(index);
                controller.renderTab();
            }
        });
    }, [getTabController, renderedTabs]);

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

        //Events.on(playbackManager, 'playbackstop', onPlaybackStop);

        return () => {
            /*tabControllers.forEach(function (t: { destroy: () => void; }) {
                if (t.destroy) {
                    t.destroy();
                }
            });*/
            for (const tabController of tabControllers) {
                if (tabController.destroy) {
                    tabController.destroy();
                }
            }
        };
    }, [initTabs, props.topParentId, tabControllers]);

    return (
        <div ref={element}>
            <div className='pageTabContent' id='moviesTab' data-index='0'>
                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSelectView autoSize'
                        title='ButtonSelectView'
                        icon='material-icons view_comfy'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSort autoSize'
                        title='Sort'
                        icon='material-icons sort_by_alpha'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        type='submit'
                        className='btnFilter autoSize'
                        title='Filter'
                        icon='material-icons filter_list'
                    />

                </div>

                <div className='alphaPicker alphaPicker-fixed alphaPicker-vertical'>
                </div>

                <ItemsContainerElement
                    id=''
                    className='itemsContainer padded-left padded-right'
                />

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                </div>
            </div>
            <div className='pageTabContent' id='suggestionsTab' data-index='1'>
                <div id='resumableSection' className='verticalSection hide'>
                    <div className='sectionTitleContainer sectionTitleContainer-cards'>
                        <h2 className='sectionTitle sectionTitle-cards padded-left'>
                            {globalize.translate('HeaderContinueWatching')}
                        </h2>
                    </div>

                    <ItemsContainerElement
                        id='resumableItems'
                        className='itemsContainer padded-left padded-right'
                    />

                </div>

                <div className='verticalSection'>
                    <div className='sectionTitleContainer sectionTitleContainer-cards'>
                        <h2 className='sectionTitle sectionTitle-cards padded-left'>
                            {globalize.translate('HeaderLatestMovies')}
                        </h2>
                    </div>

                    <ItemsContainerElement
                        id='recentlyAddedItems'
                        className='itemsContainer padded-left padded-right'
                    />

                </div>

                <div className='recommendations'>
                </div>
                <div className='noItemsMessage hide padded-left padded-right'>
                    <br />
                    <p>
                        {globalize.translate('MessageNoMovieSuggestionsAvailable')}
                    </p>
                </div>
            </div>
            <div className='pageTabContent' id='trailersTab' data-index='2'>
                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>

                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSort autoSize'
                        title='Sort'
                        icon='material-icons sort_by_alpha'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnFilter autoSize'
                        title='Filter'
                        icon='material-icons filter_list'
                    />

                </div>

                <div className='alphaPicker alphaPicker-fixed alphaPicker-fixed-right alphaPicker-vertical'>
                </div>

                <ItemsContainerElement
                    id=''
                    className='itemsContainer vertical-wrap padded-left padded-right'
                />

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                </div>
            </div>
            <div className='pageTabContent' id='favoritesTab' data-index='3'>
                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSelectView autoSize'
                        title='ButtonSelectView'
                        icon='material-icons view_comfy'
                    />
                </div>

                <ItemsContainerElement
                    id=''
                    className='itemsContainer padded-left padded-right'
                />

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                </div>
            </div>
            <div className='pageTabContent' id='collectionsTab' data-index='4'>
                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSelectView autoSize'
                        title='ButtonSelectView'
                        icon='material-icons view_comfy'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSort autoSize'
                        title='Sort'
                        icon='material-icons sort_by_alpha'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        type='button'
                        className='btnNewCollection autoSize'
                        title='add'
                        icon='material-icons add'
                    />

                </div>

                <ItemsContainerElement
                    id=''
                    className='itemsContainer vertical-wrap centered padded-left padded-right'
                />

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                </div>
            </div>
            <div className='pageTabContent' id='genresTab' data-index='5'>
                <div id='items'></div>
            </div>
        </div>
    );
};

export default MoviesTabbedPage;
