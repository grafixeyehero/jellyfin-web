import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import FavoritesSectionContainer from './FavoritesSectionContainer';

function getFavoriteSections() {
    return [
        {
            name: 'HeaderFavoriteMovies',
            type: 'Movie',
            id: 'favoriteMovies',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Movie]
            },
            cardOptions: {
                shape: 'overflowPortrait',
                showTitle: true,
                showYear: true,
                overlayPlayButton: true,
                overlayText: false,
                centerText: true
            }
        },
        {
            name: 'HeaderFavoriteShows',
            type: 'Series',
            id: 'favoriteShows',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Series]
            },
            cardOptions: {
                shape: 'overflowPortrait',
                showTitle: true,
                showYear: true,
                overlayPlayButton: true,
                overlayText: false,
                centerText: true
            }
        },
        {
            name: 'HeaderFavoriteEpisodes',
            type: 'Episode',
            id: 'favoriteEpisode',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Episode]
            },
            cardOptions: {
                shape: 'overflowBackdrop',
                preferThumb: false,
                showTitle: true,
                showParentTitle: true,
                overlayPlayButton: true,
                overlayText: false,
                centerText: true
            }
        },
        {
            name: 'HeaderFavoriteVideos',
            type: 'Video,MusicVideo',
            id: 'favoriteVideos',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Video, BaseItemKind.MusicVideo]
            },
            cardOptions: {
                shape: 'overflowBackdrop',
                preferThumb: true,
                showTitle: true,
                overlayPlayButton: true,
                overlayText: false,
                centerText: true
            }
        },
        {
            name: 'HeaderFavoriteCollections',
            type: 'BoxSet',
            id: 'favoriteCollections',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.BoxSet]
            },
            cardOptions: {
                shape: 'overflowPortrait',
                showTitle: true,
                overlayPlayButton: true,
                overlayText: false,
                centerText: true
            }
        },
        {
            name: 'HeaderFavoritePlaylists',
            type: 'Playlist',
            id: 'favoritePlaylists',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Playlist]
            },
            cardOptions: {
                shape: 'overflowSquare',
                preferThumb: false,
                showTitle: true,
                overlayText: false,
                showParentTitle: false,
                centerText: true,
                overlayPlayButton: true,
                coverImage: true
            }
        },
        {
            name: 'HeaderFavoritePersons',
            viewType: 'persons',
            type: 'Person',
            id: 'favoritePeople',
            cardOptions: {
                shape: 'overflowPortrait',
                preferThumb: false,
                showTitle: true,
                overlayText: false,
                showParentTitle: false,
                centerText: true,
                overlayPlayButton: true,
                coverImage: true
            }
        },
        {
            name: 'HeaderFavoriteArtists',
            viewType: 'artists',
            type: 'MusicArtist',
            id: 'favoriteArtists',
            cardOptions: {
                shape: 'overflowSquare',
                preferThumb: false,
                showTitle: true,
                overlayText: false,
                showParentTitle: false,
                centerText: true,
                overlayPlayButton: true,
                coverImage: true
            }
        },
        {
            name: 'HeaderFavoriteAlbums',
            type: 'MusicAlbum',
            id: 'favoriteAlbums',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.MusicAlbum]
            },
            cardOptions: {
                shape: 'overflowSquare',
                preferThumb: false,
                showTitle: true,
                overlayText: false,
                showParentTitle: true,
                centerText: true,
                overlayPlayButton: true,
                coverImage: true
            }
        },
        {
            name: 'HeaderFavoriteSongs',
            type: 'Audio',
            id: 'favoriteSongs',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Audio]
            },
            cardOptions: {
                shape: 'overflowSquare',
                preferThumb: false,
                showTitle: true,
                overlayText: false,
                showParentTitle: true,
                centerText: true,
                overlayMoreButton: true,
                action: 'instantmix',
                coverImage: true
            }
        },
        {
            name: 'HeaderFavoriteBooks',
            type: 'Book',
            id: 'favoriteBooks',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Book]
            },
            cardOptions: {
                shape: 'overflowPortrait',
                showTitle: true,
                showYear: true,
                overlayPlayButton: true,
                overlayText: false,
                centerText: true
            }
        }
    ];
}

interface FavoriteItemsContainerProps {
    topParentId?: string | null;
    visibleId: string[];
}

const FavoriteItemsContainer: FC<FavoriteItemsContainerProps> = ({
    topParentId,
    visibleId
}) => {
    const favoriteSections = getFavoriteSections();

    return (
        <>
            {favoriteSections
                .filter((section) => visibleId.indexOf(section.id) !== -1)
                .map((section) => (
                    <FavoritesSectionContainer
                        key={section.id}
                        topParentId={topParentId}
                        section={section}
                    />
                ))}
        </>
    );
};

export default FavoriteItemsContainer;
