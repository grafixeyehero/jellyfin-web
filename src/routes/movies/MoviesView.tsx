import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const MoviesView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <ViewItemsContainer
            viewType='movies'
            parentId={topParentId}
            context={context}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.Movie]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default MoviesView;
