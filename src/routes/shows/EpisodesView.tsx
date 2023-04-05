import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';

import ViewItemsContainer from '../../components/common/ViewItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const EpisodesView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <ViewItemsContainer
            viewType='episodes'
            parentId={topParentId}
            context={context}
            isAlphaPickerEnabled={false}
            itemType={[BaseItemKind.Episode]}
            noItemsMessage='MessageNoEpisodesFound'
        />
    );
};

export default EpisodesView;
