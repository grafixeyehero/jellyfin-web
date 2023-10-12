import { BaseItemDto, UserDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { executeCommand, getCommands } from 'components/itemContextMenu';

import { useApi } from 'hooks/useApi';
import globalize from 'scripts/globalize';

function getContextMenuOptions(
    item: BaseItemDto | undefined,
    user: UserDto | undefined
) {
    return {
        item: item,
        open: false,
        play: true,
        queue: true,
        playAllFromHere: !item?.IsFolder,
        queueAllFromHere: !item?.IsFolder,
        cancelTimer: false,
        record: false,
        deleteItem: item?.CanDelete === true,
        shuffle: false,
        instantMix: false,
        user: user,
        share: false
        //playlistId: playlistId,
        //collectionId: collectionId,
    };
}

interface ContextMenuButtonProps {
    className?: string;
    item: BaseItemDto;
}

const ContextMenuButton: FC<ContextMenuButtonProps> = ({ className, item }) => {
    const { user } = useApi();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const contextMenuOptions = getContextMenuOptions(item, user);
    const commands = getCommands(getContextMenuOptions(item, user));
    const handleClick = useCallback((e) => {
        e.preventDefault();
        setAnchorEl(e.currentTarget);
        e.stopPropagation();
    }, []);

    const handleOnClose = useCallback((e) => {
        e.preventDefault();
        setAnchorEl(null);
        e.stopPropagation();
    }, []);

    const handleItemClick = useCallback(
        (e) => {
            setAnchorEl(null);
            e.stopPropagation();
            const key = e.target.getAttribute('value');
            return executeCommand(item, key, contextMenuOptions);
            // executeCommand(item, key, contextMenuOptions).then(result => {
            //     if (result.command === 'playallfromhere' || result.command === 'queueallfromhere') {
            //         executeAction(card, options.positionTo, result.command);
            //     } else if (result.updated || result.deleted) {
            //         notifyRefreshNeeded(card, options.itemsContainer);
            //     }
            // }).catch(() => {
            //     //
            // });
        },
        [contextMenuOptions, item]
    );

    return (
        <Box>
            <IconButton
                className={className}
                title={globalize.translate('ButtonMore')}
                aria-controls='context-menu'
                aria-haspopup='true'
                onClick={handleClick}
                size={'small'}
            >
                <MoreVertIcon fontSize={'small'} />
            </IconButton>
            <Menu
                id='context-menu'
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleOnClose}
            >
                {commands.map((command, index) =>
                    command.divider ? (
                        // eslint-disable-next-line react/no-array-index-key
                        <Divider key={`divider-${index}`} />
                    ) : (
                        <MenuItem
                            value={command.id}
                            // eslint-disable-next-line react/no-array-index-key
                            key={`menuItem-${command.id}`}
                            onClick={handleItemClick}
                        >
                            {command.icon && (
                                <span
                                    className={`actionsheetMenuItemIcon listItemIcon listItemIcon-transparent material-icons ${command.icon}`}
                                    aria-hidden='true'
                                />
                            )}
                            {command.name}
                        </MenuItem>
                    )
                )}
            </Menu>
        </Box>
    );
};

export default ContextMenuButton;
