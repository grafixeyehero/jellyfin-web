import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import { Box } from '@mui/material';
import itemHelper from 'components/itemHelper';
import PlayStateButton from 'elements/emby-playstatebutton/PlayedButton';
import RatingButton from 'elements/emby-ratingbutton/FavoriteButton';
import ContextMenuButton from './Buttons/ContextMenuButton';
import AddToListButton from './Buttons/AddToListButton';
import InfoButton from './Buttons/InfoButton';
import RightButtons from './Buttons/RightButtons';
import { ListOptions } from 'types/listOptions';

interface ListViewUserDataButtonsProps {
    item: BaseItemDto;
    listOptions: ListOptions;
}

const ListViewUserDataButtons: FC<ListViewUserDataButtonsProps> = ({
    item = {},
    listOptions
}) => {
    const { IsFavorite, Played } = item.UserData ?? {};

    return (
        <Box className='listViewUserDataButtons'>
            {listOptions.addToListButton && (
                <AddToListButton
                    className='paper-icon-button-light listItemButton itemAction'
                />

            )}
            {listOptions.infoButton && (
                <InfoButton
                    className='paper-icon-button-light listItemButton itemAction'
                />

            ) }

            {listOptions.rightButtons && (
                <>
                    {listOptions.rightButtons?.map((button, index) => (
                        <RightButtons
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            className='listItemButton itemAction'
                            id={button.id}
                            title={button.title}
                            icon={button.icon}
                        />
                    ))}
                </>
            )}

            {listOptions.enableUserDataButtons !== false && (
                <>
                    {itemHelper.canMarkPlayed(item)
                        && listOptions.enablePlayedButton !== false && (
                        <PlayStateButton
                            className='listItemButton'
                            playedState={Played}
                            itemId={item.Id}
                            itemType={item.Type}
                        />
                    )}

                    {itemHelper.canRate(item)
                        && listOptions.enableRatingButton !== false && (
                        <RatingButton
                            className='listItemButton'
                            favoriteState={IsFavorite}
                            itemId={item.Id}
                        />
                    )}
                </>
            )}

            {listOptions.moreButton !== false && (
                <ContextMenuButton
                    className='paper-icon-button-light listItemButton'
                    item={item}
                />
            )}
        </Box>
    );
};

export default ListViewUserDataButtons;
