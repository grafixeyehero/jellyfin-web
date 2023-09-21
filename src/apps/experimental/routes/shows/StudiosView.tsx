import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';

import ItemsView from '../../components/library/ItemsView';
import { LibraryViewProps } from 'types/library';
import { LibraryTab } from 'types/libraryTab';

const StudiosView: FC<LibraryViewProps> = ({ parentId }) => {
    return (
        <ItemsView
            viewType={LibraryTab.Networks}
            parentId={parentId}
            isBtnFilterEnabled={false}
            isBtnGridListEnabled={false}
            isBtnSortEnabled={false}
            isAlphabetPickerEnabled={false}
            itemType={[BaseItemKind.Series]}
            noItemsMessage= 'MessageNoItemsAvailable'
        />
    );
};

export default StudiosView;
