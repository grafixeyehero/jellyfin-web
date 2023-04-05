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
                {
                    index: 0,
                    name: globalize.translate('Movies')
                },
                {
                    index: 1,
                    name: globalize.translate('Suggestions')
                },
                {
                    index: 2,
                    name: globalize.translate('Trailers')
                },
                {
                    index: 3,
                    name: globalize.translate('Favorites')
                },
                {
                    index: 4,
                    name: globalize.translate('Collections')
                },
                {
                    index: 5,
                    name: globalize.translate('Genres')
                }
            ];
        case 'music':
            return [
                {
                    index: 0,
                    name: globalize.translate('Albums')
                },
                {
                    index: 1,
                    name: globalize.translate('Suggestions')
                },
                {
                    index: 2,
                    name: globalize.translate('HeaderAlbumArtists')
                },
                {
                    index: 3,
                    name: globalize.translate('Artists')
                },
                {
                    index: 4,
                    name: globalize.translate('Favorites')
                },
                {
                    index: 5,
                    name: globalize.translate('Playlists')
                },
                {
                    index: 6,
                    name: globalize.translate('Songs')
                },
                {
                    index: 7,
                    name: globalize.translate('Genres')
                }
            ];
        case 'tvshows':
            return [
                {
                    index: 0,
                    name: globalize.translate('Shows')
                },
                {
                    index: 1,
                    name: globalize.translate('Suggestions')
                },
                {
                    index: 2,
                    name: globalize.translate('TabUpcoming')
                },
                {
                    index: 3,
                    name: globalize.translate('Favorites')
                },
                {
                    index: 4,
                    name: globalize.translate('Genres')
                },
                {
                    index: 5,
                    name: globalize.translate('TabNetworks')
                },
                {
                    index: 6,
                    name: globalize.translate('Episodes')
                }
            ];
        case 'userprofile':
            return [
                {
                    index: 0,
                    name: globalize.translate('Profile')
                },
                {
                    index: 1,
                    name: globalize.translate('TabAccess')
                },
                {
                    index: 2,
                    name: globalize.translate('TabParentalControl')
                },
                {
                    index: 3,
                    name: globalize.translate('HeaderPassword')
                }
            ];
        default:
            return [];
    }
};

const TabsComponent: FC<TabsComponentProps> = ({ selectedIndex, type, onChange }) => {
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
                        label={tab.name}
                        disableRipple
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default TabsComponent;
