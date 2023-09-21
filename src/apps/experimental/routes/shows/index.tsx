import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import GenresView from './GenresView';
import SuggestionsView from './SuggestionsView';
import StudiosView from './StudiosView';
import EpisodesView from './EpisodesView';
import SeriesView from './SeriesView';
import UpComingView from './UpComingView';

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
                component = <UpComingView parentId={searchParamsParentId} />;
                break;

            case 3:
                component = <GenresView parentId={searchParamsParentId} />;
                break;

            case 4:
                component = <StudiosView parentId={searchParamsParentId} />;
                break;

            case 5:
                component = <EpisodesView parentId={searchParamsParentId} />;
                break;

            default:
                component = <SeriesView parentId={searchParamsParentId} />;
        }

        return component;
    };

    return (
        <Page
            id='tvshowsPage'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='series'
        >
            {getTabComponent(currentTabIndex)}

        </Page>
    );
};

export default Shows;
