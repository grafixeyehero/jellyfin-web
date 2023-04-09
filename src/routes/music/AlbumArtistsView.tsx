import React, { FC } from 'react';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const AlbumArtistsView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <ViewItemsContainer
            viewType='albumArtists'
            parentId={topParentId}
            context={context}
            isBtnSortEnabled={false}
            itemType={[]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default AlbumArtistsView;
