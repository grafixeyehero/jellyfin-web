import React, { FC } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import GenresItemsContainer from '../../components/common/GenresItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const GenresView: FC<LibraryViewProps> = ({ topParentId, context }) => {
    return (
        <GenresItemsContainer
            viewType='albums'
            topParentId={topParentId}
            context={context}
            itemType={[BaseItemKind.MusicAlbum]}
        />
    );
};

export default GenresView;
