import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { CollectionType } from 'types/collectionType';
import { LibraryTab } from 'types/libraryTab';

const EpisodesView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Episodes}
            parentId={parentId}
            collectionType={CollectionType.TvShows}
            isAlphabetPickerEnabled={false}
            itemType={[BaseItemKind.Episode]}
            noItemsMessage='MessageNoEpisodesFound'
        />
    );
};

export default EpisodesView;
