import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const PlaylistsView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <ViewItemsContainer
            viewType='playlist'
            parentId={topParentId}
            isBtnFilterEnabled={false}
            isBtnSelectViewEnabled={false}
            isBtnSortEnabled={false}
            isAlphaPickerEnabled={false}
            itemType={[BaseItemKind.Playlist]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default PlaylistsView;
