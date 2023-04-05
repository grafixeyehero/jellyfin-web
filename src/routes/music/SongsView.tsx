import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const SongsView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <ViewItemsContainer
            viewType='songs'
            parentId={topParentId}
            isBtnSelectViewEnabled={false}
            isAlphaPickerEnabled={false}
            itemType={[BaseItemKind.Audio]}
            noItemsMessage='MessageNoItemsAvailable'
        />
    );
};

export default SongsView;
