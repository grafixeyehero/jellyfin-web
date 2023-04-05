import React, { FC } from 'react';
import uuid from 'react-uuid';

import RecommendationContainer from '../../components/common/RecommendationContainer';
import SuggestionsItemsContainer from '../../components/common/SuggestionsItemsContainer';
import Loading from '../../components/loading/LoadingComponent';
import { useGetMovieRecommendations } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';
import { LibraryViewProps } from '../../types/interface';

const SuggestionsView: FC<LibraryViewProps> = ({ topParentId }) => {
    const {
        isLoading,
        data: movieRecommendationsItems
    } = useGetMovieRecommendations(topParentId);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <SuggestionsItemsContainer
                topParentId={topParentId}
                visibleId={[
                    'suggestionContinueWatchingMovies',
                    'suggestionLatestMovies'
                ]}
            />

            {!movieRecommendationsItems?.length ? (
                <div className='noItemsMessage centerMessage'>
                    <h1>{globalize.translate('MessageNothingHere')}</h1>
                    <p>
                        {globalize.translate(
                            'MessageNoMovieSuggestionsAvailable'
                        )}
                    </p>
                </div>
            ) : (
                movieRecommendationsItems.map((recommendation) => {
                    return (
                        <RecommendationContainer
                            key={uuid()}
                            recommendation={recommendation}
                        />
                    );
                })
            )}
        </>
    );
};

export default SuggestionsView;
