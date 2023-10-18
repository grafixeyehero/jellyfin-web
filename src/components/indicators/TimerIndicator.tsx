import { BaseItemDto, SeriesTimerInfoDto, TimerInfoDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import classNames from 'classnames';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface TimerIndicatorProps {
    item: BaseItemDto;
    className?: string
}

const TimerIndicator: FC<TimerIndicatorProps> = ({ item, className }) => {
    const indicatorIconClass = classNames(
        'indicatorIcon',
        'timerIndicator',
        className
    );

    let status;

    if ((item as SeriesTimerInfoDto).Type === 'SeriesTimer') {
        return (
            <FiberSmartRecordIcon className={indicatorIconClass} />

        );
    } else if (item.TimerId || item.SeriesTimerId) {
        status = item.Status || 'Cancelled';
    } else if ((item as TimerInfoDto).Type === 'Timer') {
        status = (item as TimerInfoDto).Status;
    } else {
        return null;
    }

    if (item.SeriesTimerId) {
        return (
            <FiberSmartRecordIcon
                className={`${indicatorIconClass} ${status === 'Cancelled' ? 'timerIndicator-inactive' : ''}`}
            />
        );
    }

    return (
        <FiberManualRecordIcon className={indicatorIconClass} />

    );
};

export default TimerIndicator;
