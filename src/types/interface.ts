import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { VideoType } from '@jellyfin/sdk/lib/generated-client/models/video-type';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ItemSortBy } from '@jellyfin/sdk/lib/models/api/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { SeriesStatus } from '@jellyfin/sdk/lib/generated-client/models/series-status';

export interface ParametersOptions {
    sortBy?: ItemSortBy[];
    sortOrder?: SortOrder[];
    includeItemTypes?: BaseItemKind[];
    fields?: ItemFields[];
    enableImageTypes?: ImageType[];
    videoTypes?: VideoType[];
    seriesStatus?: SeriesStatus[];
    filters?: ItemFilter[];
    limit?: number;
    isFavorite?: boolean;
    genres?: string[];
    officialRatings?: string[];
    tags?: string[];
    years?: number[];
    is4K?: boolean;
    isHd?: boolean;
    is3D?: boolean;
    hasSubtitles?: boolean;
    hasTrailer?: boolean;
    hasSpecialFeature?: boolean;
    hasThemeSong?: boolean;
    hasThemeVideo?: boolean;
    parentIndexNumber?: number;
    isMissing?: boolean;
    isUnaired?: boolean;
    startIndex?: number;
    nameLessThan?: string;
    nameStartsWith?: string;
    collapseBoxSetItems?: boolean;
    enableTotalRecordCount?: boolean;
}

export interface ViewUserSettings {
    showTitle?: boolean;
    showYear?: boolean;
    imageType?: string;
    cardLayout?: boolean;
    SortBy?: string;
    SortOrder?: string;
    filtersFeatures?: string[];
    filtersGenres?: string[];
    filtersOfficialRatings?: string[];
    filtersTags?: string[];
    filtersYears?: number[];
    filtersVideoTypes?: string[];
    filtersStatus?: string[];
    filtersSeriesStatus?: string[];
    filtersStudios?: string[];
    filtersStudioIds?: string[];
    NameLessThan?: string;
    NameStartsWith?: string;
    StartIndex?: number;
}

export interface CardOptions {
    itemsContainer?: HTMLElement | null;
    parentContainer?: HTMLElement | null;
    items?: BaseItemDto[] | null;
    allowBottomPadding?: boolean;
    centerText?: boolean;
    coverImage?: boolean;
    inheritThumb?: boolean;
    overlayMoreButton?: boolean;
    overlayPlayButton?: boolean;
    overlayText?: boolean;
    preferThumb?: boolean;
    preferDisc?: boolean;
    preferLogo?: boolean;
    scalable?: boolean;
    shape?: string | null;
    lazy?: boolean;
    cardLayout?: boolean | string;
    showParentTitle?: boolean;
    showParentTitleOrTitle?: boolean;
    showAirTime?: boolean;
    showAirDateTime?: boolean;
    showChannelName?: boolean;
    showTitle?: boolean | string;
    showYear?: boolean | string;
    showDetailsMenu?: boolean;
    missingIndicator?: boolean;
    showLocationTypeIndicator?: boolean;
    showSeriesYear?: boolean;
    showUnplayedIndicator?: boolean;
    showChildCountIndicator?: boolean;
    lines?: number;
    context?: string | null;
    action?: string | null;
    defaultShape?: string;
    indexBy?: string;
    parentId?: string | null;
    showMenu?: boolean;
    cardCssClass?: string | null;
    cardClass?: string | null;
    centerPlayButton?: boolean;
    overlayInfoButton?: boolean;
    autoUpdate?: boolean;
    cardFooterAside?: string;
    includeParentInfoInTitle?: boolean;
    maxLines?: number;
    overlayMarkPlayedButton?: boolean;
    overlayRateButton?: boolean;
    showAirEndTime?: boolean;
    showCurrentProgram?: boolean;
    showCurrentProgramTime?: boolean;
    showItemCounts?: boolean;
    showPersonRoleOrType?: boolean;
    showProgressBar?: boolean;
    showPremiereDate?: boolean;
    showRuntime?: boolean;
    showSeriesTimerTime?: boolean;
    showSeriesTimerChannel?: boolean;
    showSongCount?: boolean;
    width?: number;
    showChannelLogo?: boolean;
    showLogo?: boolean;
    serverId?: string;
    collectionId?: string | null;
    playlistId?: string | null;
    defaultCardImageIcon?: string;
    disableHoverMenu?: boolean;
    disableIndicators?: boolean;
    showGroupCount?: boolean;
    containerClass?: string;
    noItemsMessage?: string;
}

export interface LibraryViewProps {
    topParentId?: string | null;
    context?: string | null;
}

export interface Sections {
    name: string;
    id: string;
    type: string;
    viewType?: string,
    parametersOptions?: ParametersOptions;
    cardOptions: CardOptions;
}
