import React, { FC } from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames';
import { MiscInfo } from 'types/mediaInfoItem';

interface MediaInfoItemProps {
    className?: string;
    miscInfo?: MiscInfo ;

}

const MediaInfoItem: FC<MediaInfoItemProps> = ({ className, miscInfo }) => {
    const cssClass = classNames(
        'mediaInfoItem mediaInfoText',
        className,
        miscInfo?.cssClass
    );

    return (
        <Box className={cssClass}>
            {miscInfo?.text}
        </Box>
    );
};

export default MediaInfoItem;
