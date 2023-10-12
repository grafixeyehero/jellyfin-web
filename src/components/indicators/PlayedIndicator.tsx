import { UserItemDataDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import datetime from 'scripts/datetime';
import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface PlayedIndicatorProps {
    userData?: UserItemDataDto
}

const PlayedIndicator: FC<PlayedIndicatorProps> = ({ userData }) => {
    const userItemData = userData || {};

    if (userItemData.UnplayedItemCount) {
        return (
            <Box className='countIndicator indicator'>
                {datetime.toLocaleString(userItemData.UnplayedItemCount)}
            </Box>

        );
    }

    if (userItemData.PlayedPercentage && userItemData.PlayedPercentage >= 100 || (userItemData.Played)) {
        return (
            <Box className='playedIndicator indicator'>
                <CheckIcon className='indicatorIcon' />
            </Box>

        );
    }

    return null;
};

export default PlayedIndicator;
