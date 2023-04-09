import React, { FC } from 'react';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const ArtistsView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <ViewItemsContainer
            viewType='artists'
            parentId={topParentId}
            context={context}
            isBtnSortEnabled={false}
            itemType={[]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default ArtistsView;
