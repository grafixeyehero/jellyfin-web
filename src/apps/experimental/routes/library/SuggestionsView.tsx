import React, { FC } from 'react';
import Box from '@mui/material/Box';
import SuggestionsItemsContainer from '../../components/library/container/SuggestionsItemsContainer';
import RecommendationItemsContainer from '../../components/library/container/RecommendationItemsContainer';

interface SuggestionsViewProps {
    collectionType?: string | null;
    parentId?: string | null;
}

const SuggestionsView: FC<SuggestionsViewProps> = ({ collectionType, parentId }) => {
    const getVisibleSuggestionsId = () => {
        const visibleSuggestionsId: string[] = [];

        if (collectionType === 'movies') {
            visibleSuggestionsId.push('suggestionContinueWatchingMovies');
            visibleSuggestionsId.push('suggestionLatestMovies');
        }

        if (collectionType === 'tvshows') {
            visibleSuggestionsId.push('suggestionContinueWatchingEpisode');
            visibleSuggestionsId.push('suggestionLatestEpisode');
            visibleSuggestionsId.push('suggestionNextUp');
        }

        if (collectionType === 'music') {
            visibleSuggestionsId.push('suggestionLatestMusic');
            visibleSuggestionsId.push('suggestionFrequentlyPlayed');
            visibleSuggestionsId.push('suggestionRecentlyPlayed');
        }

        return visibleSuggestionsId;
    };

    return (
        <Box>
            <SuggestionsItemsContainer
                topParentId={parentId}
                visibleId={getVisibleSuggestionsId()}
            />

            {collectionType === 'movies' && (
                <RecommendationItemsContainer topParentId={parentId} />
            )}
        </Box>
    );
};

export default SuggestionsView;
