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

const moviesTabContent: LibraryTabContent = {
    viewType: LibraryTab.Movies,
    collectionType: CollectionType.Movies,
    isBtnShuffleEnabled: true,
    itemType: [BaseItemKind.Movie]
};

const collectionsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Collections,
    collectionType: CollectionType.Movies,
    isBtnFilterEnabled: false,
    isBtnNewCollectionEnabled: true,
    isAlphabetPickerEnabled: false,
    itemType: [BaseItemKind.BoxSet],
    noItemsMessage: 'MessageNoCollectionsAvailable'
};

const favoritesTabContent: LibraryTabContent = {
    viewType: LibraryTab.Favorites,
    collectionType: CollectionType.Movies,
    itemType: [BaseItemKind.Movie]
};

const trailersTabContent: LibraryTabContent = {
    viewType: LibraryTab.Trailers,
    itemType: [BaseItemKind.Trailer],
    noItemsMessage: 'MessageNoTrailersFound'
};

const suggestionsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Suggestions,
    collectionType: CollectionType.Movies,
    sectionsType: {
        suggestionSectionViews: [
            SuggestionSectionView.ContinueWatchingMovies,
            SuggestionSectionView.LatestMovies
        ],
        isMovieRecommendations: true
    }
};

const genresTabContent: LibraryTabContent = {
    viewType: LibraryTab.Genres,
    collectionType: CollectionType.Movies,
    itemType: [BaseItemKind.Movie]
};

const moviesTabMapping: LibraryTabMapping = {
    0: moviesTabContent,
    1: suggestionsTabContent,
    2: trailersTabContent,
    3: favoritesTabContent,
    4: collectionsTabContent,
    5: genresTabContent
};

const Movies: FC = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchParamsParentId = searchParams.get('topParentId');
    const searchParamsTab = searchParams.get('tab');
    const currentTabIndex =
        searchParamsTab !== null ?
            parseInt(searchParamsTab, 10) :
            getDefaultTabIndex(location.pathname, searchParamsParentId);
    const currentTab = moviesTabMapping[currentTabIndex];

    return (
        <Page
            id='moviesPage'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='movie'
        >
            <PageTabContent
                //key={`${currentTab.viewType} - ${searchParamsParentId}`}
                currentTab={currentTab}
                parentId={searchParamsParentId}
            />
        </Page>
    );
};

export default Movies;
