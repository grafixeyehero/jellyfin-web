import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ItemSortBy } from '@jellyfin/sdk/lib/models/api/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import React, { FC } from 'react';
import * as userSettings from '../../scripts/settings/userSettings';
import SuggestionsSectionContainer from './SuggestionsSectionContainer';

function getSuggestionsSections() {
    return [
        {
            name: 'HeaderContinueWatching',
            viewType: 'resumeItems',
            type: 'Movie',
            id: 'suggestionContinueWatchingMovies',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Movie]
            },
            cardOptions: {
                scalable: true,
                overlayPlayButton: true,
                showTitle: true,
                centerText: true,
                cardLayout: false,
                preferThumb: true,
                shape: 'overflowBackdrop',
                showYear: true
            }
        },
        {
            name: 'HeaderLatestMovies',
            viewType: 'latestMedia',
            type: 'Movie',
            id: 'suggestionLatestMovies',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Movie]
            },
            cardOptions: {
                scalable: true,
                overlayPlayButton: true,
                showTitle: true,
                centerText: true,
                cardLayout: false,
                shape: 'overflowPortrait',
                showYear: true
            }
        },
        {
            name: 'HeaderContinueWatching',
            viewType: 'resumeItems',
            type: 'Episode',
            id: 'suggestionContinueWatchingEpisode',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Episode]
            },
            cardOptions: {
                scalable: true,
                overlayPlayButton: true,
                showTitle: true,
                centerText: true,
                cardLayout: false,
                shape: 'overflowBackdrop',
                preferThumb: true,
                inheritThumb:
                    !userSettings.useEpisodeImagesInNextUpAndResume(undefined),
                showYear: true
            }
        },
        {
            name: 'HeaderLatestEpisodes',
            viewType: 'latestMedia',
            type: 'Episode',
            id: 'suggestionLatestEpisode',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Episode]
            },
            cardOptions: {
                scalable: true,
                overlayPlayButton: true,
                showTitle: true,
                centerText: true,
                cardLayout: false,
                shape: 'overflowBackdrop',
                preferThumb: true,
                showSeriesYear: true,
                showParentTitle: true,
                overlayText: false,
                showUnplayedIndicator: false,
                showChildCountIndicator: true,
                lazy: true,
                lines: 2
            }
        },
        {
            name: 'NextUp',
            viewType: 'nextUp',
            type: 'nextup',
            id: 'suggestionNextUp',
            cardOptions: {
                scalable: true,
                overlayPlayButton: true,
                showTitle: true,
                centerText: true,
                cardLayout: false,
                shape: 'overflowBackdrop',
                preferThumb: true,
                inheritThumb:
                    !userSettings.useEpisodeImagesInNextUpAndResume(undefined),
                showParentTitle: true,
                overlayText: false
            }
        },
        {
            name: 'HeaderLatestMusic',
            viewType: 'latestMedia',
            type: 'Audio',
            id: 'suggestionLatestMusic',
            parametersOptions: {
                includeItemTypes: [BaseItemKind.Audio]
            },
            cardOptions: {
                showUnplayedIndicator: false,
                shape: 'overflowSquare',
                showTitle: true,
                showParentTitle: true,
                lazy: true,
                centerText: true,
                overlayPlayButton: true,
                cardLayout: false,
                coverImage: true
            }
        },
        {
            name: 'HeaderRecentlyPlayed',
            type: 'Audio',
            id: 'suggestionRecentlyPlayed',
            parametersOptions: {
                sortBy: [ItemSortBy.DatePlayed],
                sortOrder: [SortOrder.Descending],
                includeItemTypes: [BaseItemKind.Audio]
            },
            cardOptions: {
                showUnplayedIndicator: false,
                shape: 'overflowSquare',
                showTitle: true,
                showParentTitle: true,
                action: 'instantmix',
                lazy: true,
                centerText: true,
                overlayMoreButton: true,
                cardLayout: false,
                coverImage: true
            }
        },
        {
            name: 'HeaderFrequentlyPlayed',
            type: 'Audio',
            id: 'suggestionFrequentlyPlayed',
            parametersOptions: {
                sortBy: [ItemSortBy.PlayCount],
                sortOrder: [SortOrder.Descending],
                includeItemTypes: [BaseItemKind.Audio]
            },
            cardOptions: {
                showUnplayedIndicator: false,
                shape: 'overflowSquare',
                showTitle: true,
                showParentTitle: true,
                action: 'instantmix',
                lazy: true,
                centerText: true,
                overlayMoreButton: true,
                cardLayout: false,
                coverImage: true
            }
        }
    ];
}

interface SuggestionsItemsContainerProps {
    topParentId?: string | null;
    visibleId: string[];
}

const SuggestionsItemsContainer: FC<SuggestionsItemsContainerProps> = ({
    topParentId,
    visibleId
}) => {
    const suggestionsSections = getSuggestionsSections();

    return (
        <>
            {suggestionsSections
                .filter((section) => visibleId.indexOf(section.id) !== -1)
                .map((section) => (
                    <SuggestionsSectionContainer
                        key={section.id}
                        topParentId={topParentId}
                        section={section}
                    />
                ))}
        </>
    );
};

export default SuggestionsItemsContainer;
