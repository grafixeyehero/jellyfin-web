import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
interface ListTextWrapperProps {
    index?: number;
    isLargeStyle?: boolean;
}

const ListTextWrapper: FC<ListTextWrapperProps> = ({
    index,
    isLargeStyle,
    children
}) => {
    if (index === 0) {
        if (isLargeStyle) {
            return (
                <Typography className='listItemBodyText' variant='h2'>
                    {children}
                </Typography>
            );
        } else {
            return <Box className='listItemBodyText'>{children}</Box>;
        }
    } else {
        return <Box className='secondary listItemBodyText'>{children}</Box>;
    }
};

export default ListTextWrapper;
