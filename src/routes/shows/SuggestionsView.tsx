import React, { FC } from 'react';

import SuggestionsItemsContainer from '../../components/common/SuggestionsItemsContainer';
import { LibraryViewProps } from '../../types/interface';

const SuggestionsView: FC<LibraryViewProps> = ({ topParentId }) => {
    return (
        <SuggestionsItemsContainer
            topParentId={topParentId}
            visibleId={[
                'suggestionContinueWatchingEpisode',
                'suggestionLatestEpisode',
                'suggestionNextUp'
            ]}
        />
    );
};

export default SuggestionsView;
