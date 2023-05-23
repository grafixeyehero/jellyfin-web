import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { VideoType } from '@jellyfin/sdk/lib/generated-client/models/video-type';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemSortBy } from '@jellyfin/sdk/lib/models/api/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { SeriesStatus } from '@jellyfin/sdk/lib/generated-client/models/series-status';
import * as userSettings from 'scripts/settings/userSettings';
import { LibraryViewSettings } from '../types/library';

export const getSortByEnum = (libraryViewSettings: LibraryViewSettings) => {
    const itemSortBy: ItemSortBy[] = [];

    if (libraryViewSettings.SortBy === 'SortName') {
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (libraryViewSettings.SortBy === 'Random') {
        itemSortBy.push(ItemSortBy.Random);
    }

    if (libraryViewSettings.SortBy === 'CommunityRating') {
        itemSortBy.push(ItemSortBy.CommunityRating);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (libraryViewSettings.SortBy === 'DateCreated') {
        itemSortBy.push(ItemSortBy.DateCreated);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (libraryViewSettings.SortBy === 'DatePlayed') {
        itemSortBy.push(ItemSortBy.DatePlayed);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (libraryViewSettings.SortBy === 'OfficialRating') {
        itemSortBy.push(ItemSortBy.OfficialRating);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (libraryViewSettings.SortBy === 'PlayCount') {
        itemSortBy.push(ItemSortBy.PlayCount);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (libraryViewSettings.SortBy === 'PremiereDate') {
        itemSortBy.push(ItemSortBy.PremiereDate);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (libraryViewSettings.SortBy === 'Runtime') {
        itemSortBy.push(ItemSortBy.Runtime);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    return itemSortBy;
};

export const getSortOrderEnum = (libraryViewSettings: LibraryViewSettings) => {
    if (libraryViewSettings.SortOrder === 'Descending') {
        return [SortOrder.Descending];
    }

    return [SortOrder.Ascending];
};

export const getSortQuery = (libraryViewSettings: LibraryViewSettings) => {
    return {
        sortBy: getSortByEnum(libraryViewSettings),
        sortOrder: getSortOrderEnum(libraryViewSettings)
    };
};

export const getIsFavoriteQuery = (viewType: string) => {
    return {
        isFavorite: viewType === 'favorites' ? true : undefined
    };
};

export const getLimitQuery = () => {
    return {
        limit: userSettings.libraryPageSize(undefined) || undefined
    };
};

export const getAlphaPickerQuery = (libraryViewSettings: LibraryViewSettings) => {
    return {
        nameLessThan: libraryViewSettings.NameLessThan !== null ?
            libraryViewSettings.NameLessThan : undefined,
        nameStartsWith: libraryViewSettings.NameStartsWith !== null ?
            libraryViewSettings.NameStartsWith : undefined
    };
};

export const getImageTypesEnum = (libraryViewSettings: LibraryViewSettings) => {
    const imageTypes: ImageType[] = [ImageType.Backdrop];

    if (
        libraryViewSettings.imageType === 'primary'
        || libraryViewSettings.imageType === 'list'
    ) {
        imageTypes.push(ImageType.Primary);
    }

    if (libraryViewSettings.imageType === 'banner') {
        imageTypes.push(ImageType.Banner);
    }

    if (libraryViewSettings.imageType === 'disc') {
        imageTypes.push(ImageType.Disc);
    }

    if (libraryViewSettings.imageType === 'logo') {
        imageTypes.push(ImageType.Logo);
    }

    if (libraryViewSettings.imageType === 'thumb') {
        imageTypes.push(ImageType.Thumb);
    }

    return imageTypes;
};

export const getImageTypesQuery = (libraryViewSettings: LibraryViewSettings) => {
    return {
        enableImageTypes: getImageTypesEnum(libraryViewSettings)
    };
};

export const getVideoTypesEnum = (libraryViewSettings: LibraryViewSettings) => {
    const videoTypes: VideoType[] = [];

    if (libraryViewSettings.filtersVideoTypes?.includes('Bluray')) {
        videoTypes.push(VideoType.BluRay);
    }

    if (libraryViewSettings.filtersVideoTypes?.includes('Dvd')) {
        videoTypes.push(VideoType.Dvd);
    }

    if (libraryViewSettings.filtersVideoTypes?.includes('Iso')) {
        videoTypes.push(VideoType.Iso);
    }

    return videoTypes;
};

export const getHasVideoTypes = (libraryViewSettings: LibraryViewSettings) => {
    let isHd;

    if (libraryViewSettings.filtersVideoTypes?.includes('IsHD')) {
        isHd = true;
    }

    if (libraryViewSettings.filtersVideoTypes?.includes('IsSD')) {
        isHd = false;
    }

    return {
        isHd,
        is4K: libraryViewSettings.filtersVideoTypes?.includes('Is4K') ?
            true :
            undefined,
        is3D: libraryViewSettings.filtersVideoTypes?.includes('Is3D') ?
            true :
            undefined
    };
};

export const getFiltersFeatures = (libraryViewSettings: LibraryViewSettings) => {
    return {
        hasSubtitles: libraryViewSettings.filtersFeatures?.includes('HasSubtitles') ?
            true :
            undefined,
        hasTrailer: libraryViewSettings.filtersFeatures?.includes('HasTrailer') ?
            true :
            undefined,
        hasSpecialFeature: libraryViewSettings.filtersFeatures?.includes(
            'HasSpecialFeature'
        ) ?
            true :
            undefined,
        hasThemeSong: libraryViewSettings.filtersFeatures?.includes('HasThemeSong') ?
            true :
            undefined,
        hasThemeVideo: libraryViewSettings.filtersFeatures?.includes(
            'HasThemeVideo'
        ) ?
            true :
            undefined
    };
};

export const getFiltersStatus = (
    viewType: string,
    libraryViewSettings: LibraryViewSettings
) => {
    return {
        parentIndexNumber: libraryViewSettings.filtersStatus?.includes(
            'ParentIndexNumber'
        ) ?
            0 :
            undefined,
        isMissing:
            viewType === 'episodes' ?
                !!libraryViewSettings.filtersStatus?.includes('IsMissing') :
                undefined,
        isUnaired: libraryViewSettings.filtersStatus?.includes('IsUnaired') ?
            true :
            undefined
    };
};

export const getSeriesStatusEnum = (libraryViewSettings: LibraryViewSettings) => {
    const seriesStatus: SeriesStatus[] = [];

    if (libraryViewSettings.filtersSeriesStatus?.includes('Continuing')) {
        seriesStatus.push(SeriesStatus.Continuing);
    }

    if (libraryViewSettings.filtersSeriesStatus?.includes('Ended')) {
        seriesStatus.push(SeriesStatus.Ended);
    }

    return seriesStatus;
};

export const getItemFiltersEnum = (libraryViewSettings: LibraryViewSettings) => {
    const itemFilter: ItemFilter[] = [];

    if (libraryViewSettings.filtersStatus?.includes('IsPlayed')) {
        itemFilter.push(ItemFilter.IsPlayed);
    }

    if (libraryViewSettings.filtersStatus?.includes('IsUnplayed')) {
        itemFilter.push(ItemFilter.IsUnplayed);
    }

    if (libraryViewSettings.filtersStatus?.includes('IsFavorite')) {
        itemFilter.push(ItemFilter.IsFavorite);
    }

    if (libraryViewSettings.filtersStatus?.includes('IsResumable')) {
        itemFilter.push(ItemFilter.IsResumable);
    }

    return itemFilter;
};

export const getFiltersQuery = (
    viewType: string,
    libraryViewSettings: LibraryViewSettings
) => {
    return {
        ...getFiltersFeatures(libraryViewSettings),
        ...getFiltersStatus(viewType, libraryViewSettings),
        ...getHasVideoTypes(libraryViewSettings),
        seriesStatus: getSeriesStatusEnum(libraryViewSettings),
        videoTypes: getVideoTypesEnum(libraryViewSettings),
        filters: getItemFiltersEnum(libraryViewSettings),
        genres: libraryViewSettings.filtersGenres,
        officialRatings: libraryViewSettings.filtersOfficialRatings,
        tags: libraryViewSettings.filtersTags,
        years: libraryViewSettings.filtersYears,
        studioIds: libraryViewSettings.filtersStudioIds
    };
};

export const getFieldsEnum = (
    viewType: string,
    libraryViewSettings: LibraryViewSettings
) => {
    const itemFields: ItemFields[] = [];

    if (viewType !== 'studios') {
        itemFields.push(ItemFields.BasicSyncInfo, ItemFields.MediaSourceCount);
    }

    if (libraryViewSettings.imageType === 'primary') {
        itemFields.push(ItemFields.PrimaryImageAspectRatio);
    }

    if (viewType === 'studios') {
        itemFields.push(
            ItemFields.DateCreated,
            ItemFields.PrimaryImageAspectRatio
        );
    }

    return itemFields;
};

export const getItemFieldsQuery = (
    viewType: string,
    libraryViewSettings: LibraryViewSettings
) => {
    return {
        fields: getFieldsEnum(viewType, libraryViewSettings)
    };
};

export const getItemTypesEnum = (viewType: string) => {
    const itemType: BaseItemKind[] = [];

    if (viewType === 'movies' || viewType === 'favorites') {
        itemType.push(BaseItemKind.Movie);
    }

    if (viewType === 'collections') {
        itemType.push(BaseItemKind.BoxSet);
    }

    if (viewType === 'trailers') {
        itemType.push(BaseItemKind.Trailer);
    }

    if (viewType === 'series') {
        itemType.push(BaseItemKind.Series);
    }

    if (viewType === 'episodes') {
        itemType.push(BaseItemKind.Episode);
    }

    if (viewType === 'albums') {
        itemType.push(BaseItemKind.MusicAlbum);
    }

    if (viewType === 'songs') {
        itemType.push(BaseItemKind.Audio);
    }

    if (viewType === 'playlist') {
        itemType.push(BaseItemKind.Playlist);
    }

    if (viewType === 'books') {
        itemType.push(BaseItemKind.Book);
    }

    if (viewType === 'photos') {
        itemType.push(BaseItemKind.Photo);
    }

    if (viewType === 'videos') {
        itemType.push(BaseItemKind.Video);
    }

    return itemType;
};

export const getItemTypesQuery = (viewType: string) => {
    return {
        includeItemTypes: getItemTypesEnum(viewType)
    };
};

