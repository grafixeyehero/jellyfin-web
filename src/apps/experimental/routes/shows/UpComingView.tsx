import React, { FC } from 'react';
import globalize from 'scripts/globalize';
import Loading from 'components/loading/LoadingComponent';
import { useGetUpcomingEpisodes } from 'hooks/useFetchItems';
import UpComingContainer from 'apps/experimental/components/library/UpComingContainer';
import { LibraryViewProps } from 'types/library';

const UpComingView: FC<LibraryViewProps> = ({ parentId }) => {
    const { isLoading, data: upcomingEpisodesResult } = useGetUpcomingEpisodes(parentId);

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
                <UpComingContainer
                    parentId={parentId}
                    items={upcomingEpisodesResult.Items ?? []}
                />
            )}
        </>
    );
};

export default UpComingView;
