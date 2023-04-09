import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import GenresSectionContainer from '../../components/common/GenresSectionContainer';
import { useGetGenres } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';
import Loading from '../loading/LoadingComponent';

interface GenresItemsContainerProps {
    topParentId?: string | null;
    viewType: string;
    context?: string | null;
    itemType: BaseItemKind[];
}

const GenresItemsContainer: FC<GenresItemsContainerProps> = ({
    topParentId,
    viewType,
    context,
    itemType
}) => {
    const { isLoading, data: genresResult } = useGetGenres(
        topParentId,
        itemType
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            {!genresResult?.Items?.length ? (
                <div className='noItemsMessage centerMessage'>
                    <h1>{globalize.translate('MessageNothingHere')}</h1>
                    <p>{globalize.translate('MessageNoGenresAvailable')}</p>
                </div>
            ) : (
                genresResult?.Items
                && genresResult?.Items.map((genre) => (
                    <GenresSectionContainer
                        key={genre.Id}
                        viewType={viewType}
                        context={context}
                        parentId={topParentId}
                        itemType={itemType}
                        genre={genre}
                    />
                ))
            )}
        </>
    );
};

export default GenresItemsContainer;
