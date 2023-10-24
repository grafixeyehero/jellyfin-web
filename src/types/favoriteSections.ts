import { CardOptions } from './cardOptions';
import { ParametersOptions } from './parametersOptions';

export enum FavoriteSectionType {
    Artists = 'artists',
    Persons = 'persons',
}

export enum FavoriteSectionView {
    FavoriteMovies = 'favoriteMovies',
    FavoriteShows = 'favoriteShows',
    FavoriteEpisode = 'favoriteEpisode',
    FavoriteVideos = 'favoriteVideos',
    FavoriteCollections = 'favoriteCollections',
    FavoritePlaylists = 'favoritePlaylists',
    FavoritePeople = 'favoritePeople',
    FavoriteArtists = 'favoriteArtists',
    FavoriteAlbums = 'favoriteAlbums',
    FavoriteSongs = 'favoriteSongs',
    FavoriteBooks = 'favoriteBooks',
}

export interface FavoriteSection {
    name: string;
    view: FavoriteSectionView;
    type: string;
    viewType?: FavoriteSectionType,
    parametersOptions?: ParametersOptions;
    cardOptions: CardOptions;
}
