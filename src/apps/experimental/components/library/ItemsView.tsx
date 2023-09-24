import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import { ItemSortBy } from '@jellyfin/sdk/lib/models/api/item-sort-by';
import React, { FC } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useGetItemsViewByType } from 'hooks/useFetchItems';
import { getDefaultLibraryViewSettings, getItemTypesEnum, getSettingsKey } from 'utils/items';
import Loading from 'components/loading/LoadingComponent';
import { playbackManager } from 'components/playback/playbackmanager';
import AlphabetPicker from './AlphabetPicker';
import FilterButton from './filter/FilterButton';
import ItemsContainer from './ItemsContainer';
import NewCollectionButton from './NewCollectionButton';
import Pagination from './Pagination';
import PlayAllButton from './PlayAllButton';
import QueueButton from './QueueButton';
import ShuffleButton from './ShuffleButton';
import SortButton from './SortButton';
import GridListViewButton from './GridListViewButton';
import { LibraryViewSettings } from 'types/library';
import { CollectionType } from 'types/collectionType';
import { LibraryTab } from 'types/libraryTab';

interface ItemsViewProps {
    viewType: LibraryTab;
    item?: BaseItemDto
}

const ItemsView: FC<ItemsViewProps> = ({
    viewType,
    item
}) => {
    const [libraryViewSettings, setLibraryViewSettings] =
        useLocalStorage<LibraryViewSettings>(
            getSettingsKey(viewType, item?.Id),
            getDefaultLibraryViewSettings(viewType)
        );

    const {
        isLoading,
        data: itemsResult,
        isFetching,
        isPreviousData
    } = useGetItemsViewByType(
        viewType,
        item,
        libraryViewSettings
    );

    const isBtnPlayAllEnabled =
        viewType !== LibraryTab.Collections
        && viewType !== LibraryTab.Trailers
        && viewType !== LibraryTab.AlbumArtists
        && viewType !== LibraryTab.Artists
        && viewType !== LibraryTab.Photos;

    const isBtnShuffleEnabled =
        viewType !== LibraryTab.Collections
        && viewType !== LibraryTab.Trailers
        && viewType !== LibraryTab.AlbumArtists
        && viewType !== LibraryTab.Artists
        && viewType !== LibraryTab.Photos;

    const isBtnQueueEnabled = false;

    const isBtnGridListEnabled =
        viewType !== LibraryTab.Songs && viewType !== LibraryTab.Trailers;

    const isBtnSortEnabled = viewType !== LibraryTab.Collections;

    const isBtnFilterEnabled = viewType !== LibraryTab.Collections;

    const isBtnNewCollectionEnabled = viewType === LibraryTab.Collections;

    const visibleAlphaPicker = [
        LibraryTab.Movies,
        LibraryTab.Favorites,
        LibraryTab.Trailers,
        LibraryTab.Series,
        LibraryTab.Episodes,
        LibraryTab.Albums,
        LibraryTab.AlbumArtists,
        LibraryTab.Artists
    ];

    const totalRecordCount = itemsResult?.TotalRecordCount ?? 0;
    const items = itemsResult?.Items ?? [];
    const hasFilters = Object.values(libraryViewSettings.Filters ?? {}).some(
        (filter) => !!filter
    );
    const hasSortName = libraryViewSettings.SortBy.includes(
        ItemSortBy.SortName
    );

    return (
        <Box>
            <Box className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                <Pagination
                    totalRecordCount={totalRecordCount}
                    libraryViewSettings={libraryViewSettings}
                    isPreviousData={isPreviousData}
                    setLibraryViewSettings={setLibraryViewSettings}
                />

                <Box sx={{ display: 'flex', width: '20px', height: '20px', padding: '8px' }} >
                    {isFetching ? <CircularProgress size={20} /> : null}
                </Box>

                {isBtnPlayAllEnabled && (
                    <PlayAllButton
                        item={item}
                        items={items}
                        viewType={viewType}
                        hasFilters={hasFilters}
                        libraryViewSettings={libraryViewSettings}
                    />
                )}
                {isBtnQueueEnabled
                    && item
                    && playbackManager.canQueue(item) && (
                    <QueueButton
                        item={item}
                        items={items}
                        hasFilters={hasFilters}
                    />
                )}
                {isBtnShuffleEnabled && totalRecordCount > 1 && (
                    <ShuffleButton
                        item={item}
                        items={items}
                        viewType={viewType}
                        hasFilters={hasFilters}
                        libraryViewSettings={libraryViewSettings}
                    />
                )}
                {isBtnSortEnabled && (
                    <SortButton
                        viewType={viewType}
                        libraryViewSettings={libraryViewSettings}
                        setLibraryViewSettings={setLibraryViewSettings}
                    />
                )}
                {isBtnFilterEnabled && (
                    <FilterButton
                        parentId={item?.Id}
                        itemType={getItemTypesEnum(viewType)}
                        viewType={viewType}
                        hasFilters={hasFilters}
                        libraryViewSettings={libraryViewSettings}
                        setLibraryViewSettings={setLibraryViewSettings}
                    />
                )}
                {isBtnNewCollectionEnabled && <NewCollectionButton />}
                {isBtnGridListEnabled && (
                    <GridListViewButton
                        viewType={viewType}
                        libraryViewSettings={libraryViewSettings}
                        setLibraryViewSettings={setLibraryViewSettings}
                    />
                )}
            </Box>

            {visibleAlphaPicker.includes(viewType) && hasSortName && (
                <AlphabetPicker
                    libraryViewSettings={libraryViewSettings}
                    setLibraryViewSettings={setLibraryViewSettings}
                />
            )}

            {isLoading ? (
                <Loading />
            ) : (
                <ItemsContainer
                    libraryViewSettings={libraryViewSettings}
                    viewType={viewType}
                    collectionType={item?.CollectionType as CollectionType}
                    items={items}
                />
            )}

            <Box className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                <Pagination
                    totalRecordCount={totalRecordCount}
                    libraryViewSettings={libraryViewSettings}
                    isPreviousData={isPreviousData}
                    setLibraryViewSettings={setLibraryViewSettings}
                />
            </Box>
        </Box>
    );
};

export default ItemsView;
