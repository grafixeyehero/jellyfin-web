import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { LibraryTab } from 'types/libraryTab';

const PlaylistsView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Playlists}
            parentId={parentId}
            isBtnFilterEnabled={false}
            isBtnGridListEnabled={false}
            isBtnSortEnabled={false}
            isAlphabetPickerEnabled={false}
            itemType={[BaseItemKind.Playlist]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default PlaylistsView;
