import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import globalize from 'scripts/globalize';

interface AddToListButtonProps {
    className?: string;
}

const AddToListButton: FC<AddToListButtonProps> = ({ className }) => {
    return (
        <IconButton
            className={className}
            data-action='addtoplaylist'
            title={globalize.translate('AddToPlaylist')}
        >
            <PlaylistAddIcon />
        </IconButton>
    );
};

export default AddToListButton;
