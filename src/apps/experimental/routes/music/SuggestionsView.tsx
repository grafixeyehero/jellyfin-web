import React, { FC } from 'react';

import SuggestionsItemsContainer from '../../components/library/SuggestionsItemsContainer';
import FavoriteItemsContainer from '../../components/library/FavoriteItemsContainer';
import { LibraryViewProps } from 'types/library';
import { SectionsView } from 'types/suggestionsSections';

const SuggestionsView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <>
            <SuggestionsItemsContainer
                parentId={parentId}
                sectionsView={[
                    SectionsView.LatestMusic,
                    SectionsView.FrequentlyPlayedMusic,
                    SectionsView.RecentlyPlayedMusic
                ]}
            />
            <FavoriteItemsContainer
                parentId={parentId}
                sectionsView={[
                    SectionsView.FavoriteArtists,
                    SectionsView.FavoriteAlbums,
                    SectionsView.FavoriteSongs
                ]}
            />
        </>
    );
};

export default SuggestionsView;
