import React, { FC } from 'react';
import { IconButton } from '@mui/material';

interface RightButtonsProps {
    className?: string;
    id: string;
    icon: string;
    title: string;
}

const RightButtons: FC<RightButtonsProps> = ({ className, id, title, icon }) => {
    return (
        <IconButton
            className={className}
            data-action='custom'
            data-customaction={id}
            title={title}
        >
            {icon}
        </IconButton>
    );
};

export default RightButtons;
