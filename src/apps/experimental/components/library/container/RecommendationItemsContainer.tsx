import React, { FC } from 'react';
import uuid from 'react-uuid';
import { useGetMovieRecommendations } from 'hooks/useFetchItems';
import Loading from 'components/loading/LoadingComponent';
import globalize from 'scripts/globalize';
import RecommendationContainer from './RecommendationContainer';

interface RecommendationItemsContainerProps {
    topParentId?: string | null;
}

const RecommendationItemsContainer: FC<RecommendationItemsContainerProps> = ({
    topParentId
}) => {
    const {
        isLoading,
        data: movieRecommendationsItems
    } = useGetMovieRecommendations(topParentId);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
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
                            key={uuid()} // use a unique id return value may have same id
                            recommendation={recommendation}
                        />
                    );
                })
            )}
        </>
    );
};

export default RecommendationItemsContainer;
