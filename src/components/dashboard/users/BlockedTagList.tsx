import React, { FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import globalize from '../../../scripts/globalize';

interface BlockedTagListProps {
    tag: string;
    onDeleteTagClick: (tag: string) => () => void;
}

const BlockedTagList: FC<BlockedTagListProps> = ({ tag, onDeleteTagClick }) => {
    return (
        <ListItem
            secondaryAction={
                <IconButton
                    edge='end'
                    aria-label='delete'
                    title={globalize.translate('Delete')}
                    className='paper-icon-button-light blockedTag btnDeleteTag listItemButton'
                    onClick={onDeleteTagClick(tag)}
                >
                    <DeleteIcon />
                </IconButton>
            }
        >
            <ListItemText primary={tag} />
        </ListItem>
    );
};

export default BlockedTagList;
