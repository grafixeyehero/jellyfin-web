import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef } from 'react';
import ItemsContainerElement from '../../components/dashboard/users/ItemsContainerElement';
import PaperButtonElement from '../../components/dashboard/users/PaperButtonElement';
import loading from '../../components/loading/loading';
import * as userSettings from '../../scripts/settings/userSettings';
import { Events } from 'jellyfin-apiclient';
import libraryBrowser from '../../scripts/libraryBrowser';
import listView from '../../components/listview/listview';
import cardBuilder from '../../components/cardbuilder/cardBuilder';
import globalize from '../../scripts/globalize';
import '../../elements/emby-itemscontainer/emby-itemscontainer';
import imageLoader from '../../components/images/imageLoader';

type MoviesProps = {
    topParentId?: string,
    mode?: string,
};

const Movies: FunctionComponent<MoviesProps> = ({ topParentId }: MoviesProps) => {
    console.log('props', topParentId);

    //const [items, setItems] = useState<BaseItemDto[]>([]);

    const element = useRef<HTMLDivElement>(null);

    const data:any = useMemo(() => [], []);
    //const data: any = {};
    let isLoading = false;

    const getSavedQueryKey = useCallback((context) => {
        if (!context.savedQueryKey) {
            context.savedQueryKey = libraryBrowser.getSavedQueryKey('movies');
        }

        return context.savedQueryKey;
    }, []);

    const getPageData = useCallback((context) => {
        const key = getSavedQueryKey(context);
        let pageData = data[key];

        if (!pageData) {
            pageData = data[key] = {
                query: {
                    SortBy: 'SortName',
                    SortOrder: 'Ascending',
                    IncludeItemTypes: 'Movie',
                    Recursive: true,
                    Fields: 'PrimaryImageAspectRatio,BasicSyncInfo',
                    ImageTypeLimit: 1,
                    EnableImageTypes: 'Primary,Backdrop,Banner,Thumb',
                    StartIndex: 0
                },
                view: libraryBrowser.getSavedView(key) || 'Poster'
            };

            if (userSettings.libraryPageSize(undefined) > 0) {
                pageData.query['Limit'] = userSettings.libraryPageSize(undefined);
            }

            pageData.query.ParentId = topParentId;
            libraryBrowser.loadSavedQueryValues(key, pageData.query);
        }

        return pageData;
    }, [data, getSavedQueryKey, topParentId]);

    const getQuery = useCallback((context) => {
        return getPageData(context).query;
    }, [getPageData]);

    const getCurrentViewStyle = useCallback(() => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }
        return getPageData(page).view;
    }, [getPageData]);

    const onViewStyleChange = useCallback(() => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }

        const viewStyle = getCurrentViewStyle();
        const itemsContainer = page.querySelector('.itemsContainer') as HTMLDivElement;

        if (viewStyle == 'List') {
            itemsContainer.classList.add('vertical-list');
            itemsContainer.classList.remove('vertical-wrap');
        } else {
            itemsContainer.classList.remove('vertical-list');
            itemsContainer.classList.add('vertical-wrap');
        }

        itemsContainer.innerHTML = '';
    }, [getCurrentViewStyle]);

    const reloadItems = useCallback((page) => {
        loading.show();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isLoading = true;
        const query = getQuery(page);
        window.ApiClient.getItems(window.ApiClient.getCurrentUserId(), query).then((result) => {
            const items = result.Items || result;
            function onNextPageClick() {
                if (isLoading) {
                    return;
                }

                if (userSettings.libraryPageSize(undefined) > 0) {
                    query.StartIndex += query.Limit;
                }
                reloadItems(page);
            }

            function onPreviousPageClick() {
                if (isLoading) {
                    return;
                }

                if (userSettings.libraryPageSize(undefined) > 0) {
                    query.StartIndex = Math.max(0, query.StartIndex - query.Limit);
                }
                reloadItems(page);
            }

            window.scrollTo(0, 0);
            //this.alphaPicker?.updateControls(query);
            let html;
            const pagingHtml = libraryBrowser.getQueryPagingHtml({
                startIndex: query.StartIndex,
                limit: query.Limit,
                totalRecordCount: result.TotalRecordCount,
                showLimit: false,
                updatePageSizeSetting: false,
                addLayoutButton: false,
                sortButton: false,
                filterButton: false
            });
            const viewStyle = getCurrentViewStyle();
            if (viewStyle == 'Thumb') {
                html = cardBuilder.getCardsHtml(items, {
                    items: items,
                    shape: 'backdrop',
                    preferThumb: true,
                    context: 'movies',
                    lazy: true,
                    overlayPlayButton: true,
                    showTitle: true,
                    showYear: true,
                    centerText: true
                });
            } else if (viewStyle == 'ThumbCard') {
                html = cardBuilder.getCardsHtml(items, {
                    items: items,
                    shape: 'backdrop',
                    preferThumb: true,
                    context: 'movies',
                    lazy: true,
                    cardLayout: true,
                    showTitle: true,
                    showYear: true,
                    centerText: true
                });
            } else if (viewStyle == 'Banner') {
                html = cardBuilder.getCardsHtml(items, {
                    items: items,
                    shape: 'banner',
                    preferBanner: true,
                    context: 'movies',
                    lazy: true
                });
            } else if (viewStyle == 'List') {
                html = listView.getListViewHtml({
                    items: items,
                    context: 'movies',
                    sortBy: query.SortBy
                });
            } else if (viewStyle == 'PosterCard') {
                html = cardBuilder.getCardsHtml(items, {
                    items: items,
                    shape: 'portrait',
                    context: 'movies',
                    showTitle: true,
                    showYear: true,
                    centerText: true,
                    lazy: true,
                    cardLayout: true
                });
            } else {
                html = cardBuilder.getCardsHtml(items, {
                    items: items,
                    shape: 'portrait',
                    context: 'movies',
                    overlayPlayButton: true,
                    showTitle: true,
                    showYear: true,
                    centerText: true
                });
            }

            let elems = page.querySelectorAll('.paging');

            for (const elem of elems) {
                elem.innerHTML = pagingHtml;
            }

            elems = page.querySelectorAll('.btnNextPage');
            for (const elem of elems) {
                elem.addEventListener('click', onNextPageClick);
            }

            elems = page.querySelectorAll('.btnPreviousPage');
            for (const elem of elems) {
                elem.addEventListener('click', onPreviousPageClick);
            }

            const itemsContainer = page.querySelector('.itemsContainer') as HTMLDivElement;
            itemsContainer.innerHTML = html;
            imageLoader.lazyChildren(itemsContainer);
            libraryBrowser.saveQueryValues(getSavedQueryKey(page), query);
            loading.hide();
            isLoading = false;

            import('../../components/autoFocuser').then(({default: autoFocuser}) => {
                autoFocuser.autoFocus(page);
            });
        });
    }, []);

    const showFilterMenu = useCallback(() => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }

        import('../../components/filterdialog/filterdialog').then(({default: filterDialogFactory}) => {
            const filterDialog = new filterDialogFactory({
                query: getQuery(page),
                mode: 'movies',
                serverId: window.ApiClient.serverId()
            });
            Events.on(filterDialog, 'filterchange', function () {
                getQuery(page).StartIndex = 0;
                reloadItems(page);
            });
            filterDialog.show();
        });
    }, [getQuery, reloadItems]);

    const initPage = useCallback((page: HTMLDivElement) => {
        //const alphaPickerElement = page.querySelector('.alphaPicker') as HTMLButtonElement;
        const itemsContainer = page.querySelector('.itemsContainer') as HTMLDivElement;

        /*alphaPickerElement.addEventListener('alphavaluechanged', function (e: Event) {
            const newValue = (e as CustomEvent).detail.value;
            const query = getQuery(page);
            if (newValue === '#') {
                query.NameLessThan = 'A';
                delete query.NameStartsWith;
            } else {
                query.NameStartsWith = newValue;
                delete query.NameLessThan;
            }
            query.StartIndex = 0;
            reloadItems(page);
        });*/
        /*this.alphaPicker = new AlphaPicker({
            element: alphaPickerElement,
            valueChangeEvent: 'click'
        });*/

        //(page.querySelector('.alphaPicker') as HTMLDivElement).classList.add('alphabetPicker-right');
        //alphaPickerElement.classList.add('alphaPicker-fixed-right');
        itemsContainer.classList.add('padded-right-withalphapicker');

        (page.querySelector('.btnFilter') as HTMLButtonElement).addEventListener('click', () => {
            showFilterMenu();
        });
        (page.querySelector('.btnSort') as HTMLButtonElement).addEventListener('click', function (e) {
            libraryBrowser.showSortMenu({
                items: [{
                    name: globalize.translate('Name'),
                    id: 'SortName,ProductionYear'
                }, {
                    name: globalize.translate('OptionImdbRating'),
                    id: 'CommunityRating,SortName,ProductionYear'
                }, {
                    name: globalize.translate('OptionCriticRating'),
                    id: 'CriticRating,SortName,ProductionYear'
                }, {
                    name: globalize.translate('OptionDateAdded'),
                    id: 'DateCreated,SortName,ProductionYear'
                }, {
                    name: globalize.translate('OptionDatePlayed'),
                    id: 'DatePlayed,SortName,ProductionYear'
                }, {
                    name: globalize.translate('OptionParentalRating'),
                    id: 'OfficialRating,SortName,ProductionYear'
                }, {
                    name: globalize.translate('OptionPlayCount'),
                    id: 'PlayCount,SortName,ProductionYear'
                }, {
                    name: globalize.translate('OptionReleaseDate'),
                    id: 'PremiereDate,SortName,ProductionYear'
                }, {
                    name: globalize.translate('Runtime'),
                    id: 'Runtime,SortName,ProductionYear'
                }],
                callback: function () {
                    getQuery(page).StartIndex = 0;
                    reloadItems(page);
                },
                query: getQuery(page),
                button: e.target
            });
        });
        const btnSelectView = page.querySelector('.btnSelectView') as HTMLButtonElement;
        btnSelectView.addEventListener('click', (e) => {
            libraryBrowser.showLayoutMenu(e.target, getCurrentViewStyle(), 'Banner,List,Poster,PosterCard,Thumb,ThumbCard'.split(','));
        });
        btnSelectView.addEventListener('layoutchange', function (e) {
            const viewStyle = (e as CustomEvent).detail.viewStyle;
            getPageData(page).view = viewStyle;
            libraryBrowser.saveViewSetting(getSavedQueryKey(page), viewStyle);
            getQuery(page).StartIndex = 0;
            onViewStyleChange();
            reloadItems(page);
        });
    }, [getCurrentViewStyle, getPageData, getQuery, getSavedQueryKey, onViewStyleChange, reloadItems, showFilterMenu]);

    const initTab = useCallback(() => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }
        initPage(page);
        onViewStyleChange();
    }, [initPage, onViewStyleChange]);

    /*const initTab = () => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }
        initPage(page);
        onViewStyleChange();
    };*/

    const renderTab = useCallback(() => {
        const page = element.current;

        if (!page) {
            console.error('Unexpected null reference');
            return;
        }
        reloadItems(page);
        //this.alphaPicker?.updateControls(getQuery(page));
    }, [reloadItems]);

    useEffect(() => {
        initTab();
    }, [initTab]);

    useEffect(() => {
        renderTab();
    }, [renderTab]);

    return (
        <div ref={element}>
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
    );
};

export default Movies;
