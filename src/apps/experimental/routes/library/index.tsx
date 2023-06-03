import React, { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import { LibrarySettingsProvider } from 'hooks/useLibrarySettings';
import Page from 'components/Page';
import Loading from 'components/loading/LoadingComponent';
import LibraryHeader from '../../components/library/LibraryHeader';
import LibraryView from './LibraryView';
import SuggestionsView from './SuggestionsView';
import UpComingView from './UpComingView';

import { LibraryViewSelectOptions } from 'types/library';

export const getLibraryViewMenuOptions = (
    collectionType: string | null | undefined
) => {
    const viewSelectOptions: LibraryViewSelectOptions[] = [];
    if (collectionType === 'movies') {
        viewSelectOptions.push(
            { title: 'Movies', value: 'movies' },
            { title: 'Trailers', value: 'trailers' },
            { title: 'Collections', value: 'collections' },
            { title: 'Genres', value: 'genres' },
            { title: 'Studios', value: 'studios' },
            { title: 'Suggestions', value: 'suggestions' }
        );
    }

    if (collectionType === 'tvshows') {
        viewSelectOptions.push(
            { title: 'Series', value: 'series' },
            { title: 'Episodes', value: 'episodes' },
            { title: 'Genres', value: 'genres' },
            { title: 'Studios', value: 'studios' },
            { title: 'Upcoming', value: 'upcoming' },
            { title: 'Suggestions', value: 'suggestions' }
        );
    }

    if (collectionType === 'music') {
        viewSelectOptions.push(
            { title: 'Albums', value: 'albums' },
            { title: 'AlbumArtists', value: 'albumArtists' },
            { title: 'Artists', value: 'artists' },
            { title: 'Playlist', value: 'playlist' },
            { title: 'Genres', value: 'genres' },
            { title: 'Songs', value: 'songs' },
            { title: 'Suggestions', value: 'suggestions' }
        );
    }

    if (collectionType === 'books') {
        viewSelectOptions.push({ title: 'Books', value: 'books' });
    }

    if (collectionType === 'homevideos') {
        viewSelectOptions.push(
            { title: 'Photos', value: 'photos' },
            { title: 'Videos', value: 'videos' }
        );
    }

    return viewSelectOptions;
};

const getBackDropType = (collectionType: string | null | undefined) => {
    if (collectionType === 'movies') {
        return 'movie';
    }

    if (collectionType === 'tvshows') {
        return 'series';
    }

    if (collectionType === 'music') {
        return 'musicartist';
    }

    if (collectionType === 'books') {
        return 'book';
    }

    if (collectionType === 'homevideos') {
        return 'video, photo';
    }

    return '';
};

const Library: FC = () => {
    const [searchParams] = useSearchParams();
    const parentId = searchParams.get('topParentId');
    const collectionType = searchParams.get('collectionType');
    const [viewSelectOptions, setViewSelectOptions] = useState<LibraryViewSelectOptions[]>([]);
    const [ viewType, setViewType] = useState<string>('');

    const getViewComponent = () => {
        let component;

        switch (viewType) {
            case 'suggestions':
                component = <SuggestionsView collectionType={collectionType} parentId={parentId} />;
                break;

            case 'upcoming':
                component = <UpComingView parentId={parentId} />;
                break;

            default:
                component = <LibraryView viewType={viewType} collectionType={collectionType} parentId={parentId} />;
                break;
        }

        return component;
    };

    useEffect(() => {
        const viewOptions = getLibraryViewMenuOptions(collectionType);
        setViewSelectOptions(viewOptions);
        setViewType(viewOptions[0].value);
    }, [collectionType, parentId]);

    if (!viewType) return <Loading />;

    return (
        <Page
            id='libraryPage'
            className='mainAnimatedPage libraryPage backdropPage'
            backDropType={getBackDropType(collectionType)}
        >
            <LibrarySettingsProvider
                viewType={viewType}
                parentId={parentId}
            >
                <Box>
                    <LibraryHeader
                        viewSelectOptions={viewSelectOptions}
                        viewType={viewType}
                        setViewType={setViewType}
                        collectionType={collectionType}
                        parentId={parentId}
                    />

                    {getViewComponent()}

                </Box>
            </LibrarySettingsProvider>
        </Page>
    );
};

export default Library;
