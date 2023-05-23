import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';

import Box from '@mui/material/Box';
import { useLibrarySettings } from 'hooks/useLibrarySettings';
import { useGetViewItemsByType } from 'hooks/useFetchItems';

import * as userSettings from 'scripts/settings/userSettings';
import Loading from 'components/loading/LoadingComponent';
import AlphaPickerContainer from '../../components/library/container/AlphaPickerContainer';
import ItemsContainer from '../../components/library/container/ItemsContainer';
import Pagination from '../../components/library/pagination/Pagination';

const visibleAlphaPicker = [
    'movies',
    'favorites',
    'trailers',
    'series',
    'episodes',
    'albums',
    'albumArtists',
    'artists'
];
interface LibraryViewProps {
    collectionType?: string | null;
    parentId: string | null;
    item?: BaseItemDto;
    viewType: string;
}

const LibraryView: FC<LibraryViewProps> = ({
    parentId,
    viewType,
    collectionType
}) => {
    const { libraryViewSettings, setLibraryViewSettings } = useLibrarySettings();
    const {
        isLoading: isLoading,
        data: itemsResult,
        isFetching
    } = useGetViewItemsByType(viewType, parentId);

    const limit = userSettings.libraryPageSize(undefined);
    const totalRecordCount = itemsResult?.TotalRecordCount || 0;
    const showControls = limit > 0 && limit < totalRecordCount;

    return (
        <Box sx={{ pt: 3, pb: 5 }}>
            {showControls && (
                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <Pagination
                        itemsResult={itemsResult}
                        libraryViewSettings={libraryViewSettings}
                        setLibraryViewSettings={setLibraryViewSettings}
                    />
                </div>
            )}

            {visibleAlphaPicker.includes(viewType) && (
                <AlphaPickerContainer
                    libraryViewSettings={libraryViewSettings}
                    setLibraryViewSettings={setLibraryViewSettings}
                />
            )}

            {isLoading || isFetching ? (
                <Loading />
            ) : (
                <ItemsContainer
                    libraryViewSettings={libraryViewSettings}
                    collectionType={collectionType}
                    viewType={viewType}
                    itemsResult={itemsResult}
                />
            )}

            {showControls && (
                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <Pagination
                        itemsResult={itemsResult}
                        libraryViewSettings={libraryViewSettings}
                        setLibraryViewSettings={setLibraryViewSettings}
                    />
                </div>
            )}
        </Box>
    );
};

export default LibraryView;
