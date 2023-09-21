import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import BooksView from './BooksView';

const Movies: FC = () => {
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

        return (
            <BooksView parentId={searchParamsParentId} />
        );
    };

    return (
        <Page
            id='books'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='book'
        >
            {getTabComponent(currentTabIndex)}

        </Page>
    );
};

export default Movies;
