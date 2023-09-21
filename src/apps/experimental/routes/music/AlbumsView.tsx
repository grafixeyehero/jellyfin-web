import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryTab } from 'types/libraryTab';
import { LibraryViewProps } from 'types/library';
import { CollectionType } from 'types/collectionType';

const AlbumsView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Albums}
            parentId={parentId}
            collectionType={CollectionType.Music}
            isBtnPlayAllEnabled={true}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.MusicAlbum]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default AlbumsView;
