import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ItemSortBy } from '@jellyfin/sdk/lib/models/api/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import React, { FC } from 'react';
import * as userSettings from 'scripts/settings/userSettings';
import SuggestionsSectionContainer from './SuggestionsSectionContainer';
import { SuggestionSection, SuggestionSectionView, SuggestionSectionType } from 'types/suggestionsSections';
import { ParentId } from 'types/library';

const getSuggestionsSections = (): SuggestionSection[] => {
    return [
        {
            name: 'HeaderContinueWatching',
            viewType: SuggestionSectionType.ResumeItems,
            type: 'Movie',
            view: SuggestionSectionView.ContinueWatchingMovies,
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
            viewType: SuggestionSectionType.LatestMedia,
            type: 'Movie',
            view: SuggestionSectionView.LatestMovies,
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
            viewType: SuggestionSectionType.ResumeItems,
            type: 'Episode',
            view: SuggestionSectionView.ContinueWatchingEpisode,
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
            viewType: SuggestionSectionType.LatestMedia,
            type: 'Episode',
            view: SuggestionSectionView.LatestEpisode,
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
            viewType: SuggestionSectionType.NextUp,
            type: 'nextup',
            view: SuggestionSectionView.NextUp,
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
            viewType: SuggestionSectionType.LatestMedia,
            type: 'Audio',
            view: SuggestionSectionView.LatestMusic,
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
            view: SuggestionSectionView.RecentlyPlayedMusic,
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
            view: SuggestionSectionView.FrequentlyPlayedMusic,
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
};

interface SuggestionsItemsContainerProps {
    parentId: ParentId;
    sectionsViews: SuggestionSectionView[];
}

const SuggestionsItemsContainer: FC<SuggestionsItemsContainerProps> = ({
    parentId,
    sectionsViews
}) => {
    const suggestionsSections = getSuggestionsSections();

    return (
        <>
            {suggestionsSections
                .filter((section) => sectionsViews.includes(section.view))
                .map((section) => (
                    <SuggestionsSectionContainer
                        key={section.view}
                        parentId={parentId}
                        section={section}
                    />
                ))}
        </>
    );
};

export default SuggestionsItemsContainer;
