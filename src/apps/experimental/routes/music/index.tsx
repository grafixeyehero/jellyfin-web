import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import PageTabContent from '../../components/library/PageTabContent';
import { LibraryTab } from 'types/libraryTab';
import { CollectionType } from 'types/collectionType';
import { LibraryTabContent, LibraryTabMapping } from 'types/libraryTabContent';
import { SuggestionSectionView } from 'types/suggestionsSections';
import { FavoriteSectionView } from 'types/favoriteSections';

const albumArtistsTabContent: LibraryTabContent = {
    viewType: LibraryTab.AlbumArtists,
    collectionType: CollectionType.Music,
    isBtnSortEnabled: false
};

const albumsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Albums,
    collectionType: CollectionType.Music,
    isBtnPlayAllEnabled: true,
    isBtnShuffleEnabled: true,
    itemType: [BaseItemKind.MusicAlbum]
};

const artistsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Artists,
    collectionType: CollectionType.Music,
    isBtnSortEnabled: false
};

const playlistsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Playlists,
    isBtnFilterEnabled: false,
    isBtnGridListEnabled: false,
    isBtnSortEnabled: false,
    isAlphabetPickerEnabled: false,
    itemType: [BaseItemKind.Playlist]
};

const songsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Songs,
    //collectionType: CollectionType.Music
    //isBtnGridListEnabled: false
    isAlphabetPickerEnabled: false,
    itemType: [BaseItemKind.Audio]
};

const suggestionsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Suggestions,
    collectionType: CollectionType.Music,
    sectionsType: {
        suggestionSectionViews: [
            SuggestionSectionView.LatestMusic,
            SuggestionSectionView.FrequentlyPlayedMusic,
            SuggestionSectionView.RecentlyPlayedMusic
        ],
        favoriteSectionViews: [
            FavoriteSectionView.FavoriteArtists,
            FavoriteSectionView.FavoriteAlbums,
            FavoriteSectionView.FavoriteSongs
        ]
    }
};

const genresTabContent: LibraryTabContent = {
    viewType: LibraryTab.Genres,
    collectionType: CollectionType.Music,
    itemType: [BaseItemKind.MusicAlbum]
};

const musicTabMapping: LibraryTabMapping = {
    0: albumsTabContent,
    1: suggestionsTabContent,
    2: albumArtistsTabContent,
    3: artistsTabContent,
    4: playlistsTabContent,
    5: songsTabContent,
    6: genresTabContent
};

const Music: FC = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchParamsParentId = searchParams.get('topParentId');
    const searchParamsTab = searchParams.get('tab');
    const currentTabIndex =
        searchParamsTab !== null ?
            parseInt(searchParamsTab, 10) :
            getDefaultTabIndex(location.pathname, searchParamsParentId);
    const currentTab = musicTabMapping[currentTabIndex];

    return (
        <Page
            id='musicPage'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='musicartist'
        >
            <PageTabContent
                currentTab={currentTab}
                parentId={searchParamsParentId}
            />
        </Page>
    );
};

export default Music;
