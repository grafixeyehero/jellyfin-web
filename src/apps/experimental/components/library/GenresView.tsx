import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import escapeHTML from 'escape-html';
import { useGetGroupsGenres } from 'hooks/useFetchItems';
import { appRouter } from 'components/router/appRouter';
import globalize from 'scripts/globalize';
import Loading from 'components/loading/LoadingComponent';
import SectionContainer from './SectionContainer';
import { CollectionType } from 'types/collectionType';
import { ParentId } from 'types/library';

interface GenresViewProps {
    parentId: ParentId;
    collectionType: CollectionType | undefined;
    itemType: BaseItemKind[];
}

const GenresView: FC<GenresViewProps> = ({ parentId, collectionType, itemType }) => {
    const { isLoading, data: groupsGenres } = useGetGroupsGenres(parentId, itemType);

    if (isLoading) {
        return <Loading />;
    }

    if (!groupsGenres?.length) {
        return (
            <div className='noItemsMessage centerMessage'>
                <h1>{globalize.translate('MessageNothingHere')}</h1>
                <p>{globalize.translate('MessageNoGenresAvailable')}</p>
            </div>
        );
    }

    return (
        <>
            {groupsGenres.map(({ genre, items }) => (
                <SectionContainer
                    key={genre.Id}
                    sectionTitle={escapeHTML(genre.Name)}
                    items={items ?? []}
                    url={appRouter.getRouteUrl(genre, {
                        context: collectionType,
                        parentId: parentId
                    })}
                    cardOptions={{
                        scalable: true,
                        overlayPlayButton: true,
                        showTitle: true,
                        centerText: true,
                        cardLayout: false,
                        shape: collectionType === CollectionType.Music ? 'overflowSquare' : 'overflowPortrait',
                        showParentTitle: collectionType === CollectionType.Music,
                        showYear: collectionType !== CollectionType.Music
                    }}
                />
            ))
            }
        </>
    );
};

export default GenresView;
