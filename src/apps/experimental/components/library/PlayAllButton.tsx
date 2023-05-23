import React, { FC, useCallback } from 'react';

import { playbackManager } from '../../../../components/playback/playbackmanager';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import globalize from '../../../../scripts/globalize';
import { useGetItem } from 'hooks/useFetchItems';

interface PlayAllButtonProps {
    parentId?: string | null;
}

const PlayAllButton: FC<PlayAllButtonProps> = ({ parentId }) => {
    const { data: item } = useGetItem(parentId);

    const playAll = useCallback(() => {
        playbackManager.play({
            items: [item]
        });
    }, [item]);

    return (
        <IconButton
            title={globalize.translate('HeaderPlayAll')}
            className='paper-icon-button-light btnPlayAll autoSize'
            onClick={playAll}
        >
            <PlayArrowIcon />
        </IconButton>
    );
};

export default PlayAllButton;
