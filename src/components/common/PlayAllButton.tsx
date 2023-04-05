import React, { FC, useCallback } from 'react';

import { playbackManager } from '../playback/playbackmanager';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import globalize from '../../scripts/globalize';
import IconButton from '@mui/material/IconButton';

interface PlayAllButtonProps {
    parentId?: string | null;
}

const PlayAllButton: FC<PlayAllButtonProps> = ({ parentId }) => {
    const playAll = useCallback(() => {
        window.ApiClient.getItem(
            window.ApiClient.getCurrentUserId(),
            parentId as string
        ).then((item) => {
            playbackManager.play({
                items: [item]
            });
        });
    }, [parentId]);

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
