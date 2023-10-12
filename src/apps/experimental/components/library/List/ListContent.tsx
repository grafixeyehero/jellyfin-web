import { BaseItemKind, type BaseItemDto, type TimerInfoDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Box } from '@mui/material';
import PrimaryMediaInfo from 'components/mediainfo/PrimaryMediaInfo';
import TimerIndicator from 'components/indicators/TimerIndicator';
import ListContentWrapper from './ListContentWrapper';
import ListItemBody from './ListItemBody';
import ListMedia from './ListMedia';
import ListViewUserDataButtons from './ListViewUserDataButtons';
import { ListOptions } from 'types/listOptions';

interface ListContentProps {
    item: BaseItemDto;
    listOptions: ListOptions;
    enableContentWrapper?: boolean;
    enableOverview?: boolean;
    enableSideMediaInfo?: boolean;
    clickEntireItem?: boolean;
    action?: string;
    isLargeStyle: boolean;
    downloadWidth?: number;
}

const ListContent: FC<ListContentProps> = ({
    item,
    listOptions,
    enableContentWrapper,
    enableOverview,
    enableSideMediaInfo,
    clickEntireItem,
    action,
    isLargeStyle,
    downloadWidth
}) => {
    return (
        <ListContentWrapper
            item={item}
            enableContentWrapper={enableContentWrapper}
            enableOverview={enableOverview}
        >

            {!clickEntireItem && listOptions.dragHandle && (
                <DragHandleIcon className='listViewDragHandle listItemIcon listItemIcon-transparent' />
            )}

            {listOptions.image !== false && (
                <ListMedia
                    item={item}
                    listOptions={listOptions}
                    action={action}
                    isLargeStyle={isLargeStyle}
                    clickEntireItem={clickEntireItem}
                    downloadWidth={downloadWidth}
                />
            )}

            {listOptions.showIndexNumberLeft && (
                <Box className='listItem-indexnumberleft'>
                    {item.IndexNumber ?? <span>&nbsp;</span>}
                </Box>
            )}

            <ListItemBody
                item={item}
                listOptions={listOptions}
                action={action}
                enableContentWrapper={enableContentWrapper}
                enableOverview={enableOverview}
                enableSideMediaInfo={enableSideMediaInfo}
            />

            {listOptions.mediaInfo !== false && enableSideMediaInfo && (
                <PrimaryMediaInfo
                    className='secondary listItemMediaInfo'
                    item={item}
                    isRuntimeEnabled={true}
                    isStarRatingEnabled={true}
                    isCaptionIndicatorEnabled={true}
                    isEpisodeTitleEnabled={true}
                    isOfficialRatingEnabled={true}
                />
            )}

            {listOptions.recordButton
                && ((item as TimerInfoDto).Type === 'Timer' || item.Type === BaseItemKind.Program) && (
                <TimerIndicator item={item} className='listItemAside' />
            )}

            {!clickEntireItem && (
                <ListViewUserDataButtons
                    item={item}
                    listOptions={listOptions}
                />
            )}
        </ListContentWrapper>
    );
};

export default ListContent;
