import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { SeriesStatus } from '@jellyfin/sdk/lib/generated-client/models/series-status';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { VideoType } from '@jellyfin/sdk/lib/generated-client/models/video-type';
import { ItemSortBy } from '@jellyfin/sdk/lib/models/api/item-sort-by';

import * as userSettings from '../scripts/settings/userSettings';
import { ViewUserSettings } from '../types/interface';

export const getSortByEnum = (viewUserSettings: ViewUserSettings) => {
    const itemSortBy: ItemSortBy[] = [];

    if (viewUserSettings.SortBy === 'SortName') {
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (viewUserSettings.SortBy === 'Random') {
        itemSortBy.push(ItemSortBy.Random);
    }

    if (viewUserSettings.SortBy === 'CommunityRating') {
        itemSortBy.push(ItemSortBy.CommunityRating);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (viewUserSettings.SortBy === 'DateCreated') {
        itemSortBy.push(ItemSortBy.DateCreated);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (viewUserSettings.SortBy === 'DatePlayed') {
        itemSortBy.push(ItemSortBy.DatePlayed);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (viewUserSettings.SortBy === 'OfficialRating') {
        itemSortBy.push(ItemSortBy.OfficialRating);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (viewUserSettings.SortBy === 'PlayCount') {
        itemSortBy.push(ItemSortBy.PlayCount);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (viewUserSettings.SortBy === 'PremiereDate') {
        itemSortBy.push(ItemSortBy.PremiereDate);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    if (viewUserSettings.SortBy === 'Runtime') {
        itemSortBy.push(ItemSortBy.Runtime);
        itemSortBy.push(ItemSortBy.SortName);
        itemSortBy.push(ItemSortBy.ProductionYear);
    }

    return itemSortBy;
};

export const getSortOrderEnum = (viewUserSettings: ViewUserSettings) => {
    if (viewUserSettings.SortOrder === 'Descending') {
        return [SortOrder.Descending];
    }

    return [SortOrder.Ascending];
};

export const getSortQuery = (viewUserSettings: ViewUserSettings) => {
    return {
        sortBy: getSortByEnum(viewUserSettings),
        sortOrder: getSortOrderEnum(viewUserSettings)
    };
};

export const getImageType = (viewUserSettings: ViewUserSettings) => {
    const imageTypes: ImageType[] = [ImageType.Backdrop];

    if (
        viewUserSettings.imageType === 'primary'
        || viewUserSettings.imageType === 'list'
    ) {
        imageTypes.push(ImageType.Primary);
    }

    if (viewUserSettings.imageType === 'banner') {
        imageTypes.push(ImageType.Banner);
    }

    if (viewUserSettings.imageType === 'disc') {
        imageTypes.push(ImageType.Disc);
    }

    if (viewUserSettings.imageType === 'logo') {
        imageTypes.push(ImageType.Logo);
    }

    if (viewUserSettings.imageType === 'thumb') {
        imageTypes.push(ImageType.Thumb);
    }

    return imageTypes;
};

export const getImageTypesQuery = (viewUserSettings: ViewUserSettings) => {
    return {
        enableImageTypes: getImageType(viewUserSettings)
    };
};

export const getVideoTypes = (viewUserSettings: ViewUserSettings) => {
    const videoTypes: VideoType[] = [];

    if (viewUserSettings.filtersVideoTypes?.includes('Bluray')) {
        videoTypes.push(VideoType.BluRay);
    }

    if (viewUserSettings.filtersVideoTypes?.includes('Dvd')) {
        videoTypes.push(VideoType.Dvd);
    }

    if (viewUserSettings.filtersVideoTypes?.includes('Iso')) {
        videoTypes.push(VideoType.Iso);
    }

    return videoTypes;
};

export const getHasVideoTypes = (viewUserSettings: ViewUserSettings) => {
    let isHd;

    if (viewUserSettings.filtersVideoTypes?.includes('IsHD')) {
        isHd = true;
    }

    if (viewUserSettings.filtersVideoTypes?.includes('IsSD')) {
        isHd = false;
    }

    return {
        isHd,
        is4K: viewUserSettings.filtersVideoTypes?.includes('Is4K') ?
            true :
            undefined,
        is3D: viewUserSettings.filtersVideoTypes?.includes('Is3D') ?
            true :
            undefined
    };
};

export const getFiltersFeatures = (viewUserSettings: ViewUserSettings) => {
    return {
        hasSubtitles: viewUserSettings.filtersFeatures?.includes('HasSubtitles') ?
            true :
            undefined,
        hasTrailer: viewUserSettings.filtersFeatures?.includes('HasTrailer') ?
            true :
            undefined,
        hasSpecialFeature: viewUserSettings.filtersFeatures?.includes(
            'HasSpecialFeature'
        ) ?
            true :
            undefined,
        hasThemeSong: viewUserSettings.filtersFeatures?.includes('HasThemeSong') ?
            true :
            undefined,
        hasThemeVideo: viewUserSettings.filtersFeatures?.includes(
            'HasThemeVideo'
        ) ?
            true :
            undefined
    };
};

export const getFiltersStatus = (
    viewType: string,
    viewUserSettings: ViewUserSettings
) => {
    return {
        parentIndexNumber: viewUserSettings.filtersStatus?.includes(
            'ParentIndexNumber'
        ) ?
            0 :
            undefined,
        isMissing:
            viewType === 'episodes' ?
                !!viewUserSettings.filtersStatus?.includes('IsMissing') :
                undefined,
        isUnaired: viewUserSettings.filtersStatus?.includes('IsUnaired') ?
            true :
            undefined
    };
};

export const getSeriesStatus = (viewUserSettings: ViewUserSettings) => {
    const seriesStatus: SeriesStatus[] = [];

    if (viewUserSettings.filtersSeriesStatus?.includes('Continuing')) {
        seriesStatus.push(SeriesStatus.Continuing);
    }

    if (viewUserSettings.filtersSeriesStatus?.includes('Ended')) {
        seriesStatus.push(SeriesStatus.Ended);
    }

    return seriesStatus;
};

export const getItemFilters = (viewUserSettings: ViewUserSettings) => {
    const itemFilter: ItemFilter[] = [];

    if (viewUserSettings.filtersStatus?.includes('IsPlayed')) {
        itemFilter.push(ItemFilter.IsPlayed);
    }

    if (viewUserSettings.filtersStatus?.includes('IsUnplayed')) {
        itemFilter.push(ItemFilter.IsUnplayed);
    }

    if (viewUserSettings.filtersStatus?.includes('IsFavorite')) {
        itemFilter.push(ItemFilter.IsFavorite);
    }

    if (viewUserSettings.filtersStatus?.includes('IsResumable')) {
        itemFilter.push(ItemFilter.IsResumable);
    }

    return itemFilter;
};

export const getFiltersQuery = (
    viewType: string,
    viewUserSettings: ViewUserSettings
) => {
    return {
        ...getFiltersFeatures(viewUserSettings),
        ...getFiltersStatus(viewType, viewUserSettings),
        ...getHasVideoTypes(viewUserSettings),
        seriesStatus: getSeriesStatus(viewUserSettings),
        videoTypes: getVideoTypes(viewUserSettings),
        filters: getItemFilters(viewUserSettings),
        genres: viewUserSettings.filtersGenres,
        officialRatings: viewUserSettings.filtersOfficialRatings,
        tags: viewUserSettings.filtersTags,
        years: viewUserSettings.filtersYears,
        studios: viewUserSettings.filtersStudios,
        studioIds: viewUserSettings.filtersStudioIds
    };
};

export const getFields = (
    viewType: string,
    viewUserSettings: ViewUserSettings
) => {
    const itemFields: ItemFields[] = [];

    if (viewType !== 'studios') {
        itemFields.push(ItemFields.BasicSyncInfo, ItemFields.MediaSourceCount);
    }

    if (viewUserSettings.imageType === 'primary') {
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
    viewUserSettings: ViewUserSettings
) => {
    return {
        fields: getFields(viewType, viewUserSettings)
    };
};

export const getItemTypes = (viewType: string | null | undefined) => {
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

    if (viewType === 'books') {
        itemType.push(BaseItemKind.Book);
    }

    return itemType;
};

export const getItemTypesQuery = (viewType: string | null | undefined) => {
    return {
        includeItemTypes: getItemTypes(viewType)
    };
};

const getDefaultSortBy = () => {
    return 'SortName';
};

export const getDefaultViewUserSettings = (
    viewType: string
): ViewUserSettings => {
    let imageType;
    let showYear;

    if (viewType === 'studios') {
        imageType = 'thumb';
        showYear = false;
    } else if (viewType === 'songs') {
        imageType = 'list';
    } else {
        imageType = 'primary';
    }

    return {
        showTitle: true,
        showYear: showYear,
        imageType: imageType,
        cardLayout: false,
        SortBy: getDefaultSortBy(),
        SortOrder: 'Ascending',
        filtersFeatures: [],
        filtersGenres: [],
        filtersOfficialRatings: [],
        filtersTags: [],
        filtersYears: [],
        filtersVideoTypes: [],
        filtersStatus: [],
        filtersSeriesStatus: [],
        filtersStudios: [],
        filtersStudioIds: [],
        StartIndex: 0
    };
};

export const getMUIThemeMode = (IsDashboardTheme?: boolean) => {
    const mode = IsDashboardTheme ? userSettings.dashboardTheme(undefined) : userSettings.theme(undefined);
    switch (mode) {
        case 'appletv':
        case 'light':
            return 'light';
        case 'purplehaze':
        case 'blueradiance':
        case 'wmc':
        default:
            return 'dark';
    }
};
