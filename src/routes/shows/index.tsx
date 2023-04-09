import React, { FC, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import TabsComponent from '../../components/common/TabsComponent';
import Page from '../../components/Page';
import { useGetItem } from '../../hooks/useFetchItems';
import LibraryMenu from '../../scripts/libraryMenu';
import * as userSettings from '../../scripts/settings/userSettings';
import EpisodesView from './EpisodesView';
import FavoritesView from './FavoritesView';
import GenresView from './GenresView';
import SeriesView from './SeriesView';
import StudiosView from './StudiosView';
import SuggestionsView from './SuggestionsView';
import UpComingView from './UpComingView';

const getDefaultTabIndex = (folderId: string | null) => {
    switch (userSettings.get('landing-' + folderId, false)) {
        case 'suggestions':
            return 1;

        case 'upcoming':
            return 2;

        case 'favorites':
            return 3;

        case 'genres':
            return 4;

        case 'networks':
            return 5;

        case 'episodes':
            return 6;

        default:
            return 0;
    }
};

interface StringArray {
    [index: number]: string;
}

interface NunmberArray {
    [key: string]: number;
}

const indexToTabName: StringArray = {
    0: 'shows',
    1: 'suggestions',
    2: 'upcoming',
    3: 'favorites',
    4: 'genres',
    5: 'networks',
    6: 'episodes'
};

const tabNameToIndex: NunmberArray = {
    shows: 0,
    suggestions: 1,
    upcoming: 2,
    favorites: 3,
    genres: 4,
    networks: 5,
    episodes: 6
};

const Shows: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const itemId = searchParams.get('topParentId');

    const currentTabIndex = tabNameToIndex[searchParams.get('tab') || indexToTabName[getDefaultTabIndex(itemId)]];

    const { data: item } = useGetItem(itemId);

    const onChange = useCallback(
        (event: React.SyntheticEvent, newValue: number) => {
            searchParams.set('tab', indexToTabName[newValue]);
            setSearchParams(searchParams);
        },
        [searchParams, setSearchParams]
    );

    const getTabComponent = (index: number) => {
        if (index == null) {
            throw new Error('index cannot be null');
        }

        let component;
        switch (index) {
            case 1:
                component = <SuggestionsView topParentId={itemId} />;
                break;

            case 2:
                component = <UpComingView topParentId={itemId} />;
                break;

            case 3:
                component = <FavoritesView topParentId={itemId} />;
                break;

            case 4:
                component = <GenresView topParentId={itemId} context={item?.CollectionType} />;
                break;

            case 5:
                component = <StudiosView topParentId={itemId} />;
                break;

            case 6:
                component = <EpisodesView topParentId={itemId} context={item?.CollectionType} />;
                break;
            default:
                component = <SeriesView topParentId={itemId} context={item?.CollectionType} />;
        }

        return component;
    };

    useEffect(() => {
        if (item?.Type === 'CollectionFolder' && item.Name) {
            LibraryMenu.setTitle(item.Name);
        }
    }, [item?.CollectionType, item?.Name, item?.Type]);

    return (
        <Page
            id='tvshowsPage'
            className='mainAnimatedPage backdropPage libraryPage collectionEditorPage libraryPaddingTop'
            backDropType='series'
            topParentId={itemId}
        >
            <TabsComponent
                selectedIndex={currentTabIndex}
                type='tvshows'
                onChange={onChange}
            />

            <Box sx={{ paddingTop: '3.8em' }}>
                {getTabComponent(currentTabIndex)}
            </Box>
        </Page>
    );
};

export default Shows;
