import React, { FC } from 'react';

import FavoriteItemsContainer from '../../components/common/FavoriteItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const FavoritesView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <FavoriteItemsContainer
            topParentId={topParentId}
            visibleId={[
                'favoriteShows',
                'favoriteEpisode'
            ]}
        />
    );
};

export default FavoritesView;
