import { BaseItemDto, BaseItemKind, SeriesTimerInfoDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import classNames from 'classnames';
import { Box } from '@mui/material';
import {
    addFolderRuntimeInfo,
    addOriginalAirDateInfo,
    addPhotoAlbumOrBoxSetInfo,
    addProgramIndicators,
    addRunTimeInfo,
    addSeriesProductionYearInfo,
    addSeriesTimerInfo,
    addStartDateInfo,
    addYearInfo,
    isProgramOrTimer,
    isSeriesTimer,
    shouldShowContainer,
    shouldShowCriticRating,
    shouldShowFolderRuntime,
    shouldShowOfficialRating,
    shouldShowOriginalAirDate,
    shouldShowPhotoAlbumOrBoxSet,
    shouldShowRunTime,
    shouldShowSeriesProductionYear,
    shouldShowSize,
    shouldShowStartDate,
    shouldShowYear
} from './primaryMediaInfoUtils';
import MediaInfoItem from './MediaInfoItem';
import StarIcons from './StarIcons';
import CaptionMediaInfo from './CaptionMediaInfo';
import CriticRatingMediaInfo from './CriticRatingMediaInfo';
import MissingIndicator from '../indicators/MissingIndicator';
import EndsAt from './EndsAt';
import { MiscInfo } from 'types/mediaInfoItem';

interface PrimaryMediaInfoProps {
    className?: string;
    item: BaseItemDto;
    isYearEnabled?: boolean;
    isContainerEnabled?: boolean;
    isEpisodeTitleEnabled?: boolean;
    isCriticRatingEnabled?: boolean;
    isEndsAtEnabled?: boolean;
    isOriginalAirDateEnabled?: boolean;
    isRuntimeEnabled?: boolean;
    isProgramIndicatorEnabled?: boolean;
    isEpisodeTitleIndexNumberEnabled?: boolean;
    isOfficialRatingEnabled?: boolean;
    isStarRatingEnabled?: boolean;
    isCaptionIndicatorEnabled?: boolean;
    isInteractiveEnabled?: boolean;
    isMissingIndicatorEnabled?: boolean;
}

const PrimaryMediaInfo: FC<PrimaryMediaInfoProps> = ({
    className,
    item,
    isYearEnabled = false,
    isContainerEnabled = false,
    isEpisodeTitleEnabled = false,
    isCriticRatingEnabled = false,
    isEndsAtEnabled = false,
    isOriginalAirDateEnabled = false,
    isRuntimeEnabled = false,
    isProgramIndicatorEnabled = false,
    isEpisodeTitleIndexNumberEnabled = false,
    isOfficialRatingEnabled = false,
    isStarRatingEnabled = false,
    isCaptionIndicatorEnabled = false,
    isMissingIndicatorEnabled = false
}) => {
    const {
        StartDate,
        LocationType,
        HasSubtitles,
        Type,
        Width,
        Height,
        MediaType,
        SongCount,
        ChildCount,
        RunTimeTicks,
        PremiereDate,
        CommunityRating,
        OfficialRating,
        CriticRating,
        Container
    } = item;

    const miscInfo: MiscInfo[] = [];
    const showFolderRuntime = shouldShowFolderRuntime(Type, MediaType);

    if (showFolderRuntime) {
        addFolderRuntimeInfo(miscInfo, SongCount, ChildCount, RunTimeTicks);
    } else if (shouldShowPhotoAlbumOrBoxSet(Type)) {
        addPhotoAlbumOrBoxSetInfo(miscInfo, ChildCount);
    }

    if (
        shouldShowOriginalAirDate(
            Type,
            MediaType,
            PremiereDate,
            isOriginalAirDateEnabled
        )
    ) {
        addOriginalAirDateInfo(miscInfo, PremiereDate, Type);
    }

    //this is SeriesTimerInfoDto
    if (isSeriesTimer(item as SeriesTimerInfoDto)) {
        addSeriesTimerInfo(miscInfo, item as SeriesTimerInfoDto);
    }

    if (shouldShowStartDate(item)) {
        addStartDateInfo(miscInfo, item);
    }

    if (shouldShowSeriesProductionYear(item, isYearEnabled)) {
        addSeriesProductionYearInfo(miscInfo, item);
    }

    if (isProgramOrTimer(item)) {
        addProgramIndicators(
            miscInfo,
            item,
            isYearEnabled,
            isEpisodeTitleEnabled,
            isOriginalAirDateEnabled,
            isProgramIndicatorEnabled,
            isEpisodeTitleIndexNumberEnabled
        );
    }

    if (shouldShowYear(item, isYearEnabled)) {
        addYearInfo(miscInfo, item);
    }

    if (
        shouldShowRunTime(item, showFolderRuntime, isRuntimeEnabled)
    ) {
        addRunTimeInfo(miscInfo, Type, Number(RunTimeTicks));
    }

    if (
        shouldShowOfficialRating(Type, OfficialRating, isOfficialRatingEnabled)
    ) {
        miscInfo.push({
            text: String(OfficialRating),
            cssClass: 'mediaInfoOfficialRating'
        });
    }

    if (item.Video3DFormat) {
        miscInfo.push({
            text: '3D'
        });
    }

    if (shouldShowSize(MediaType, Width, Height)) {
        const size = `${Width}x${Height}`;
        miscInfo.push({
            text: size
        });
    }

    if (shouldShowContainer(Type, Container, isContainerEnabled)) {
        miscInfo.push({
            text: String(Container)
        });
    }

    const cssClass = classNames(className);

    return (
        <Box className={cssClass} >
            {miscInfo.map((info, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <MediaInfoItem key={index} miscInfo={info} />
            ))}

            {isStarRatingEnabled && CommunityRating && (
                <StarIcons communityRating={CommunityRating} />
            )}

            {HasSubtitles && isCaptionIndicatorEnabled && (
                <CaptionMediaInfo />
            )}

            {CriticRating
                && shouldShowCriticRating(CriticRating, isCriticRatingEnabled) && (
                <CriticRatingMediaInfo criticRating={CriticRating} />
            )}

            {isEndsAtEnabled
                && MediaType === 'Video'
                && RunTimeTicks
                && !StartDate && <EndsAt runTimeTicks={RunTimeTicks} />}

            {isMissingIndicatorEnabled
                && Type === BaseItemKind.Episode
                && LocationType === 'Virtual' && (
                <MissingIndicator premiereDate={PremiereDate} />
            )}
        </Box>
    );
};

export default PrimaryMediaInfo;
