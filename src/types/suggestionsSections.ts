import { CardOptions } from './cardOptions';
import { ParametersOptions } from './parametersOptions';

export enum SuggestionSectionType {
    ResumeItems = 'resumeItems',
    LatestMedia = 'latestMedia',
    NextUp = 'nextUp',
}

export enum SuggestionSectionView {
    ContinueWatchingMovies = 'continuewatchingmovies',
    LatestMovies = 'latestmovies',
    ContinueWatchingEpisode = 'continuewatchingepisode',
    LatestEpisode = 'latestepisode',
    NextUp = 'nextUp',
    LatestMusic = 'latestmusic',
    RecentlyPlayedMusic = 'recentlyplayedmusic',
    FrequentlyPlayedMusic = 'frequentlyplayedmusic',
}

export interface SuggestionSection {
    name: string;
    view: SuggestionSectionView;
    type: string;
    viewType?: SuggestionSectionType,
    parametersOptions?: ParametersOptions;
    cardOptions: CardOptions;
}
