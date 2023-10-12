import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import classNames from 'classnames';
import escapeHTML from 'escape-html';
import React, { FC } from 'react';
import { Box, Button } from '@mui/material';
import layoutManager from 'components/layoutManager';
import { DataAttributes } from 'types/dataAttributes';

interface ListWrapperProps {
    index: number | undefined;
    item: BaseItemDto;
    action?: string | null;
    dataAttributes?: DataAttributes;
    className?: string;
    children?: React.ReactNode;
}

const ListWrapper: FC<ListWrapperProps> = ({
    index,
    action,
    item,
    className,
    dataAttributes,
    children
}) => {
    if (layoutManager.tv) {
        return (
            <Button
                data-index={index}
                className={classNames(
                    className,
                    'itemAction listItem-button listItem-focusscale'
                )}
                data-action={action}
                aria-label={escapeHTML(item.Name)}
                {...dataAttributes}
            >
                {children}
            </Button>
        );
    } else {
        return (
            <Box data-index={index} className={className} {...dataAttributes}>
                {children}
            </Box>
        );
    }
};

export default ListWrapper;
