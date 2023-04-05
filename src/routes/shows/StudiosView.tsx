import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const StudiosView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <ViewItemsContainer
            viewType='studios'
            parentId={topParentId}
            isBtnFilterEnabled={false}
            isBtnSelectViewEnabled={false}
            isBtnSortEnabled={false}
            isAlphaPickerEnabled={false}
            itemType={[BaseItemKind.Series]}
            noItemsMessage= 'MessageNoItemsAvailable'
        />
    );
};

export default StudiosView;
