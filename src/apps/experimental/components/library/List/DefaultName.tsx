import { type BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import itemHelper from 'components/itemHelper';
import escapeHTML from 'escape-html';
import React, { FC } from 'react';
import { Box } from '@mui/material';
import { isUsingLiveTvNaming } from './listHelper';

interface DefaultNameProps {
    item: BaseItemDto;
}

const DefaultName: FC<DefaultNameProps> = ({ item }) => {
    const defaultName = isUsingLiveTvNaming(item) ?
        item.Name :
        itemHelper.getDisplayName(item);
    return (
        <Box className='cardText cardDefaultText'>
            {escapeHTML(defaultName)}
        </Box>
    );
};

export default DefaultName;
