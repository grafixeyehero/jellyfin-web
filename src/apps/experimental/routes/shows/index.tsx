import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import PageTabContent from '../../components/library/PageTabContent';
import { LibraryTab } from 'types/libraryTab';
import { CollectionType } from 'types/collectionType';
import { SuggestionSectionView } from 'types/suggestionsSections';
import { FavoriteSectionView } from 'types/favoriteSections';
import { LibraryTabContent, LibraryTabMapping } from 'types/libraryTabContent';

const episodesTabContent: LibraryTabContent = {
    viewType: LibraryTab.Episodes,
    itemType: [BaseItemKind.Episode],
    collectionType: CollectionType.TvShows,
    isAlphabetPickerEnabled: false,
    noItemsMessage: 'MessageNoEpisodesFound'
};

const seriesTabContent: LibraryTabContent = {
    viewType: LibraryTab.Series,
    itemType: [BaseItemKind.Series],
    collectionType: CollectionType.TvShows,
    isBtnShuffleEnabled: true
};

const networksTabContent: LibraryTabContent = {
    viewType: LibraryTab.Networks,
    itemType: [BaseItemKind.Series],
    isBtnFilterEnabled: false,
    isBtnGridListEnabled: false,
    isBtnSortEnabled: false,
    isAlphabetPickerEnabled: false
};

const upcomingTabContent: LibraryTabContent = {
    viewType: LibraryTab.Upcoming
};

const suggestionsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Suggestions,
    collectionType: CollectionType.TvShows,
    sectionsType: {
        suggestionSectionViews: [
            SuggestionSectionView.ContinueWatchingEpisode,
            SuggestionSectionView.LatestEpisode,
            SuggestionSectionView.NextUp
        ],
        favoriteSectionViews: [
            FavoriteSectionView.FavoriteShows,
            FavoriteSectionView.FavoriteEpisode
        ]
    }
};

const genresTabContent: LibraryTabContent = {
    viewType: LibraryTab.Genres,
    itemType: [BaseItemKind.Series],
    collectionType: CollectionType.TvShows
};

const tvShowsTabMapping: LibraryTabMapping = {
    0: seriesTabContent,
    1: suggestionsTabContent,
    2: upcomingTabContent,
    3: genresTabContent,
    4: networksTabContent,
    5: episodesTabContent
};

const Shows: FC = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchParamsParentId = searchParams.get('topParentId');
    const searchParamsTab = searchParams.get('tab');
    const currentTabIndex =
        searchParamsTab !== null ?
            parseInt(searchParamsTab, 10) :
            getDefaultTabIndex(location.pathname, searchParamsParentId);
    const currentTab = tvShowsTabMapping[currentTabIndex];

    return (
        <Page
            id='tvshowsPage'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='series'
        >
            <PageTabContent
                currentTab={currentTab}
                parentId={searchParamsParentId}
            />
        </Page>
    );
};

export default Shows;
