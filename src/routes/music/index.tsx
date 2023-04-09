import React, { FC, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import TabsComponent from '../../components/common/TabsComponent';
import Page from '../../components/Page';
import { useGetItem } from '../../hooks/useFetchItems';
import LibraryMenu from '../../scripts/libraryMenu';
import * as userSettings from '../../scripts/settings/userSettings';
import AlbumArtistsView from './AlbumArtistsView';
import AlbumsView from './AlbumsView';
import ArtistsView from './ArtistsView';
import FavoritesView from './FavoritesView';
import GenresView from './GenresView';
import PlaylistsView from './PlaylistsView';
import SongsView from './SongsView';
import SuggestionsView from './SuggestionsView';

const getDefaultTabIndex = (folderId: string | null) => {
    switch (userSettings.get('landing-' + folderId, false)) {
        case 'suggestions':
            return 1;

        case 'albumartists':
            return 2;

        case 'artists':
            return 3;

        case 'favorites':
            return 4;

        case 'playlists':
            return 5;

        case 'songs':
            return 6;

        case 'genres':
            return 7;

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
    0: 'music',
    1: 'suggestions',
    2: 'albumartists',
    3: 'artists',
    4: 'favorites',
    5: 'playlists',
    6: 'songs',
    7: 'genres'
};

const tabNameToIndex: NunmberArray = {
    music: 0,
    suggestions: 1,
    albumartists: 2,
    artists: 3,
    favorites: 4,
    playlists: 5,
    songs: 6,
    genres: 7
};

const Music: FC = () => {
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
                component = <AlbumArtistsView topParentId={itemId} context={item?.CollectionType} />;
                break;

            case 3:
                component = <ArtistsView topParentId={itemId} context={item?.CollectionType} />;
                break;

            case 4:
                component = <FavoritesView topParentId={itemId} />;
                break;

            case 5:
                component = <PlaylistsView topParentId={itemId} />;
                break;

            case 6:
                component = <SongsView topParentId={itemId} />;
                break;

            case 7:
                component = <GenresView topParentId={itemId} context={item?.CollectionType} />;
                break;
            default:
                component = <AlbumsView topParentId={itemId} context={item?.CollectionType} />;
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
            id='musicPage'
            className='mainAnimatedPage backdropPage libraryPage collectionEditorPage libraryPaddingTop'
            backDropType='musicartist'
            topParentId={itemId}
        >
            <TabsComponent
                selectedIndex={currentTabIndex}
                type='music'
                onChange={onChange}
            />

            <Box sx={{ paddingTop: '3.8em' }}>
                {getTabComponent(currentTabIndex)}
            </Box>
        </Page>
    );
};

export default Music;
