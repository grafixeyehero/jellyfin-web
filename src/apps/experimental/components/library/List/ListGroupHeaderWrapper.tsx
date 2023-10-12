import React, { FC } from 'react';
import { Typography } from '@mui/material';
interface ListGroupHeaderWrapperProps {
    index?: number;
    children?: React.ReactNode;
}

const ListGroupHeaderWrapper: FC<ListGroupHeaderWrapperProps> = ({
    index,
    children
}) => {
    if (index === 0) {
        return (
            <Typography
                className='listGroupHeader listGroupHeader-first'
                variant='h2'
            >
                {children}
            </Typography>
        );
    } else {
        return (
            <Typography className='listGroupHeader' variant='h2'>
                {children}
            </Typography>
        );
    }
};

export default ListGroupHeaderWrapper;
