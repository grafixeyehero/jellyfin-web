import React, { FC, useCallback } from 'react';

import { playbackManager } from '../playback/playbackmanager';
import { IconButton } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { useGetItem } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';
interface ShuffleButtonProps {
    itemId?: string | null;
}

const ShuffleButton: FC<ShuffleButtonProps> = ({ itemId }) => {
    const { data: item } = useGetItem(itemId);

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
