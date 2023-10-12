import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import { Box } from '@mui/material';
interface ListContentWrapperProps {
    item: BaseItemDto;
    enableContentWrapper?: boolean;
    enableOverview?: boolean;
}

const ListContentWrapper: FC<ListContentWrapperProps> = ({
    item,
    enableContentWrapper,
    enableOverview,
    children
}) => {
    if (enableContentWrapper) {
        return (
            <>
                <Box className='listItem-content'>{children}</Box>

                {enableOverview && item.Overview && (
                    <Box className='listItem-bottomoverview secondary'>
                        <bdi>{item.Overview}</bdi>
                    </Box>
                )}
            </>
        );
    } else {
        return <>{children}</>;
    }
};

export default ListContentWrapper;
