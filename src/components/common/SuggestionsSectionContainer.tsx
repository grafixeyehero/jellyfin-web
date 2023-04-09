import React, { FC } from 'react';
import globalize from '../../scripts/globalize';
import { appRouter } from '../appRouter';
import SectionContainer from './SectionContainer';
import { Sections } from '../../types/interface';
import { useGetItemsBySectionType } from '../../hooks/useFetchItems';
import Loading from '../loading/LoadingComponent';

interface SuggestionsSectionContainerProps {
    topParentId?: string | null;
    section: Sections;
}

const SuggestionsSectionContainer: FC<SuggestionsSectionContainerProps> = ({
    topParentId,
    section
}) => {
    const getRouteUrl = () => {
        return appRouter.getRouteUrl('list', {
            serverId: window.ApiClient.serverId(),
            itemTypes: section.type,
            parentId: topParentId
        });
    };

    const { isLoading, data: items } = useGetItemsBySectionType(
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
                ...section.cardOptions
            }}
        />
    );
};

export default SuggestionsSectionContainer;
