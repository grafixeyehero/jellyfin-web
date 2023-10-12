import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import globalize from 'scripts/globalize';

interface InfoButtonProps {
    className?: string;
}

const InfoButton: FC<InfoButtonProps> = ({ className }) => {
    return (
        <IconButton
            className={className}
            data-action='link'
            title={globalize.translate('ButtonInfo')}
        >
            <InfoIcon />
        </IconButton>
    );
};

export default InfoButton;
