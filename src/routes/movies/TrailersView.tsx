
import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const TrailersView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <ViewItemsContainer
            viewType='trailers'
            parentId={topParentId}
            itemType={[BaseItemKind.Trailer]}
            noItemsMessage='MessageNoTrailersFound'
        />
    );
};

export default TrailersView;
