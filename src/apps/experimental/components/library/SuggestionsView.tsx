import React, { FC } from 'react';
import Box from '@mui/material/Box';
import SuggestionsItemsContainer from './SuggestionsItemsContainer';
import RecommendationItemsContainer from './RecommendationItemsContainer';
import FavoriteItemsContainer from './FavoriteItemsContainer';
import { SuggestionSectionView } from 'types/suggestionsSections';
import { FavoriteSectionView } from 'types/favoriteSections';
import { ParentId } from 'types/library';

interface SuggestionsViewProps {
    parentId: ParentId;
    suggestionSectionViews: SuggestionSectionView[] | undefined;
    favoriteSectionViews: FavoriteSectionView[] | undefined;
    isMovieRecommendations: boolean | undefined;
}

const SuggestionsView: FC<SuggestionsViewProps> = ({
    parentId,
    suggestionSectionViews = [],
    favoriteSectionViews = [],
    isMovieRecommendations = false
}) => {
    return (
        <Box>
            <SuggestionsItemsContainer
                parentId={parentId}
                sectionsViews={suggestionSectionViews}
            />

            <FavoriteItemsContainer
                parentId={parentId}
                sectionsViews={favoriteSectionViews}
            />

            {isMovieRecommendations && (
                <RecommendationItemsContainer parentId={parentId} />
            )}
        </Box>
    );
};

export default SuggestionsView;
