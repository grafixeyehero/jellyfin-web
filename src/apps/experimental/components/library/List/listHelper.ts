import { Api } from '@jellyfin/sdk';
import { BaseItemDto, BaseItemKind, ImageType, TimerInfoDto } from '@jellyfin/sdk/lib/generated-client';
import globalize from 'scripts/globalize';
import { DataAttributes } from 'types/dataAttributes';
import { ListOptions } from 'types/listOptions';

const sortBySortName = (item: BaseItemDto): string => {
    if (item.Type === BaseItemKind.Episode) {
        return '';
    }

    // SortName
    const name = (item.SortName ?? item.Name ?? '?')[0].toUpperCase();

    const code = name.charCodeAt(0);
    if (code < 65 || code > 90) {
        return '#';
    }

    return name.toUpperCase();
};

const sortByOfficialrating = (item: BaseItemDto): string => {
    return item.OfficialRating ?? globalize.translate('Unrated');
};

const sortByCommunityRating = (item: BaseItemDto): string => {
    if (item.CommunityRating == null) {
        return globalize.translate('Unrated');
    }

    return String(Math.floor(item.CommunityRating));
};

const sortByCriticRating = (item: BaseItemDto): string => {
    if (item.CriticRating == null) {
        return globalize.translate('Unrated');
    }

    return String(Math.floor(item.CriticRating));
};

const sortByAlbumArtist = (item: BaseItemDto): string => {
    // SortName
    if (!item.AlbumArtist) {
        return '';
    }

    const name = item.AlbumArtist[0].toUpperCase();

    const code = name.charCodeAt(0);
    if (code < 65 || code > 90) {
        return '#';
    }

    return name.toUpperCase();
};

export function getIndex(item: BaseItemDto, listOptions: ListOptions): string {
    if (listOptions.index === 'disc') {
        return item.ParentIndexNumber == null ?
            '' :
            globalize.translate('ValueDiscNumber', item.ParentIndexNumber);
    }

    const sortBy = (listOptions.sortBy ?? '').toLowerCase();

    if (sortBy.startsWith('sortname')) {
        return sortBySortName(item);
    }
    if (sortBy.startsWith('officialrating')) {
        return sortByOfficialrating(item);
    }
    if (sortBy.startsWith('communityrating')) {
        return sortByCommunityRating(item);
    }
    if (sortBy.startsWith('criticrating')) {
        return sortByCriticRating(item);
    }
    if (sortBy.startsWith('albumartist')) {
        return sortByAlbumArtist(item);
    }
    return '';
}

export function getDataAttributes(
    item: BaseItemDto,
    listOptions: ListOptions
): DataAttributes {
    return {
        'data-playlistitemid': item.PlaylistItemId,
        'data-timerid': item.TimerId,
        'data-seriestimerid': item.SeriesTimerId,
        'data-isfolder': item.IsFolder,
        'data-serverid': item.ServerId,
        'data-id': item.Id,
        'data-type': item.Type,
        'data-positionticks': item.UserData?.PlaybackPositionTicks,
        'data-collectionid': listOptions.collectionId,
        'data-playlistid': listOptions.playlistId,
        'data-mediatype': item.MediaType,
        'data-channelid': item.ChannelId,
        'data-path': item.Path,
        'data-collectiontype': item.CollectionType,
        'data-context': listOptions.context,
        'data-parentid': listOptions.parentId,
        'data-startdate': item.StartDate?.toString(),
        'data-enddate': item.EndDate?.toString()
    };
}

export function getImageUrl(
    item: BaseItemDto,
    api: Api | undefined,
    size: number | undefined
) {
    let imgTag;
    let itemId;
    const fillWidth = size;
    const fillHeight = size;
    const imgType = ImageType.Primary;

    if (item.ImageTags?.Primary) {
        imgTag = item.ImageTags.Primary;
        itemId = item.Id;
    } else if (item.AlbumId && item.AlbumPrimaryImageTag) {
        imgTag = item.AlbumPrimaryImageTag;
        itemId = item.AlbumId;
    } else if (item.SeriesId && item.SeriesPrimaryImageTag) {
        imgTag = item.SeriesPrimaryImageTag;
        itemId = item.SeriesId;
    } else if (item.ParentPrimaryImageTag) {
        imgTag = item.ParentPrimaryImageTag;
        itemId = item.ParentPrimaryImageItemId;
    }

    if (api && imgTag && imgType && itemId) {
        const response = api.getItemImageUrl(itemId, imgType, {
            fillWidth: fillWidth,
            fillHeight: fillHeight,
            tag: imgTag
        });

        return {
            imgUrl: response,
            blurhash: item.ImageBlurHashes?.[imgType]?.[imgTag]
        };
    }

    return {
        imgUrl: undefined,
        blurhash: undefined
    };
}

export function getChannelImageUrl(
    item: BaseItemDto,
    api: Api | undefined,
    size: number | undefined
) {
    let imgTag;
    let itemId;
    const fillWidth = size;
    const fillHeight = size;
    const imgType = ImageType.Primary;

    if (item.ChannelId && item.ChannelPrimaryImageTag) {
        imgTag = item.ChannelPrimaryImageTag;
        itemId = item.ChannelId;
    }

    if (api && imgTag && imgType && itemId) {
        const response = api.getItemImageUrl(itemId, imgType, {
            fillWidth: fillWidth,
            fillHeight: fillHeight,
            tag: imgTag
        });

        return {
            imgUrl: response,
            blurhash: item.ImageBlurHashes?.[imgType]?.[imgTag]
        };
    }

    return {
        imgUrl: undefined,
        blurhash: undefined
    };
}

export function canResume(PlaybackPositionTicks: number | undefined): boolean {
    return Boolean(
        PlaybackPositionTicks
            && PlaybackPositionTicks > 0
    );
}

export function enableProgressIndicator(item: BaseItemDto) {
    return (
        (item.MediaType === 'Video' && item.Type !== BaseItemKind.TvChannel && item.Type !== BaseItemKind.Recording)
        || item.Type === BaseItemKind.AudioBook
        || (item as any).Type === 'AudioPodcast' //didn't find relevant value
    );
}

export function isUsingLiveTvNaming(item: BaseItemDto) {
    return (
        item.Type === BaseItemKind.Program
        || (item as TimerInfoDto).Type === 'Timer'
        || item.Type === BaseItemKind.Recording
    );
}
