import React, { FC, useCallback } from 'react';
import { IconButton } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import { useGetItem } from 'hooks/useFetchItems';
import globalize from 'scripts/globalize';
import { playbackManager } from 'components/playback/playbackmanager';

interface ShuffleButtonProps {
    parentId: string | null;
}

const ShuffleButton: FC<ShuffleButtonProps> = ({ parentId }) => {
    const { data: item } = useGetItem(parentId);

    const shuffle = useCallback(() => {
        playbackManager.shuffle(item);
    }, [item]);

    return (
        <IconButton
            title={globalize.translate('Shuffle')}
            className='paper-icon-button-light btnShuffle autoSize'
            onClick={shuffle}
        >
            <ShuffleIcon />
        </IconButton>
    );
};

export default ShuffleButton;
