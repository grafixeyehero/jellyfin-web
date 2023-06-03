import React, { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useGetUpcomingEpisodes } from 'hooks/useFetchItems';
import Loading from 'components/loading/LoadingComponent';
import globalize from 'scripts/globalize';
import UpComingItemsContainer from '../../components/library/container/UpComingItemsContainer';

interface UpComingViewProps {
    parentId?: string | null;
}

const UpComingView: FC<UpComingViewProps> = ({ parentId }) => {
    const [ enableFetch, setEnableFetch ] = useState(false);
    const { isLoading, data: upcomingEpisodesResult } =
    useGetUpcomingEpisodes(parentId, enableFetch);

    useEffect(() => {
        if (parentId) {
            setEnableFetch(true);
        }

        return () => {
            setEnableFetch(false);
        };
    }, [parentId]);

    if (isLoading) return <Loading />;

    return (
        <Box>
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
        </Box>
    );
};

export default UpComingView;
