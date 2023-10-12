import React, { FC } from 'react';
import classNames from 'classnames';
import { Box } from '@mui/material';
import datetime from 'scripts/datetime';
import globalize from 'scripts/globalize';

interface EndsAtProps {
    className?: string;
    runTimeTicks: number
}

const EndsAt: FC<EndsAtProps> = ({ runTimeTicks, className }) => {
    const cssClass = classNames(
        'mediaInfoItem',
        'mediaInfoTex',
        'endsAt',
        className
    );

    const endDate = new Date().getTime() + (runTimeTicks / 10000);
    const date = new Date(endDate);
    const displayTime = datetime.getDisplayTime(date);

    return (
        <Box className={cssClass}>
            {globalize.translate('EndsAtValue', displayTime)}
        </Box>
    );
};

export default EndsAt;
