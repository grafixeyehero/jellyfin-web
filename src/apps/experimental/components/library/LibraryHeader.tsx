import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';

import {
    Chip,
    CircularProgress,
    Divider,
    MenuItem,
    TextField,
    Typography,
    useScrollTrigger
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';

import { useLibrarySettings } from 'hooks/useLibrarySettings';
import { useGetViewItemsByType } from 'hooks/useFetchItems';
import { getItemTypesEnum } from 'utils/items';

import FilterButton from './filter/FilterButton';
import NewCollectionButton from './NewCollectionButton';
import PlayAllButton from './PlayAllButton';
import ShuffleButton from './ShuffleButton';
import SortButton from './SortButton';
import ViewSettingsButton from './ViewSettingsButton';

import { LibraryViewSelectOptions } from 'types/library';

const visibleBtn = [
    'movies',
    'favorites',
    'trailers',
    'collections',
    'series',
    'episodes',
    'albums',
    'albumArtists',
    'artists',
    'songs',
    'photos',
    'videos'
];

interface LibraryHeaderProps {
    collectionType?: string | null;
    parentId: string | null;
    item?: BaseItemDto;
    viewSelectOptions: LibraryViewSelectOptions[];
    viewType: string;
    setViewType: React.Dispatch<React.SetStateAction<string>>;
}

const LibraryHeader: FC<LibraryHeaderProps> = ({
    viewSelectOptions,
    viewType,
    setViewType,
    collectionType,
    parentId
}) => {
    const { libraryViewSettings, setLibraryViewSettings } =
        useLibrarySettings();
    const {
        isLoading: isLoading,
        data: itemsResult,
        isFetching
    } = useGetViewItemsByType(viewType, parentId);

    const handleViewType = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setViewType(e.target.value);
        },
        [setViewType]
    );

    const isBtnPlayAllEnabled = useCallback(() => {
        return (
            viewType !== 'collections'
            && viewType !== 'trailers'
            && viewType !== 'albumArtists'
            && viewType !== 'artists'
            && viewType !== 'photos'
        );
    }, [viewType]);

    const isBtnShuffleEnabled = useCallback(() => {
        return (
            viewType !== 'collections'
            && viewType !== 'trailers'
            && viewType !== 'albumArtists'
            && viewType !== 'artists'
            && viewType !== 'photos'
        );
    }, [viewType]);

    const isBtnViewSettingsEnabled = useCallback(() => {
        return viewType !== 'songs' && viewType !== 'trailers';
    }, [viewType]);

    const isBtnSortEnabled = useCallback(() => {
        return viewType !== 'collections';
    }, [viewType]);

    const isBtnFilterEnabled = useCallback(() => {
        return viewType !== 'collections';
    }, [viewType]);

    const isBtnNewCollectionEnabled = useCallback(() => {
        return viewType === 'collections';
    }, [viewType]);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 1
    });

    return (
        <AppBar
            position='sticky'
            elevation={trigger ? 1 : 0}
            sx={{
                margin: 0,
                top: 48,
                background: trigger ? 'primary' : 'transparent'
            }}
        >
            <Toolbar
                variant='dense'
                sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: { xs: 2, sm: 5 }
                }}
            >
                <Stack
                    display='flex'
                    alignItems='center'
                    direction='row'
                    divider={<Divider orientation='vertical' flexItem />}
                    spacing={2}
                    sx={{
                        py: { xs: 1, sm: 0 }
                    }}
                >
                    <TextField
                        select
                        hiddenLabel
                        value={viewType}
                        size='small'
                        variant='filled'
                        onChange={handleViewType}
                    >
                        {viewSelectOptions.map((option) => {
                            return (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.title}
                                </MenuItem>
                            );
                        })}
                    </TextField>

                    {visibleBtn.includes(viewType) && (
                        <Chip
                            label={
                                isLoading || isFetching ? (
                                    <CircularProgress
                                        color='inherit'
                                        size={18}
                                    />
                                ) : (
                                    <Typography variant='h6'>
                                        {itemsResult?.TotalRecordCount}
                                    </Typography>
                                )
                            }
                        />
                    )}
                </Stack>

                {visibleBtn.includes(viewType) && (
                    <Stack
                        display='flex'
                        alignItems='center'
                        direction='row'
                        spacing={2}
                        divider={
                            <Divider
                                orientation='vertical'
                                flexItem
                                variant='inset'
                            />
                        }
                        sx={{
                            py: { xs: 1, sm: 0 }
                        }}
                    >
                        {isBtnPlayAllEnabled() && (
                            <PlayAllButton parentId={parentId} />
                        )}

                        {isBtnShuffleEnabled() && (
                            <ShuffleButton parentId={parentId} />
                        )}

                        {isBtnViewSettingsEnabled() && (
                            <ViewSettingsButton
                                viewType={viewType}
                                libraryViewSettings={libraryViewSettings}
                                setLibraryViewSettings={setLibraryViewSettings}
                            />
                        )}

                        {isBtnSortEnabled() && (
                            <SortButton
                                viewType={viewType}
                                libraryViewSettings={libraryViewSettings}
                                setLibraryViewSettings={setLibraryViewSettings}
                            />
                        )}

                        {isBtnFilterEnabled() && (
                            <FilterButton
                                context={collectionType}
                                parentId={parentId}
                                itemType={getItemTypesEnum(viewType)}
                                viewType={viewType}
                                libraryViewSettings={libraryViewSettings}
                                setLibraryViewSettings={setLibraryViewSettings}
                            />
                        )}

                        {isBtnNewCollectionEnabled() && <NewCollectionButton />}
                    </Stack>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default LibraryHeader;
