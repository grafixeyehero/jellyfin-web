import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import classNames from 'classnames';
import { Box } from '@mui/material';
import PrimaryMediaInfo from 'components/mediainfo/PrimaryMediaInfo';
import ListText from './ListText';
import { ListOptions } from 'types/listOptions';

interface ListItemBodyProps {
    item: BaseItemDto;
    listOptions: ListOptions;
    action?: string | null;
    isLargeStyle?: boolean;
    clickEntireItem?: boolean;
    enableContentWrapper?: boolean;
    enableOverview?: boolean;
    enableSideMediaInfo?: boolean;
}

const ListItemBody: FC<ListItemBodyProps> = ({
    item = {},
    listOptions = {},
    action,
    isLargeStyle,
    clickEntireItem,
    enableContentWrapper,
    enableOverview,
    enableSideMediaInfo
}) => {
    const cssClass = classNames(
        'listItemBody',
        { 'itemAction': !clickEntireItem },
        { 'listItemBody-noleftpadding': listOptions.image === false }
    );

    return (
        <Box data-action={action} className={cssClass}>
            <ListText
                item={item}
                listOptions={listOptions}
                isLargeStyle={isLargeStyle}
            />

            {listOptions.mediaInfo !== false && !enableSideMediaInfo && (
                <PrimaryMediaInfo
                    className='secondary listItemMediaInfo listItemBodyText'
                    item={item}
                    isEpisodeTitleEnabled={true}
                    isOriginalAirDateEnabled={true}
                    isCaptionIndicatorEnabled={true}
                />
            )}

            {!enableContentWrapper && enableOverview && item.Overview && (
                <Box className='secondary listItem-overview listItemBodyText'>
                    <bdi>{item.Overview}</bdi>
                </Box>
            )}
        </Box>
    );
};

export default ListItemBody;
