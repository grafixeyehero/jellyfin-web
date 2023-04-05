import React, { FC } from 'react';
import globalize from '../../scripts/globalize';
import { appRouter } from '../appRouter';
import SectionContainer from './SectionContainer';
import Loading from '../loading/LoadingComponent';
import { useGetItemsByFavoriteType } from '../../hooks/useFetchItems';
import { Sections } from '../../types/interface';
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
