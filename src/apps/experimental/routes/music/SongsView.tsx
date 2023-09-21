import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { LibraryTab } from 'types/libraryTab';

const SongsView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Songs}
            parentId={parentId}
            //collectionType={CollectionType.Music}
            //isBtnGridListEnabled={false}
            isAlphabetPickerEnabled={false}
            itemType={[BaseItemKind.Audio]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default SongsView;
