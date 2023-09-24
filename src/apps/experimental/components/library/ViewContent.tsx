import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';

import SuggestionsView from './SuggestionsView';
import UpComingView from './UpComingView';
import GenresView from './GenresView';
import ItemsView from './ItemsView';

import { LibraryTab } from 'types/libraryTab';

interface ViewContentProps {
    item: BaseItemDto | undefined;
    viewType: LibraryTab
}

const ViewContent: FC<ViewContentProps> = ({ item, viewType }) => {
    if (viewType === LibraryTab.Suggestions) return <SuggestionsView item={item} />;

    if (viewType === LibraryTab.Upcoming) return <UpComingView item={item} />;

    if (viewType === LibraryTab.Genres) return <GenresView item={item} />;

    return <ItemsView viewType={viewType} item={item} />;
};

export default ViewContent;
