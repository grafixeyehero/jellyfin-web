import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import PageTabContent from '../../components/library/PageTabContent';
import { LibraryTab } from 'types/libraryTab';
import { CollectionType } from 'types/collectionType';
import { LibraryTabContent, LibraryTabMapping } from 'types/libraryTabContent';

const booksTabContent: LibraryTabContent = {
    viewType: LibraryTab.Books,
    collectionType: CollectionType.Books,
    isBtnShuffleEnabled: true,
    itemType: [BaseItemKind.Book]
};

const booksTabMapping: LibraryTabMapping = {
    0: booksTabContent
};

const Books: FC = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchParamsParentId = searchParams.get('topParentId');
    const searchParamsTab = searchParams.get('tab');
    const currentTabIndex =
        searchParamsTab !== null ?
            parseInt(searchParamsTab, 10) :
            getDefaultTabIndex(location.pathname, searchParamsParentId);
    const currentTab = booksTabMapping[currentTabIndex];

    return (
        <Page
            id='books'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='book'
        >
            <PageTabContent
                currentTab={currentTab}
                parentId={searchParamsParentId}
            />
        </Page>
    );
};

export default Books;
