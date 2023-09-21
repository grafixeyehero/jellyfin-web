import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import GenresView from './GenresView';
import SuggestionsView from './SuggestionsView';
import AlbumArtistsView from './AlbumArtistsView';
import ArtistsView from './ArtistsView';
import PlaylistsView from './PlaylistsView';
import SongsView from './SongsView';
import AlbumsView from './AlbumsView';

const Shows: FC = () => {
    const location = useLocation();
    const [ searchParams ] = useSearchParams();
    const searchParamsParentId = searchParams.get('topParentId');
    const searchParamsTab = searchParams.get('tab');
    const currentTabIndex = searchParamsTab !== null ? parseInt(searchParamsTab, 10) :
        getDefaultTabIndex(location.pathname, searchParamsParentId);

    const getTabComponent = (index: number) => {
        if (index == null) {
            throw new Error('index cannot be null');
        }

        let component;
        switch (index) {
            case 1:
                component = <SuggestionsView parentId={searchParamsParentId} />;
                break;

            case 2:
                component = <AlbumArtistsView parentId={searchParamsParentId} />;
                break;

            case 3:
                component = <ArtistsView parentId={searchParamsParentId} />;
                break;

            case 4:
                component = <PlaylistsView parentId={searchParamsParentId} />;
                break;

            case 5:
                component = <SongsView parentId={searchParamsParentId} />;
                break;

            case 6:
                component = <GenresView parentId={searchParamsParentId} />;
                break;

            default:
                component = <AlbumsView parentId={searchParamsParentId} />;
        }

        return component;
    };

    return (
        <Page
            id='musicPage'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='musicartist'
        >
            {getTabComponent(currentTabIndex)}

        </Page>
    );
};

export default Shows;
