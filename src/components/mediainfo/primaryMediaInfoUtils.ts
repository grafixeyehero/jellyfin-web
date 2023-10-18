import { BaseItemDto, BaseItemKind, SeriesTimerInfoDto, TimerInfoDto } from '@jellyfin/sdk/lib/generated-client';
import escapeHTML from 'escape-html';
import * as userSettings from 'scripts/settings/userSettings';
import globalize from 'scripts/globalize';
import datetime from 'scripts/datetime';
import itemHelper from '../itemHelper';
import { MiscInfo } from 'types/mediaInfoItem';

export function shouldShowFolderRuntime(
    Type: BaseItemKind | undefined,
    MediaType: string | null | undefined
): boolean {
    return (
        Type === BaseItemKind.MusicAlbum
        || MediaType === 'MusicArtist'
        || Type === BaseItemKind.Playlist
        || MediaType === 'Playlist'
        || MediaType === 'MusicGenre'
    );
}

export function shouldShowPhotoAlbumOrBoxSet(
    Type: BaseItemKind | undefined
): boolean {
    return Type === BaseItemKind.PhotoAlbum || Type === BaseItemKind.BoxSet;
}

export function shouldShowOriginalAirDate(
    Type: BaseItemKind | undefined,
    MediaType: string | null | undefined,
    PremiereDate: string | null | undefined,
    isOriginalAirDateEnabled: boolean
): boolean {
    return (
        (Type === BaseItemKind.Episode || MediaType === 'Photo')
        && isOriginalAirDateEnabled
        && Boolean(PremiereDate)
    );
}

export function shouldShowOfficialRating(
    Type: BaseItemKind | undefined,
    OfficialRating: string | null | undefined,
    isOfficialRatingEnabled: boolean
): boolean {
    return (
        isOfficialRatingEnabled
        && Boolean(OfficialRating)
        && Type !== BaseItemKind.Season
        && Type !== BaseItemKind.Episode
    );
}

export function shouldShowCriticRating(
    CriticRating: number | null | undefined,
    isCriticRatingEnabled: boolean
): boolean {
    return Boolean(CriticRating) && isCriticRatingEnabled;
}

export function shouldShowStartDate(item: BaseItemDto | SeriesTimerInfoDto | TimerInfoDto): boolean {
    return (
        Boolean(item.StartDate)
        && item.Type !== BaseItemKind.Program
        && (item as SeriesTimerInfoDto).Type !== 'SeriesTimer' //this is SeriesTimerInfoDto
        && (item as TimerInfoDto).Type !== 'Timer' // this is TimerInfoDto
    );
}

export function shouldShowSeriesProductionYear(
    item: BaseItemDto,
    isYearEnabled: boolean
): boolean {
    return (
        isYearEnabled
        && Boolean(item.ProductionYear)
        && item.Type === BaseItemKind.Series
    );
}

export function shouldShowYear(
    item: BaseItemDto,
    isYearEnabled: boolean
): boolean {
    return (
        isYearEnabled
        && item.Type !== BaseItemKind.Series
        && item.Type !== BaseItemKind.Episode
        && item.Type !== BaseItemKind.Person
        && item.MediaType !== 'Photo'
        && item.Type !== BaseItemKind.Program
        && item.Type !== BaseItemKind.Season
    );
}

export function shouldShowRunTime(
    item: BaseItemDto,
    showFolderRuntime: boolean,
    isRuntimeEnabled: boolean
): boolean {
    return (
        Boolean(item.RunTimeTicks)
        && item.Type !== BaseItemKind.Series
        && item.Type !== BaseItemKind.Program
        && (item as TimerInfoDto).Type !== 'Timer'
        && item.Type !== BaseItemKind.Book
        && !showFolderRuntime
        && isRuntimeEnabled
    );
}

export function shouldShowSize(
    MediaType: string | null | undefined,
    Width: number | null | undefined,
    Height: number | null | undefined
): boolean {
    return MediaType === 'Photo' && Boolean(Width) && Boolean(Height);
}

export function shouldShowContainer(
    Type: BaseItemKind | undefined,
    Container: string | null | undefined,
    isContainerEnabled: boolean
): boolean {
    return (
        isContainerEnabled && Type === BaseItemKind.Audio && Boolean(Container)
    );
}

export function isSeriesTimer(item: SeriesTimerInfoDto): boolean {
    return item.Type === 'SeriesTimer';
}

export function isProgramOrTimer(item: BaseItemDto): boolean {
    return item.Type === BaseItemKind.Program || (item as TimerInfoDto).Type === 'Timer';
}

export function addFolderRuntimeInfo(
    miscInfo: MiscInfo[],
    SongCount: number | null | undefined,
    ChildCount: number | null | undefined,
    RunTimeTicks: number | null | undefined
): void {
    const count = SongCount ?? ChildCount;
    if (count) {
        miscInfo.push({
            text: globalize.translate('TrackCount', count)
        });
    }

    if (RunTimeTicks) {
        miscInfo.push({
            text: datetime.getDisplayDuration(RunTimeTicks)
        });
    }
}

export function addPhotoAlbumOrBoxSetInfo(
    miscInfo: MiscInfo[],
    ChildCount: number | null | undefined
): void {
    const count = ChildCount;
    if (count) {
        miscInfo.push({
            text: globalize.translate('ItemCount', count)
        });
    }
}

export function addOriginalAirDateInfo(
    miscInfo: MiscInfo[],
    PremiereDate: string | null | undefined,
    Type: BaseItemKind | undefined
): void {
    try {
        const date = datetime.parseISO8601Date(
            PremiereDate,
            Type !== BaseItemKind.Episode
        );
        const text = datetime.toLocaleDateString(date);
        miscInfo.push({
            text
        });
    } catch (e) {
        console.error('error parsing date:', PremiereDate);
    }
}

export function addSeriesTimerInfo(miscInfo: MiscInfo[], item: SeriesTimerInfoDto): void {
    if (item.RecordAnyTime) {
        miscInfo.push({
            text: globalize.translate('Anytime')
        });
    } else {
        miscInfo.push({
            text: datetime.getDisplayTime(item.StartDate)
        });
    }

    if (item.RecordAnyChannel) {
        miscInfo.push({
            text: globalize.translate('AllChannels')
        });
    } else {
        miscInfo.push({
            text: item.ChannelName ?? globalize.translate('OneChannel')
        });
    }
}

export function addProgramIsLiveIsPremiereIsSeriesOrIsRepeatInfo(program: BaseItemDto | undefined, miscInfo: MiscInfo[]): void {
    if (program?.IsLive
        && userSettings.get('guide-indicator-live', false) === 'true') {
        miscInfo.push({
            text: 'Live',
            cssClass: 'mediaInfoProgramAttribute liveTvProgram'
        });
    } else if (program?.IsPremiere
        && userSettings.get('guide-indicator-premiere', false) === 'true') {
        miscInfo.push({
            text: 'Premiere',
            cssClass: 'mediaInfoProgramAttribute premiereTvProgram'
        });
    } else if (program?.IsSeries
        && !program?.IsRepeat
        && userSettings.get('guide-indicator-new', false) === 'true') {
        miscInfo.push({
            text: 'New',
            cssClass: 'mediaInfoProgramAttribute newTvProgram'
        });
    } else if (program?.IsSeries
        && program?.IsRepeat
        && userSettings.get('guide-indicator-repeat', false) === 'true') {
        miscInfo.push({
            text: 'Repeat',
            cssClass: 'mediaInfoProgramAttribute repeatTvProgram'
        });
    }
}

export function addProgramIndicators(
    miscInfo: MiscInfo[],
    item: BaseItemDto,
    isYearEnabled: boolean,
    isEpisodeTitleEnabled: boolean,
    isOriginalAirDateEnabled: boolean,
    isProgramIndicatorEnabled: boolean,
    isEpisodeTitleIndexNumberEnabled: boolean
): void {
    let program: BaseItemDto | undefined = item;
    if ((item as TimerInfoDto).Type === 'Timer') { // this is TimerInfoDto
        program = (item as TimerInfoDto).ProgramInfo;
    }

    if (isProgramIndicatorEnabled !== false) {
        addProgramIsLiveIsPremiereIsSeriesOrIsRepeatInfo(program, miscInfo);
    }

    if (
        (program?.IsSeries || program?.EpisodeTitle)
        && isEpisodeTitleEnabled !== false
    ) {
        const text = itemHelper.getDisplayName(program, {
            includeIndexNumber: isEpisodeTitleIndexNumberEnabled
        });

        if (text) {
            miscInfo.push({
                text: escapeHTML(text)
            });
        }
    } else if (
        program?.ProductionYear
        && ((program?.IsMovie && isOriginalAirDateEnabled !== false)
            || isYearEnabled !== false)
    ) {
        miscInfo.push({
            text: program.ProductionYear
        });
    } else if (program?.PremiereDate && isOriginalAirDateEnabled !== false) {
        try {
            const date = datetime.parseISO8601Date(program.PremiereDate);
            const text = globalize.translate(
                'OriginalAirDateValue',
                datetime.toLocaleDateString(date)
            );
            miscInfo.push({
                text: text
            });
        } catch (e) {
            console.error('error parsing date:', program.PremiereDate);
        }
    }
}

export function addStartDateInfo(
    miscInfo: MiscInfo[],
    item: BaseItemDto
): void {
    try {
        const date = datetime.parseISO8601Date(item.StartDate);

        miscInfo.push({
            text: datetime.toLocaleDateString(date)
        });

        if (item.Type !== BaseItemKind.Recording) {
            miscInfo.push({
                text: datetime.getDisplayTime(date)
            });
        }
    } catch (e) {
        console.error('error parsing date:', item.StartDate);
    }
}

export function addSeriesProductionYearInfo(
    miscInfo: MiscInfo[],
    item: BaseItemDto
): void {
    let text;
    if (item.Status === 'Continuing') {
        miscInfo.push({
            text: globalize.translate(
                'SeriesYearToPresent',
                datetime.toLocaleString(item.ProductionYear, {
                    useGrouping: false
                })
            )
        });
    } else if (item.ProductionYear) {
        text = datetime.toLocaleString(item.ProductionYear, {
            useGrouping: false
        });

        if (item.EndDate) {
            try {
                const endYear = datetime.toLocaleString(
                    datetime.parseISO8601Date(item.EndDate).getFullYear(),
                    { useGrouping: false }
                );

                if (endYear !== item.ProductionYear) {
                    text += `-${endYear}`;
                }
            } catch (e) {
                console.error('error parsing date:', item.EndDate);
            }
        }

        miscInfo.push({
            text: text
        });
    }
}

export function addYearInfo(miscInfo: MiscInfo[], item: BaseItemDto): void {
    if (item.ProductionYear) {
        miscInfo.push({
            text: item.ProductionYear
        });
    } else if (item.PremiereDate) {
        try {
            const text = datetime.toLocaleString(
                datetime.parseISO8601Date(item.PremiereDate).getFullYear(),
                { useGrouping: false }
            );
            miscInfo.push({
                text: text
            });
        } catch (e) {
            console.error('error parsing date:', item.PremiereDate);
        }
    }
}

export function addRunTimeInfo(
    miscInfo: MiscInfo[],
    Type: BaseItemKind | undefined,
    RunTimeTicks: number
): void {
    if (Type === BaseItemKind.Audio) {
        miscInfo.push({
            text: datetime.getDisplayRunningTime(RunTimeTicks)
        });
    } else {
        miscInfo.push({
            text: datetime.getDisplayDuration(RunTimeTicks)
        });
    }
}
