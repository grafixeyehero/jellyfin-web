import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { CollectionType } from 'types/collectionType';
import { LibraryViewProps } from 'types/library';
import { LibraryTab } from 'types/libraryTab';

const ArtistsView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Artists}
            parentId={parentId}
            collectionType={CollectionType.Music}
            isBtnSortEnabled={false}
            itemType={[]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default ArtistsView;
