import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { CollectionType } from 'types/collectionType';
import { LibraryTab } from 'types/libraryTab';

const PhotosView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Photos}
            parentId={parentId}
            collectionType={CollectionType.HomeVideos}
            isBtnPlayAllEnabled={true}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.Photo]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default PhotosView;
