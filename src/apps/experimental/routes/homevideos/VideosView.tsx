import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { CollectionType } from 'types/collectionType';
import { LibraryTab } from 'types/libraryTab';

const VideosView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Videos}
            parentId={parentId}
            collectionType={CollectionType.HomeVideos}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.Video]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default VideosView;
