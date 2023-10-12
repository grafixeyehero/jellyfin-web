import { BaseItemKind, type BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import itemHelper from 'components/itemHelper';
import datetime from 'scripts/datetime';
import ListTextWrapper from './ListTextWrapper';
import { ListOptions } from 'types/listOptions';

interface ListTextProps {
    item: BaseItemDto;
    listOptions?: ListOptions;
    isLargeStyle?: boolean;
}

const ListText: FC<ListTextProps> = ({
    item = {},
    listOptions = {},
    isLargeStyle
}) => {
    const {
        showProgramDateTime,
        showProgramTime,
        showChannel,
        showParentTitle,
        showIndexNumber,
        parentTitleWithTitle,
        artist
    } = listOptions;
    const textlines: string[] = [];

    const addTextLine = (text: string | null) => {
        if (text) {
            textlines.push(text);
        }
    };

    const addProgramDateTime = () => {
        if (showProgramDateTime) {
            const programDateTime = datetime.toLocaleString(
                datetime.parseISO8601Date(item.StartDate),
                {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                }
            );
            addTextLine(programDateTime);
        }
    };

    const addProgramTime = () => {
        if (showProgramTime) {
            const programTime = datetime.getDisplayTime(
                datetime.parseISO8601Date(item.StartDate)
            );
            addTextLine(programTime);
        }
    };

    const addChannel = () => {
        if (showChannel && item.ChannelName) {
            addTextLine(item.ChannelName);
        }
    };

    let parentTitle: string | null | undefined = null;
    if (showParentTitle) {
        if (item.Type === BaseItemKind.Episode) {
            parentTitle = item.SeriesName;
        } else if (item.IsSeries || (item.EpisodeTitle && item.Name)) {
            parentTitle = item.Name;
        }
    }

    let displayName = itemHelper.getDisplayName(item, {
        includeParentInfo: listOptions.includeParentInfoInTitle
    });

    if (showIndexNumber && item.IndexNumber != null) {
        displayName = `${item.IndexNumber}. ${displayName}`;
    }
    const addParentTitle = () => {
        if (showParentTitle && parentTitleWithTitle) {
            if (displayName) {
                if (parentTitle) {
                    parentTitle += ' - ';
                }
                parentTitle = (parentTitle ?? '') + displayName;
            }
            addTextLine(parentTitle ?? '');
        } else if (showParentTitle) {
            addTextLine(parentTitle ?? '');
        }
    };

    const addDisplayName = () => {
        if (displayName && !parentTitleWithTitle) {
            addTextLine(displayName);
        }
    };

    const addArtist = () => {
        if (item.IsFolder && artist !== false) {
            if (item.AlbumArtist && item.Type === BaseItemKind.MusicAlbum) {
                addTextLine(item.AlbumArtist);
            }
        } else if (artist) {
            const artistItems = item.ArtistItems;
            if (artistItems && item.Type !== BaseItemKind.MusicAlbum) {
                const artists = artistItems.map((a) => a.Name).join(', ');
                addTextLine(artists);
            }
        }
    };

    const addCurrentProgram = () => {
        if (item.Type === BaseItemKind.TvChannel && item.CurrentProgram) {
            const currentProgram = itemHelper.getDisplayName(
                item.CurrentProgram
            );
            addTextLine(currentProgram);
        }
    };

    addProgramDateTime();
    addProgramTime();
    addChannel();
    addParentTitle();
    addDisplayName();
    addArtist();
    addCurrentProgram();

    return (
        <>
            {textlines?.map((text, index) => {
                return (
                    <ListTextWrapper
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        index={index}
                        isLargeStyle={isLargeStyle}
                    >
                        <bdi>{text}</bdi>
                    </ListTextWrapper>
                );
            })}
        </>
    );
};

export default ListText;
