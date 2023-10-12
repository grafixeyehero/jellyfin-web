import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import globalize from 'scripts/globalize';

interface ButtonMoreProps {
    className?: string;
}

const ButtonMore: FC<ButtonMoreProps> = ({ className }) => {
    return (
        <IconButton
            className={className}
            data-action='menu'
            title={globalize.translate('ButtonMore')}
        >
            <MoreVertIcon />
        </IconButton>
    );
};

export default ButtonMore;
