import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { CollectionType } from 'types/collectionType';
import { LibraryTab } from 'types/libraryTab';

const BooksView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Books}
            parentId={parentId}
            collectionType={CollectionType.Books}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.Book]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default BooksView;
