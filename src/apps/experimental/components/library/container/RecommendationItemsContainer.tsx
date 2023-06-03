import React, { FC, useEffect, useState } from 'react';
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
    const [ enableFetch, setEnableFetch ] = useState(false);
    const {
        isLoading,
        data: movieRecommendationsItems
    } = useGetMovieRecommendations(topParentId, enableFetch);

    useEffect(() => {
        if (topParentId) {
            setEnableFetch(true);
        }

        return () => {
            setEnableFetch(false);
        };
    }, [topParentId]);

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
                movieRecommendationsItems.map((recommendation, index) => {
                    return (
                        <RecommendationContainer
                            // eslint-disable-next-line react/no-array-index-key
                            key={index} // use a unique id return value may have duplicate id
                            recommendation={recommendation}
                        />
                    );
                })
            )}
        </>
    );
};

export default RecommendationItemsContainer;
