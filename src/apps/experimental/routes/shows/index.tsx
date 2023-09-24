import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useGetItem } from 'hooks/useFetchItems';
import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import Loading from 'components/loading/LoadingComponent';
import ViewContent from 'apps/experimental/components/library/ViewContent';
import { LibraryTab } from 'types/libraryTab';

interface StringArray {
    [index: number]: LibraryTab;
}

const indexToTabName: StringArray = {
    0: LibraryTab.Shows,
    1: LibraryTab.Suggestions,
    2: LibraryTab.Upcoming,
    3: LibraryTab.Genres,
    4: LibraryTab.Networks,
    5: LibraryTab.Episodes
};

const Shows: FC = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchParamsParentId = searchParams.get('topParentId');
    const searchParamsTab = searchParams.get('tab');
    const currentTabIndex =
        searchParamsTab !== null ?
            parseInt(searchParamsTab, 10) :
            getDefaultTabIndex(location.pathname, searchParamsParentId);
    const viewType = indexToTabName[currentTabIndex];

    const { isLoading, data: item } = useGetItem(searchParamsParentId);

    if (isLoading) return <Loading />;

    return (
        <Page
            id='tvshowsPage'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='series'
        >
            <ViewContent
                key={`${viewType} - ${item?.Id}`}
                viewType={viewType}
                item={item}
            />
        </Page>
    );
};

export default Shows;
