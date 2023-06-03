import React, { FC } from 'react';
import { useGetItemsByFavoriteType } from 'hooks/useFetchItems';
import Loading from 'components/loading/LoadingComponent';
import { appRouter } from 'components/router/appRouter';
import globalize from 'scripts/globalize';
import SectionContainer from './SectionContainer';

import { Sections } from 'types/sections';
interface FavoritesSectionContainerProps {
    topParentId?: string | null;
    section: Sections;
}

const FavoritesSectionContainer: FC<FavoritesSectionContainerProps> = ({
    topParentId,
    section
}) => {
    const getRouteUrl = () => {
        return appRouter.getRouteUrl('list', {
            serverId: window.ApiClient.serverId(),
            itemTypes: section.type,
            isFavorite: true
        });
    };

    const { isLoading, data: items } = useGetItemsByFavoriteType(
        section,
        topParentId
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <SectionContainer
            sectionTitle={globalize.translate(section.name)}
            items={items || []}
            url={getRouteUrl()}
            cardOptions={{
                ...section.cardOptions,
                overlayText: section.cardOptions.overlayText !== false,
                scalable: true,
                cardLayout: false
            }}
        />
    );
};

export default FavoritesSectionContainer;
