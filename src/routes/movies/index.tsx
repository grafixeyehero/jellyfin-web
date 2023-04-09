import React, { FC, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import TabsComponent from '../../components/common/TabsComponent';
import Page from '../../components/Page';
import { useGetItem } from '../../hooks/useFetchItems';
import LibraryMenu from '../../scripts/libraryMenu';
import * as userSettings from '../../scripts/settings/userSettings';
import CollectionsView from './CollectionsView';
import FavoritesView from './FavoritesView';
import GenresView from './GenresView';
import MoviesView from './MoviesView';
import SuggestionsView from './SuggestionsView';
import TrailersView from './TrailersView';

const getDefaultTabIndex = (folderId: string | null) => {
    switch (userSettings.get('landing-' + folderId, false)) {
        case 'suggestions':
            return 1;

        case 'trailers':
            return 2;

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

interface StringArray {
    [index: number]: string;
}

interface NunmberArray {
    [key: string]: number;
}

const indexToTabName: StringArray = {
    0: 'movies',
    1: 'suggestions',
    2: 'trailers',
    3: 'favorites',
    4: 'collections',
    5: 'genres'
};

const tabNameToIndex: NunmberArray = {
    movies: 0,
    suggestions: 1,
    trailers: 2,
    favorites: 3,
    collections: 4,
    genres: 5
};

const Movies: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const itemId = searchParams.get('topParentId');

    const currentTabIndex = tabNameToIndex[searchParams.get('tab') || indexToTabName[getDefaultTabIndex(itemId)]];

    const { data: item } = useGetItem(itemId);

    const onChange = useCallback(
        (event: React.SyntheticEvent, newValue: number) => {
            searchParams.set('tab', indexToTabName[newValue]);
            setSearchParams(searchParams);
        },
        [searchParams, setSearchParams]
    );

    const getTabComponent = (index: number) => {
        if (index == null) {
            throw new Error('index cannot be null');
        }

        let component;
        switch (index) {
            case 1:
                component = <SuggestionsView topParentId={itemId} />;
                break;

            case 2:
                component = <TrailersView topParentId={itemId} />;
                break;

            case 3:
                component = <FavoritesView topParentId={itemId} />;
                break;

            case 4:
                component = <CollectionsView topParentId={itemId} context={item?.CollectionType} />;
                break;

            case 5:
                component = <GenresView topParentId={itemId} context={item?.CollectionType} />;
                break;
            default:
                component = <MoviesView topParentId={itemId} context={item?.CollectionType} />;
        }

        return component;
    };

    useEffect(() => {
        if (item?.Type === 'CollectionFolder' && item.Name) {
            LibraryMenu.setTitle(item.Name);
        }
    }, [item?.CollectionType, item?.Name, item?.Type]);

    return (
        <Page
            id='moviesPage'
            className='mainAnimatedPage backdropPage libraryPage collectionEditorPage libraryPaddingTop'
            backDropType='movie'
            topParentId={itemId}
        >
            <TabsComponent
                selectedIndex={currentTabIndex}
                type='movies'
                onChange={onChange}
            />

            <Box sx={{ paddingTop: '3.8em' }}>
                {getTabComponent(currentTabIndex)}
            </Box>
        </Page>
    );
};

export default Movies;
