import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const SeriesView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <ViewItemsContainer
            viewType='series'
            parentId={topParentId}
            context={context}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.Series]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default SeriesView;
