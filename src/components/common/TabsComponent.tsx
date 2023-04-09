import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material';
import layoutManager from '../layoutManager';
import globalize from '../../scripts/globalize';

interface TabsComponentProps {
    selectedIndex: number;
    type: string;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const getTabs = (type: string) => {
    switch (type) {
        case 'movies':
            return [
                { index: 0, name: 'Movies' },
                { index: 1, name: 'Suggestions' },
                { index: 2, name: 'Trailers' },
                { index: 3, name: 'Favorites' },
                { index: 4, name: 'Collections' },
                { index: 5, name: 'Genres' }
            ];
        case 'music':
            return [
                { index: 0, name: 'Albums' },
                { index: 1, name: 'Suggestions' },
                { index: 2, name: 'HeaderAlbumArtists' },
                { index: 3, name: 'Artists' },
                { index: 4, name: 'Favorites' },
                { index: 5, name: 'Playlists' },
                { index: 6, name: 'Songs' },
                { index: 7, name: 'Genres' }
            ];
        case 'tvshows':
            return [
                { index: 0, name: 'Shows' },
                { index: 1, name: 'Suggestions' },
                { index: 2, name: 'TabUpcoming' },
                { index: 3, name: 'Favorites' },
                { index: 4, name: 'Genres' },
                { index: 5, name: 'TabNetworks' },
                { index: 6, name: 'Episodes' }
            ];
        case 'userprofile':
            return [
                { index: 0, name: 'Profile' },
                { index: 1, name: 'TabAccess' },
                { index: 2, name: 'TabParentalControl' },
                { index: 3, name: 'HeaderPassword' }
            ];
        default:
            return [];
    }
};

const TabsComponent: FC<TabsComponentProps> = ({
    selectedIndex,
    type,
    onChange
}) => {
    const theme = useTheme();

    return (
        <Box
            position={layoutManager.tv ? 'relative' : 'fixed'}
            zIndex={2}
            display='flex'
            justifyContent='center'
            width='100%'
            sx={{
                bgcolor: 'background.paper'
            }}
        >
            <Tabs
                value={selectedIndex}
                onChange={onChange}
                textColor='inherit'
                indicatorColor='primary'
                aria-label='secondary tabs'
                variant='scrollable'
                scrollButtons
                allowScrollButtonsMobile
                sx={{
                    '& button:hover': {
                        opacity: 1,
                        color: theme.palette.primary.light
                    },
                    '& .Mui-focusVisible': {
                        opacity: 1,
                        color: theme.palette.secondary.light
                    }
                }}
            >
                {getTabs(type).map((tab) => (
                    <Tab
                        key={tab.index}
                        tabIndex={tab.index}
                        label={globalize.translate(tab.name)}
                        disableRipple
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default TabsComponent;
