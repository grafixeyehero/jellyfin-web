import { Box } from '@mui/material';
import React, { FC } from 'react';
import datetime from 'scripts/datetime';

interface MissingIndicatorProps {
    premiereDate: string | null | undefined;
}

const MissingIndicator: FC<MissingIndicatorProps> = ({ premiereDate }) => {
    if (premiereDate) {
        try {
            const datePremiere = datetime.parseISO8601Date(premiereDate).getTime();
            if (datePremiere > new Date().getTime()) {
                return <Box className='unairedIndicator'>Unaired</Box>;
            }
        } catch (err) {
            console.error(err);
        }
    }
    return <Box className='missingIndicator'>Missing</Box>;
};

export default MissingIndicator;
