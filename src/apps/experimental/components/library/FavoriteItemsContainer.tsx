import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import FavoritesSectionContainer from './FavoritesSectionContainer';
import { ParentId } from 'types/library';
import { FavoriteSection, FavoriteSectionView, FavoriteSectionType } from 'types/favoriteSections';

function getFavoriteSections(): FavoriteSection[] {
    return [
        {
            name: 'HeaderFavoriteMovies',
            type: 'Movie',
            view: FavoriteSectionView.FavoriteMovies,
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
            view: FavoriteSectionView.FavoriteShows,
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
            view: FavoriteSectionView.FavoriteEpisode,
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
            view: FavoriteSectionView.FavoriteVideos,
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
            view: FavoriteSectionView.FavoriteCollections,
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
            view: FavoriteSectionView.FavoritePlaylists,
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
            viewType: FavoriteSectionType.Persons,
            type: 'Person',
            view: FavoriteSectionView.FavoritePeople,
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
            viewType: FavoriteSectionType.Artists,
            type: 'MusicArtist',
            view: FavoriteSectionView.FavoriteArtists,
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
            view: FavoriteSectionView.FavoriteAlbums,
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
            view: FavoriteSectionView.FavoriteSongs,
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
            view: FavoriteSectionView.FavoriteBooks,
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
    parentId?: ParentId;
    sectionsViews: FavoriteSectionView[];
}

const FavoriteItemsContainer: FC<FavoriteItemsContainerProps> = ({
    parentId,
    sectionsViews
}) => {
    const favoriteSections = getFavoriteSections();

    return (
        <>
            {favoriteSections
                .filter((section) => sectionsViews.includes(section.view))
                .map((section) => (
                    <FavoritesSectionContainer
                        key={section.view}
                        parentId={parentId}
                        section={section}
                    />
                ))}
        </>
    );
};

export default FavoriteItemsContainer;
