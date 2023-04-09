import React, { FC } from 'react';

import ViewUpComingContainer from '../../components/common/ViewUpComingContainer';
import Loading from '../../components/loading/LoadingComponent';
import { useGetUpcomingEpisodes } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';
import { LibraryViewProps } from '../../types/interface';

const UpComingView: FC<LibraryViewProps> = ({ topParentId }) => {
    const { isLoading, data: upcomingEpisodesResult } =
    useGetUpcomingEpisodes(topParentId);

    if (isLoading) {
        return <Loading />;
    }

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
                <ViewUpComingContainer
                    topParentId={topParentId}
                    items={upcomingEpisodesResult.Items || []}
                />
            )}
        </>
    );
};

export default UpComingView;
