import React, { FC } from 'react';
import Box from '@mui/material/Box';
import { useGetGroupsUpcomingEpisodes } from 'hooks/useFetchItems';
import Loading from 'components/loading/LoadingComponent';
import globalize from 'scripts/globalize';
import SectionContainer from './SectionContainer';
import { ParentId } from 'types/library';

interface UpComingViewProps {
    parentId: ParentId;
}

const UpComingView: FC<UpComingViewProps> = ({ parentId }) => {
    const { isLoading, data: groupsUpcomingEpisodes } =
        useGetGroupsUpcomingEpisodes(parentId);

    if (isLoading) return <Loading />;

    if (!groupsUpcomingEpisodes?.length) {
        return (
            <div className='noItemsMessage centerMessage'>
                <h1>{globalize.translate('MessageNothingHere')}</h1>
                <p>
                    {globalize.translate('MessagePleaseEnsureInternetMetadata')}
                </p>
            </div>
        );
    }

    return (
        <Box>
            {groupsUpcomingEpisodes?.map((group) => (
                <SectionContainer
                    key={group.name}
                    sectionTitle={group.name}
                    items={group.items ?? []}
                    cardOptions={{
                        shape: 'overflowBackdrop',
                        showLocationTypeIndicator: false,
                        showParentTitle: true,
                        preferThumb: true,
                        lazy: true,
                        showDetailsMenu: true,
                        missingIndicator: false,
                        cardLayout: false
                    }}
                />
            ))}
        </Box>
    );
};

export default UpComingView;
