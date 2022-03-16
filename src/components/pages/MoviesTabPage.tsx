import React, { Component, createRef } from 'react';
import { Event as EventObject, Events } from 'jellyfin-apiclient';
import globalize from '../../scripts/globalize';
import * as mainTabsManager from '../maintabsmanager';
import * as userSettings from '../../scripts/settings/userSettings';
import libraryMenu from '../../scripts/libraryMenu';
import '../../elements/emby-scroller/emby-scroller';
import '../../elements/emby-itemscontainer/emby-itemscontainer';
import '../../elements/emby-tabs/emby-tabs';
import '../../elements/emby-button/emby-button';
import ItemsContainerElement from '../dashboard/users/ItemsContainerElement';
import PaperButtonElement from '../dashboard/users/PaperButtonElement';
import { playbackManager } from '../playback/playbackmanager';

type IProps = {
    tab?: any;
    topParentId: string;
}

interface IState {
    currentTabIndex: number,
}

export class MoviesTabPage extends Component <IProps, IState> {
    //ref = createRef<HTMLDivElement>();
    private ref: React.RefObject<HTMLDivElement>;
    tabControllers: any = [];
    renderedTabs: any = [];
    currentTabIndex = parseInt(this.props.tab || this.getDefaultTabIndex(this.props.topParentId));

    constructor(props: IProps) {
        super(props);
        this.ref = createRef();
        /*this.state = {
            currentTabIndex: parseInt(props.tab || this.getDefaultTabIndex(props.topParentId))
        };*/

        this.onBeforeTabChange = this.onBeforeTabChange.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.onPlaybackStop = this.onPlaybackStop.bind(this);
        this.onViewShow = this.onViewShow.bind(this);
    }

    componentDidMount() {
        const page = this.ref.current as HTMLDivElement;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }
        this.initTabs();

        if (!page.getAttribute('data-title')) {
            const parentId = this.props.topParentId;

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

        Events.on(playbackManager, 'playbackstop', this.onPlaybackStop);
    }

    onViewShow() {
        const page = this.ref.current as HTMLDivElement;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }
        this.initTabs();

        if (!page.getAttribute('data-title')) {
            const parentId = this.props.topParentId;

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

        Events.on(playbackManager, 'playbackstop', this.onPlaybackStop);
    }
    /*componentDidUpdate() {
        const page = this.ref.current as HTMLDivElement;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }

        this.initTabs();

        if (!page.getAttribute('data-title')) {
            const parentId = this.props.topParentId;

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
    }*/

    componentWillUnmount() {
        //document.removeEventListener('viewshow', () => this.onViewShow());
        Events.off(playbackManager, 'playbackstop', this.onPlaybackStop);
        /*this.tabControllers.forEach(function (t: { destroy: () => void; }) {
            if (t.destroy) {
                t.destroy();
            }
        });*/
    }

    initTabs() {
        mainTabsManager.setTabs(this.ref.current, this.currentTabIndex, this.getTabs, this.getTabContainers, this.onBeforeTabChange, this.onTabChange);
    }

    onPlaybackStop(e: EventObject, state: { NowPlayingItem: { MediaType: string; }; }) {
        if (state.NowPlayingItem && state.NowPlayingItem.MediaType == 'Video') {
            this.renderedTabs = [];
            const TabsElement = mainTabsManager.getTabsElement() as any;

            TabsElement.triggerTabChange();
        }
    }

    getTabs() {
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

    getTabController(index: number, callback: any) {
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
            const page = this.ref.current as HTMLDivElement;

            if (!page) {
                console.error('Unexpected null reference');
                return;
            }

            let tabContent;
            let controller = this.tabControllers[index];

            if (!controller) {
                tabContent = page.querySelector(".pageTabContent[data-index='" + index + "']");

                if (index == 0 || index == 3) {
                    controller = new controllerFactory(page, this.props, tabContent, {
                        mode: index ? 'favorites' : 'movies'
                    });
                } else {
                    controller = new controllerFactory(page, this.props, tabContent);
                }

                this.tabControllers[index] = controller;
                //setTabControllers(TabControllers);
                if (controller.initTab) {
                    controller.initTab();
                }
            }
            callback(controller);
        });
    }

    preLoadTab(index: number) {
        console.log('preLoadTab', index);
        this.getTabController(index, (controller: { preRender: () => void; }) => {
            if (this.renderedTabs.indexOf(index) == -1 && controller.preRender) {
                controller.preRender();
            }
        });
    }

    onBeforeTabChange(e: { detail: { selectedTabIndex: string; }; }) {
        /*const page = this.ref.current as HTMLDivElement;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }*/
        this.preLoadTab(parseInt(e.detail.selectedTabIndex));
        //console.log('onBeforeTabChange', this.preLoadTab);
    }

    loadTab(index: number) {
        console.log('loadTab', index);
        //const CurrentTabIndex = index;
        this.currentTabIndex = index;
        //this.setState({ currentTabIndex: index });
        //setCurrentTabIndex(CurrentTabIndex);

        //console.log('currentTabIndex', CurrentTabIndex);
        this.getTabController(index, (controller: { renderTab: () => void; }) => {
            if (this.renderedTabs.indexOf(index) == -1) {
                this.renderedTabs.push(index);
                controller.renderTab();
            }
        });
    }

    onTabChange(e: { detail: { selectedTabIndex: string; }; }) {
        /*const page = this.ref.current as HTMLDivElement;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }*/
        const newIndex = parseInt(e.detail.selectedTabIndex);
        console.log('newIndex', newIndex);
        this.loadTab(newIndex);
    }

    getTabContainers() {
        /*const page = this.ref.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }*/
        return document.querySelectorAll('.pageTabContent');
    }

    getDefaultTabIndex (folderId: string) {
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
    }

    render() {
        return (
            <div ref={this.ref}>
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
    }
}

export default MoviesTabPage;
