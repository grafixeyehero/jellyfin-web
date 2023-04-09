import type { AccessSchedule } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import datetime from '../../../scripts/datetime';
import globalize from '../../../scripts/globalize';

interface AccessScheduleListProps {
    index: number;
    accessSchedule: AccessSchedule;
    onDeleteScheduleClick: (index: number) => () => void;
}

function getDisplayTime(hours = 0) {
    let minutes = 0;
    const pct = hours % 1;

    if (pct) {
        minutes = Math.floor(60 * pct);
    }

    return datetime.getDisplayTime(new Date(2000, 1, 1, hours, minutes, 0, 0));
}

const AccessScheduleList: FC<AccessScheduleListProps> = ({
    index,
    accessSchedule,
    onDeleteScheduleClick
}) => {
    return (
        <ListItem
            secondaryAction={
                <IconButton
                    edge='end'
                    aria-label='delete'
                    title={globalize.translate('Delete')}
                    className='paper-icon-button-light btnDelete listItemButton'
                    onClick={onDeleteScheduleClick(index)}
                >
                    <DeleteIcon />
                </IconButton>
            }
        >
            <ListItemText
                primary={globalize.translate(accessSchedule.DayOfWeek)}
                secondary={
                    getDisplayTime(accessSchedule.StartHour)
                    + ' - '
                    + getDisplayTime(accessSchedule.EndHour)
                }
            />
        </ListItem>
    );
};

export default AccessScheduleList;
