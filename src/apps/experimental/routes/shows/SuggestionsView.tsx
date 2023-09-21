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
                    SectionsView.ContinueWatchingEpisode,
                    SectionsView.LatestEpisode,
                    SectionsView.NextUp
                ]}
            />
            <FavoriteItemsContainer
                parentId={parentId}
                sectionsView={[
                    SectionsView.FavoriteShows,
                    SectionsView.FavoriteEpisode
                ]}
            />
        </>
    );
};

export default SuggestionsView;
