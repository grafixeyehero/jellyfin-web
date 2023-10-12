import { Box } from '@mui/material';
import React, { FC } from 'react';

interface MediaSourceIndicatorProps {
    mediaSourceCount: number | null | undefined;
    disableIndicators: boolean | undefined;
}

const MediaSourceIndicator: FC<MediaSourceIndicatorProps> = ({
    mediaSourceCount,
    disableIndicators
}) => {
    const count = mediaSourceCount ?? 1;

    return (
        <>
            {count > 1 && disableIndicators !== true && (
                <Box className='mediaSourceIndicator'>{count}</Box>
            )}
        </>
    );
};

export default MediaSourceIndicator;
