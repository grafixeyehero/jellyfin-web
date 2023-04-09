import React, { FC, useEffect } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import useTheme from '@mui/material/styles/useTheme';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Loading from '../../components/loading/LoadingComponent';
import Page from '../../components/Page';
import { useGetUserById } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';
import LibraryMenu from '../../scripts/libraryMenu';

const getTabs = () => {
    return [
        {
            index: 0,
            value: 'profile',
            name: globalize.translate('Profile')
        },
        {
            index: 1,
            value: 'libraryaccess',
            name: globalize.translate('TabAccess')
        },
        {
            index: 2,
            value: 'parentalcontrol',
            name: globalize.translate('TabParentalControl')
        },
        {
            index: 3,
            value: 'password',
            name: globalize.translate('HeaderPassword')
        }
    ];
};

const UserEdit: FC = () => {
    const theme = useTheme();
    const location = useLocation();
    const { userId, tabId } = location.state;

    const currentTab = tabId;
    const { isLoading, data: item } = useGetUserById({
        userId: userId
    });

    useEffect(() => {
        if (item?.Name) {
            LibraryMenu.setTitle(item.Name);
        }
    }, [item?.Name]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Page
            id='userProfilePage'
            title={globalize.translate('Profile')}
            className='mainAnimatedPage type-interior libraryPaddingTop'
        >
            <Box
                position='fixed'
                zIndex={2}
                display='flex'
                width='100%'
                sx={{
                    bgcolor: 'background.paper'
                }}
            >
                <Tabs
                    value={currentTab}
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
                    {getTabs().map((tab) => (
                        <Tab
                            key={`tab-router-${tab.index}`}
                            value={tab.value}
                            label={tab.name}
                            component={RouterLink}
                            to={tab.value}
                            state={{
                                userId: userId,
                                tabId: tab.value
                            }}
                            disableRipple
                        />
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ padding: '6em 2em 5em 2em' }}>
                <Outlet />
            </Box>
        </Page>
    );
};

export default UserEdit;
