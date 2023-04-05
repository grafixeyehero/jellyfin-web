import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const AlbumsView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <ViewItemsContainer
            viewType='albums'
            parentId={topParentId}
            context={context}
            isBtnPlayAllEnabled={true}
            isBtnShuffleEnabled={true}
            itemType={[BaseItemKind.MusicAlbum]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default AlbumsView;
