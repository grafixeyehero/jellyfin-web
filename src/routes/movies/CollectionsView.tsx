import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const CollectionsView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <ViewItemsContainer
            viewType='collections'
            parentId={topParentId}
            context={context}
            isBtnFilterEnabled={false}
            isBtnNewCollectionEnabled={true}
            isAlphaPickerEnabled={false}
            itemType={[BaseItemKind.BoxSet]}
            noItemsMessage='MessageNoCollectionsAvailable'
        />
    );
};

export default CollectionsView;
