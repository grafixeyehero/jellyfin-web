import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const FavoritesView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <ViewItemsContainer
            viewType='favorites'
            parentId={topParentId}
            itemType={[BaseItemKind.Movie]}
            noItemsMessage='MessageNoFavoritesAvailable'
        />
    );
};

export default FavoritesView;
