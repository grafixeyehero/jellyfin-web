import {
    type BaseItemDto
} from '@jellyfin/sdk/lib/generated-client';

import React, { FC } from 'react';
import classNames from 'classnames';
import { Box, IconButton, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useApi } from 'hooks/useApi';
import globalize from 'scripts/globalize';
import layoutManager from 'components/layoutManager';
import cardBuilder from 'components/cardbuilder/cardBuilder';
import { canResume, enableProgressIndicator, getChannelImageUrl, getImageUrl } from './listHelper';
import MediaSourceIndicator from 'components/indicators/MediaSourceIndicator';
import ListItemIndicators from './ListItemIndicators';
import DefaultIconText from './DefaultIconText';

import { ListOptions } from 'types/listOptions';

interface ListMediaProps {
    item: BaseItemDto;
    listOptions: ListOptions;
    className?: string;
    action?: string | null;
    isLargeStyle: boolean;
    clickEntireItem?: boolean;
    downloadWidth?: number;
}

const ListMedia: FC<ListMediaProps> = ({
    item = {},
    listOptions,
    action,
    isLargeStyle,
    clickEntireItem,
    downloadWidth
}) => {
    const { api } = useApi();
    const imgInfo =
        listOptions.imageSource === 'channel' ?
            getChannelImageUrl(item, api, downloadWidth) :
            getImageUrl(item, api, downloadWidth);

    const defaultCardImageIcon = listOptions.defaultCardImageIcon;
    const disableIndicators = listOptions.disableIndicators;
    const imgUrl = imgInfo?.imgUrl;

    const imageClass = classNames(
        'listItemImage',
        { 'listItemImage-large': isLargeStyle },
        { 'listItemImage-channel': listOptions.imageSource === 'channel' },
        { 'listItemImage-large-tv': isLargeStyle && layoutManager.tv },
        { itemAction: !clickEntireItem },
        { cardImageContainer: !imgUrl },
        { [cardBuilder.getDefaultBackgroundClass(item.Name)]: !imgUrl }
    );

    const playOnImageClick = listOptions.imagePlayButton && !layoutManager.tv;

    const imageAction = playOnImageClick ? 'link' : action;

    const btnCssClass =
        'paper-icon-button-light listItemImageButton itemAction';

    const styles = {
        container: {
            backgroundImage: imgUrl ? `url(${imgUrl})` : ''
        }
    };
    const playedPercentage = item?.UserData?.PlayedPercentage;
    const playbackPositionTicks = item?.UserData?.PlaybackPositionTicks;

    return (
        <Box
            data-action={imageAction}
            className={imageClass}
            style={styles.container}
        >
            {!imgUrl && (
                <DefaultIconText
                    item={item}
                    defaultCardImageIcon={defaultCardImageIcon}
                />
            )}
            <MediaSourceIndicator
                mediaSourceCount={item.MediaSourceCount}
                disableIndicators={disableIndicators}
            />

            <ListItemIndicators item={item} />

            {playOnImageClick && (
                <IconButton
                    className={btnCssClass}
                    data-action={canResume(playbackPositionTicks) ? 'resume' : 'play'}
                    title={globalize.translate(
                        canResume(playbackPositionTicks) ? 'ButtonResume' : 'Play'
                    )}
                >
                    <PlayArrowIcon
                        //className='material-icons listItemImageButton-icon'
                    />
                </IconButton>
            )}

            {enableProgressIndicator(item) && playedPercentage && playedPercentage < 100 && (
                <LinearProgress
                    variant='determinate'
                    value={playedPercentage}
                    className='listItemProgressBar'
                    sx={{
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        borderRadius: '100px',
                        height: '5px'
                    }}
                />
            )}
        </Box>
    );
};

export default ListMedia;
