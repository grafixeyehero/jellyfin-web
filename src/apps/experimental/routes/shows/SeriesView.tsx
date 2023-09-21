import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { CollectionType } from 'types/collectionType';
import { LibraryTab } from 'types/libraryTab';

const SeriesView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Series}
            parentId={parentId}
            collectionType={CollectionType.TvShows}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.Series]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default SeriesView;
