import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';
import { LibraryTab } from './libraryTab';
import { CollectionType } from './collectionType';
import { SuggestionSectionView } from './suggestionsSections';
import { FavoriteSectionView } from './favoriteSections';

export interface SuggestionsSectionsType {
    suggestionSectionViews: SuggestionSectionView[];
    favoriteSectionViews?: FavoriteSectionView[];
    isMovieRecommendations?: boolean;
}

export interface LibraryTabContent {
    viewType: LibraryTab;
    itemType?: BaseItemKind[];
    collectionType?: CollectionType;
    sectionsType?: SuggestionsSectionsType;
    isBtnPlayAllEnabled?: boolean;
    isBtnQueueEnabled?: boolean;
    isBtnShuffleEnabled?: boolean;
    isBtnSortEnabled?: boolean;
    isBtnFilterEnabled?: boolean;
    isBtnNewCollectionEnabled?: boolean;
    isBtnGridListEnabled?: boolean;
    isAlphabetPickerEnabled?: boolean;
    noItemsMessage?: string;
}

export interface LibraryTabMapping {
    [index: number]: LibraryTabContent;
}
