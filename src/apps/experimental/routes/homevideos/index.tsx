import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getDefaultTabIndex } from '../../components/tabs/tabRoutes';
import Page from 'components/Page';
import PageTabContent from '../../components/library/PageTabContent';
import { LibraryTab } from 'types/libraryTab';
import { CollectionType } from 'types/collectionType';
import { LibraryTabContent, LibraryTabMapping } from 'types/libraryTabContent';

const videosTabContent: LibraryTabContent = {
    viewType: LibraryTab.Videos,
    collectionType: CollectionType.HomeVideos,
    isBtnShuffleEnabled: true,
    itemType: [BaseItemKind.Video]
};

const photosTabContent: LibraryTabContent = {
    viewType: LibraryTab.Photos,
    collectionType: CollectionType.HomeVideos,
    isBtnPlayAllEnabled: true,
    isBtnShuffleEnabled: true,
    itemType: [BaseItemKind.Photo]
};

const photoAlbumsTabContent: LibraryTabContent = {
    viewType: LibraryTab.PhotoAlbums,
    collectionType: CollectionType.HomeVideos,
    isBtnPlayAllEnabled: true,
    isBtnShuffleEnabled: true,
    itemType: [BaseItemKind.PhotoAlbum]
};

const homeVideosTabMapping: LibraryTabMapping = {
    0: photoAlbumsTabContent,
    1: photosTabContent,
    2: videosTabContent
};

const HomeVideos: FC = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchParamsParentId = searchParams.get('topParentId');
    const searchParamsTab = searchParams.get('tab');
    const currentTabIndex =
        searchParamsTab !== null ?
            parseInt(searchParamsTab, 10) :
            getDefaultTabIndex(location.pathname, searchParamsParentId);
    const currentTab = homeVideosTabMapping[currentTabIndex];

    return (
        <Page
            id='homevideos'
            className='mainAnimatedPage libraryPage backdropPage collectionEditorPage pageWithAbsoluteTabs withTabs'
            backDropType='video, photo'
        >
            <PageTabContent
                currentTab={currentTab}
                parentId={searchParamsParentId}
            />
        </Page>
    );
};

export default HomeVideos;
