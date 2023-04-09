import type { UserDto } from '@jellyfin/sdk/lib/generated-client';
import classNames from 'classnames';
import { formatDistanceToNow } from 'date-fns';
import escapeHTML from 'escape-html';
import React, { FC, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';

import { useDeleteUser } from '../../../hooks/useFetchItems';
import globalize from '../../../scripts/globalize';
import { getLocaleWithSuffix } from '../../../utils/dateFnsLocale';
import cardBuilder from '../../cardbuilder/cardBuilder';
import confirm from '../../confirm/confirm';

const getLastSeenText = (lastActivityDate?: string | null) => {
    if (lastActivityDate) {
        return globalize.translate(
            'LastSeen',
            formatDistanceToNow(
                Date.parse(lastActivityDate),
                getLocaleWithSuffix()
            )
        );
    }

    return '';
};

type MenuEntry = {
    name?: string;
    id?: string;
    icon?: string;
};

interface UserCardBoxProps {
    user?: UserDto;
}

const UserCardBox: FC<UserCardBoxProps> = ({ user = {} }) => {
    const navigate = useNavigate();
    const deleteUser = useDeleteUser();

    const onDeleteUserClick = useCallback((id: string) => {
        const msg = globalize.translate('DeleteUserConfirmation');

        confirm({
            title: globalize.translate('DeleteUser'),
            text: msg,
            confirmText: globalize.translate('Delete'),
            primary: 'delete'
        }).then(function () {
            deleteUser.mutate(
                {
                    userId: id
                }
            );
        });
    }, [deleteUser]);

    const showUserMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        if (!user.Id) {
            console.error('Unexpected null user id');
            return;
        }

        const menuItems: MenuEntry[] = [];

        menuItems.push({
            name: globalize.translate('ButtonOpen'),
            id: 'open',
            icon: 'mode_edit'
        });
        menuItems.push({
            name: globalize.translate('ButtonLibraryAccess'),
            id: 'access',
            icon: 'lock'
        });
        menuItems.push({
            name: globalize.translate('ButtonParentalControl'),
            id: 'parentalcontrol',
            icon: 'person'
        });
        menuItems.push({
            name: globalize.translate('Delete'),
            id: 'delete',
            icon: 'delete'
        });

        import('../../actionSheet/actionSheet').then(
            ({ default: actionsheet }) => {
                actionsheet.show({
                    items: menuItems,
                    positionTo: event.target,
                    callback: (id: string) => {
                        switch (id) {
                            case 'open':
                                navigate('/useredit/profile', {
                                    state: {
                                        userId: user.Id,
                                        tabId: 'profile'
                                    }
                                });
                                break;

                            case 'access':
                                navigate('/useredit/libraryaccess', {
                                    state: {
                                        userId: user.Id,
                                        tabId: 'libraryaccess'
                                    }
                                });
                                break;

                            case 'parentalcontrol':
                                navigate('/useredit/parentalcontrol', {
                                    state: {
                                        userId: user.Id,
                                        tabId: 'parentalcontrol'
                                    }
                                });
                                break;

                            case 'delete':
                                onDeleteUserClick(user.Id as string);
                        }
                    }
                });
            }
        );
    }, [navigate, onDeleteUserClick, user.Id]);

    let cssClass = 'card squareCard scalableCard squareCard-scalable';

    if (user.Policy?.IsDisabled) {
        cssClass += ' grayscale';
    }

    let imgUrl;

    if (user.PrimaryImageTag && user.Id) {
        imgUrl = window.ApiClient.getUserImageUrl(user.Id, {
            width: 300,
            tag: user.PrimaryImageTag,
            type: 'Primary'
        });
    }

    let imageClass = 'cardImage';

    if (user.Policy?.IsDisabled) {
        imageClass += ' disabledUser';
    }

    const lastSeen = getLastSeenText(user.LastActivityDate);

    return (
        <div data-userid={user.Id} className={cssClass}>
            <div className='cardBox visualCardBox'>
                <div className='cardScalable visualCardBox-cardScalable'>
                    <div className='cardPadder cardPadder-square'></div>
                    <Link
                        component={RouterLink}
                        to='/useredit/profile'
                        state={{
                            userId: user.Id,
                            tabId: 'profile'
                        }}
                        className='cardContent'
                    >
                        {imgUrl ? (
                            <div
                                className={classNames(imageClass)}
                                style={{ backgroundImage: `url(${imgUrl})` }}
                            />
                        ) : (
                            <div
                                className={classNames(
                                    imageClass,
                                    cardBuilder.getDefaultBackgroundClass(
                                        user.Name
                                    ),
                                    'flex align-items-center justify-content-center'
                                )}
                            >
                                <PersonIcon
                                    color='action'
                                    sx={{ fontSize: '5em' }}
                                    aria-hidden='true'
                                />

                            </div>
                        )}
                    </Link>
                </div>
                <div
                    className='visualCardBox-cardFooter'
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.3em 0.3em 0.5em 0.5em'
                    }}
                >

                    <div>
                        <Typography variant='h6' gutterBottom>
                            {escapeHTML(user.Name)}
                        </Typography>

                        <Typography
                            variant='subtitle2'
                            gutterBottom
                            sx={{
                                height: '3em',
                                whiteSpace: 'pre-wrap',
                                fontSize: '86%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {lastSeen != '' ? lastSeen : <>&nbsp;</>}
                        </Typography>
                    </div>
                    <div>
                        <IconButton
                            aria-label={`more ${user.Name}`}
                            className='paper-icon-button-light btnUserMenu flex-shrink-zero'
                            onClick={showUserMenu}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserCardBox;
