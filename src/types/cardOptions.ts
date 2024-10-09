import type { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import type { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import type { UserItemDataDto } from '@jellyfin/sdk/lib/generated-client/models/user-item-data-dto';
import type { BaseItemDtoImageBlurHashes } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto-image-blur-hashes';
import type { CollectionType } from '@jellyfin/sdk/lib/generated-client/models/collection-type';
import { CardShape } from 'utils/card';
import type { NullableString } from './base/common/shared/types';
import type { ItemDto } from './base/models/item-dto';
import type { ParentId } from './library';

export interface CardOptions {
    itemsContainer?: HTMLElement | null;
    parentContainer?: HTMLElement | null;
    items?: ItemDto[] | null;
    allowBottomPadding?: boolean;
    centerText?: boolean;
    coverImage?: boolean;
    inheritThumb?: boolean;
    overlayMoreButton?: boolean;
    overlayPlayButton?: boolean;
    overlayText?: boolean;
    imageBlurhashes?: BaseItemDtoImageBlurHashes | null;
    preferBanner?: boolean;
    preferThumb?: boolean | string | null;
    preferDisc?: boolean;
    preferLogo?: boolean;
    scalable?: boolean;
    shape?: CardShape;
    defaultShape?: CardShape;
    lazy?: boolean;
    cardLayout?: boolean | null;
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
    context?: CollectionType;
    action?: string | null;
    indexBy?: string;
    parentId?: ParentId;
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
    height?: number;
    widths?: any;
    showChannelLogo?: boolean;
    showLogo?: boolean;
    serverId?: NullableString;
    collectionId?: string | null;
    playlistId?: string | null;
    defaultCardImageIcon?: string;
    disableHoverMenu?: boolean;
    disableIndicators?: boolean;
    showGroupCount?: boolean;
    containerClass?: string;
    noItemsMessage?: string;
    showIndex?: boolean;
    index?: string;
    showIndexNumber?: boolean;
    enableContentWrapper?: boolean;
    enableOverview?: boolean;
    enablePlayedButton?: boolean;
    infoButton?: boolean;
    imageSize?: string;
    enableSideMediaInfo?: boolean;
    imagePlayButton?: boolean;
    border?: boolean;
    highlight?: boolean;
    smallIcon?: boolean;
    artist?: boolean;
    addToListButton?: boolean;
    enableUserDataButtons?: boolean;
    enableRatingButton?: boolean;
    image?: boolean;
    imageSource?: string;
    showProgramDateTime?: boolean;
    showChannel?: boolean;
    mediaInfo?: boolean;
    moreButton?: boolean;
    recordButton?: boolean;
    dragHandle?: boolean;
    showProgramTime?: boolean;
    parentTitleWithTitle?: boolean;
    showIndexNumberLeft?: boolean;
    sortBy?: string;
    textLines?: (item: ItemDto) => (BaseItemKind | string | undefined)[];
    userData?: UserItemDataDto;
    rightButtons?: {
        icon: string;
        title: string;
        id: string;
    }[];
    uiAspect?: number | null;
    primaryImageAspectRatio?: number | null;
    rows?: number | null;
    imageType?: ImageType;
    disableOverlayButtons?: boolean;
    disableFooter?: boolean;
    disableClasses?: boolean;
    queryKey?: string[]
}

