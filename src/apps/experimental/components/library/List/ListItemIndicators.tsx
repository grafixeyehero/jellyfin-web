import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import classNames from 'classnames';
import { Box } from '@mui/material';
import itemHelper from 'components/itemHelper';
import PlayedIndicator from 'components/indicators/PlayedIndicator';

function enablePlayedIndicator(item: BaseItemDto) {
    return itemHelper.canMarkPlayed(item);
}
interface ListItemIndicatorsProps {
    item: BaseItemDto;
    className?: string;
}

const ListItemIndicators: FC<ListItemIndicatorsProps> = ({
    item,
    className
}) => {
    const cssClass = classNames('indicators listItemIndicators', className);

    return (
        <Box className={cssClass}>
            {enablePlayedIndicator(item) && (
                <PlayedIndicator userData={item.UserData} />
            )}
        </Box>
    );
};

export default ListItemIndicators;
