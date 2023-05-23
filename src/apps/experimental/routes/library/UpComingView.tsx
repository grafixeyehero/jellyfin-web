import React, { FC } from 'react';
import UpComingItemsContainer from 'apps/experimental/components/library/container/UpComingItemsContainer';
import Loading from 'components/loading/LoadingComponent';
import { useGetUpcomingEpisodes } from 'hooks/useFetchItems';
import globalize from 'scripts/globalize';

interface UpComingViewProps {
    parentId?: string | null;
}

const UpComingView: FC<UpComingViewProps> = ({ parentId }) => {
    const { isLoading, data: upcomingEpisodesResult } =
    useGetUpcomingEpisodes(parentId);

    if (isLoading) return <Loading />;

    return (
        <>
            {!upcomingEpisodesResult?.Items?.length ? (
                <div className='noItemsMessage centerMessage'>
                    <h1>{globalize.translate('MessageNothingHere')}</h1>
                    <p>
                        {globalize.translate(
                            'MessagePleaseEnsureInternetMetadata'
                        )}
                    </p>
                </div>
            ) : (
                <UpComingItemsContainer
                    topParentId={parentId}
                    items={upcomingEpisodesResult.Items || []}
                />
            )}
        </>
    );
};

export default UpComingView;
