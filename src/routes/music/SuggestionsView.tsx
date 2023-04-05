import React, { FC } from 'react';

import SuggestionsItemsContainer from '../../components/common/SuggestionsItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const SuggestionsView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <SuggestionsItemsContainer
            topParentId={topParentId}
            visibleId={[
                'suggestionLatestMusic',
                'suggestionFrequentlyPlayed',
                'suggestionRecentlyPlayed'
            ]}
        />
    );
};

export default SuggestionsView;
