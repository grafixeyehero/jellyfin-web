import type {
    ChannelsApiGetChannelsRequest,
    ConfigurationApiGetNamedConfigurationRequest,
    DevicesApiGetDevicesRequest,
    ItemsApiGetItemsRequest,
    LibraryApiGetMediaFoldersRequest,
    ParentalRating,
    UserApiCreateUserByNameRequest,
    UserApiDeleteUserRequest,
    UserApiGetUserByIdRequest,
    UserApiGetUsersRequest,
    UserApiUpdateUserConfigurationRequest,
    UserApiUpdateUserEasyPasswordRequest,
    UserApiUpdateUserPasswordRequest,
    UserApiUpdateUserPolicyRequest,
    UserApiUpdateUserRequest
} from '@jellyfin/sdk/lib/generated-client';
import { AxiosRequestConfig } from 'axios';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { LocationType } from '@jellyfin/sdk/lib/generated-client/models/location-type';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { ItemSortBy } from '@jellyfin/sdk/lib/models/api/item-sort-by';
import { getArtistsApi } from '@jellyfin/sdk/lib/utils/api/artists-api';
import { getChannelsApi } from '@jellyfin/sdk/lib/utils/api/channels-api';
import { getConfigurationApi } from '@jellyfin/sdk/lib/utils/api/configuration-api';
import { getDevicesApi } from '@jellyfin/sdk/lib/utils/api/devices-api';
import { getFilterApi } from '@jellyfin/sdk/lib/utils/api/filter-api';
import { getGenresApi } from '@jellyfin/sdk/lib/utils/api/genres-api';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';
import { getLocalizationApi } from '@jellyfin/sdk/lib/utils/api/localization-api';
import { getMoviesApi } from '@jellyfin/sdk/lib/utils/api/movies-api';
import { getPersonsApi } from '@jellyfin/sdk/lib/utils/api/persons-api';
import { getSessionApi } from '@jellyfin/sdk/lib/utils/api/session-api';
import { getStudiosApi } from '@jellyfin/sdk/lib/utils/api/studios-api';
import { getTvShowsApi } from '@jellyfin/sdk/lib/utils/api/tv-shows-api';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api/user-library-api';
import { getUserViewsApi } from '@jellyfin/sdk/lib/utils/api/user-views-api';
import { getSystemApi } from '@jellyfin/sdk/lib/utils/api/system-api';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { JellyfinApiContext, useApi } from './useApi';
import { useLibrarySettings } from './useLibrarySettings';

import { getAlphaPickerQuery, getFiltersQuery, getImageTypesQuery, getIsFavoriteQuery, getItemFieldsQuery, getItemTypesQuery, getLimitQuery, getSortQuery } from 'utils/items';

import { LibraryParametersOptions, LibraryViewSettings } from 'types/library';
import { Sections } from 'types/sections';

type ParentId = string | null | undefined;

const fetchGetItem = async (
    currentApi: JellyfinApiContext,
    itemId: string,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getUserLibraryApi(api).getItem(
            {
                userId: user.Id,
                itemId: itemId
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetItem = (parentId: ParentId) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['Item', parentId],
        queryFn: ({ signal }) => fetchGetItem(currentApi, String(parentId), { signal }),
        enabled: !!parentId
    });
};

const fetchGetItems = async (
    currentApi: JellyfinApiContext,
    parametersOptions: ItemsApiGetItemsRequest,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getItemsApi(api).getItems(
            {
                userId: user.Id,
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetItems = (parametersOptions: ItemsApiGetItemsRequest) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: [
            'Items',
            {
                ...parametersOptions
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetItems(currentApi, parametersOptions, { signal })
    });
};

const fetchGetItemsByViewType = async (
    currentApi: JellyfinApiContext,
    viewType: string,
    parentId: ParentId,
    libraryViewSettings: LibraryViewSettings,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        let response;
        switch (viewType) {
            case 'albumArtists': {
                response = await getArtistsApi(api).getAlbumArtists(
                    {
                        userId: user.Id,
                        parentId: parentId ?? undefined,
                        ...getLimitQuery(),
                        ...getSortQuery(libraryViewSettings),
                        ...getItemFieldsQuery(viewType, libraryViewSettings),
                        ...getImageTypesQuery(libraryViewSettings),
                        ...getFiltersQuery(viewType, libraryViewSettings),
                        ...getItemTypesQuery(viewType),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            case 'artists': {
                response = await getArtistsApi(api).getArtists(
                    {
                        userId: user.Id,
                        parentId: parentId ?? undefined,
                        ...getLimitQuery(),
                        ...getSortQuery(libraryViewSettings),
                        ...getItemFieldsQuery(viewType, libraryViewSettings),
                        ...getImageTypesQuery(libraryViewSettings),
                        ...getFiltersQuery(viewType, libraryViewSettings),
                        ...getItemTypesQuery(viewType),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            case 'studios':
                response = await getStudiosApi(api).getStudios(
                    {
                        userId: user.Id,
                        parentId: parentId ?? undefined,
                        ...getLimitQuery(),
                        ...getSortQuery(libraryViewSettings),
                        ...getItemFieldsQuery(viewType, libraryViewSettings),
                        ...getImageTypesQuery(libraryViewSettings),
                        ...getItemTypesQuery(viewType),
                        startIndex: 0
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            case 'genres': {
                response = await getGenresApi(api).getGenres(
                    {
                        userId: user.Id,
                        enableTotalRecordCount: false,
                        enableImageTypes: [ImageType.Primary],
                        parentId: parentId ?? undefined
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            default: {
                response = await getItemsApi(api).getItems(
                    {
                        userId: user.Id,
                        recursive: true,
                        imageTypeLimit: 1,
                        parentId: parentId ?? undefined,
                        ...getLimitQuery(),
                        ...getIsFavoriteQuery(viewType),
                        ...getSortQuery(libraryViewSettings),
                        ...getItemFieldsQuery(viewType, libraryViewSettings),
                        ...getImageTypesQuery(libraryViewSettings),
                        ...getFiltersQuery(viewType, libraryViewSettings),
                        ...getItemTypesQuery(viewType),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
        }
        return response.data;
    }
};

export const useGetViewItemsByType = (
    viewType: string,
    parentId: ParentId
) => {
    const currentApi = useApi();
    const { libraryViewSettings } = useLibrarySettings();

    return useQuery({
        queryKey: [
            'ViewItemsByType',
            viewType,
            parentId,
            {
                ...libraryViewSettings
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetItemsByViewType(
                currentApi,
                viewType,
                parentId,
                libraryViewSettings,
                { signal }
            ),
        refetchOnWindowFocus: false,
        enabled:
            [
                'movies',
                'favorites',
                'collections',
                'trailers',
                'genres',
                'series',
                'episodes',
                'studios',
                'albums',
                'albumArtists',
                'artists',
                'playlist',
                'songs',
                'books',
                'photos',
                'videos'
            ].includes(String(viewType)) && !!parentId
    });
};

const fetchGetQueryFiltersLegacy = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    itemType: BaseItemKind[],
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getFilterApi(api).getQueryFiltersLegacy(
            {
                userId: user.Id,
                parentId: parentId ?? undefined,
                includeItemTypes: itemType
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetQueryFiltersLegacy = (
    parentId: ParentId,
    itemType: BaseItemKind[]
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['QueryFiltersLegacy', parentId, itemType],
        queryFn: ({ signal }) =>
            fetchGetQueryFiltersLegacy(currentApi, parentId, itemType, {
                signal
            }),
        enabled: !!parentId && !!itemType
    });
};

const fetchGetQueryFilters = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getFilterApi(api).getQueryFilters(
            {
                userId: user.Id,
                parentId: parentId ?? undefined
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetQueryFilters = (parentId: ParentId) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['QueryFilters', parentId],
        queryFn: ({ signal }) =>
            fetchGetQueryFilters(currentApi, parentId, { signal }),
        enabled: !!parentId
    });
};

const fetchGetGenres = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    itemType: BaseItemKind[],
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getGenresApi(api).getGenres(
            {
                userId: user.Id,
                sortBy: [ItemSortBy.SortName],
                sortOrder: [SortOrder.Ascending],
                includeItemTypes: itemType,
                enableTotalRecordCount: false,
                parentId: parentId ?? undefined
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetGenres = (parentId: ParentId, itemType: BaseItemKind[]) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['Genres', parentId],
        queryFn: ({ signal }) =>
            fetchGetGenres(currentApi, parentId, itemType, { signal }),
        enabled: !!parentId
    });
};

const fetchGetStudios = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    itemType: BaseItemKind[],
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getStudiosApi(api).getStudios(
            {
                userId: user.Id,
                includeItemTypes: itemType,
                fields: [
                    ItemFields.DateCreated,
                    ItemFields.PrimaryImageAspectRatio
                ],
                enableImageTypes: [ImageType.Thumb],
                parentId: parentId ?? undefined,
                enableTotalRecordCount: false
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetStudios = (parentId: ParentId, itemType: BaseItemKind[]) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['Studios', parentId, itemType],
        queryFn: ({ signal }) =>
            fetchGetStudios(currentApi, parentId, itemType, { signal }),
        enabled: !!parentId && !!itemType
    });
};

const fetchGetMovieRecommendations = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getMoviesApi(api).getMovieRecommendations(
            {
                userId: user.Id,
                fields: [
                    ItemFields.PrimaryImageAspectRatio,
                    ItemFields.MediaSourceCount,
                    ItemFields.BasicSyncInfo
                ],
                parentId: parentId ?? undefined,
                categoryLimit: 6,
                itemLimit: 20
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetMovieRecommendations = (parentId: ParentId) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['MovieRecommendations', parentId],
        queryFn: ({ signal }) =>
            fetchGetMovieRecommendations(currentApi, parentId, { signal }),
        enabled: !!parentId
    });
};

const fetchGetUpcomingEpisodes = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getTvShowsApi(api).getUpcomingEpisodes(
            {
                userId: user.Id,
                limit: 25,
                fields: [ItemFields.AirTime],
                parentId: parentId ?? undefined,
                imageTypeLimit: 1,
                enableImageTypes: [
                    ImageType.Primary,
                    ImageType.Backdrop,
                    ImageType.Thumb
                ]
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetUpcomingEpisodes = (parentId: ParentId, enableFetch: boolean) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['UpcomingEpisodes', parentId],
        queryFn: ({ signal }) =>
            fetchGetUpcomingEpisodes(currentApi, parentId, { signal }),
        enabled: enableFetch
    });
};

const fetchGetItemsBySuggestionsType = async (
    currentApi: JellyfinApiContext,
    viewType: string | undefined,
    parentId: ParentId,
    parametersOptions: LibraryParametersOptions | undefined,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        let response;
        switch (viewType) {
            case 'nextUp': {
                response = (
                    await getTvShowsApi(api).getNextUp(
                        {
                            userId: user.Id,
                            limit: 25,
                            fields: [
                                ItemFields.PrimaryImageAspectRatio,
                                ItemFields.MediaSourceCount,
                                ItemFields.BasicSyncInfo
                            ],
                            parentId: parentId ?? undefined,
                            imageTypeLimit: 1,
                            enableImageTypes: [
                                ImageType.Primary,
                                ImageType.Backdrop,
                                ImageType.Thumb
                            ],
                            enableTotalRecordCount: false,
                            ...parametersOptions
                        },
                        {
                            signal: options?.signal
                        }
                    )
                ).data.Items;
                break;
            }
            case 'resumeItems': {
                response = (
                    await getItemsApi(api).getResumeItems(
                        {
                            userId: user?.Id,
                            parentId: parentId ?? undefined,
                            fields: [
                                ItemFields.PrimaryImageAspectRatio,
                                ItemFields.MediaSourceCount,
                                ItemFields.BasicSyncInfo
                            ],
                            imageTypeLimit: 1,
                            enableImageTypes: [ImageType.Thumb],
                            enableTotalRecordCount: false,
                            ...parametersOptions
                        },
                        {
                            signal: options?.signal
                        }
                    )
                ).data.Items;
                break;
            }
            case 'latestMedia': {
                response = (
                    await getUserLibraryApi(api).getLatestMedia(
                        {
                            userId: user.Id,
                            fields: [
                                ItemFields.PrimaryImageAspectRatio,
                                ItemFields.MediaSourceCount,
                                ItemFields.BasicSyncInfo
                            ],
                            parentId: parentId ?? undefined,
                            imageTypeLimit: 1,
                            enableImageTypes: [ImageType.Primary],
                            ...parametersOptions
                        },
                        {
                            signal: options?.signal
                        }
                    )
                ).data;
                break;
            }
            default: {
                response = (
                    await getItemsApi(api).getItems(
                        {
                            userId: user.Id,
                            parentId: parentId ?? undefined,
                            recursive: true,
                            fields: [ItemFields.PrimaryImageAspectRatio],
                            filters: [ItemFilter.IsPlayed],
                            imageTypeLimit: 1,
                            enableImageTypes: [
                                ImageType.Primary,
                                ImageType.Backdrop,
                                ImageType.Thumb
                            ],
                            limit: 25,
                            enableTotalRecordCount: false,
                            ...parametersOptions
                        },
                        {
                            signal: options?.signal
                        }
                    )
                ).data.Items;
                break;
            }
        }
        return response;
    }
};

export const useGetItemsBySectionType = (
    sections: Sections,
    parentId: ParentId
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['ItemsBySuggestionsType', sections.id],
        queryFn: ({ signal }) =>
            fetchGetItemsBySuggestionsType(
                currentApi,
                sections.viewType,
                parentId,
                sections.parametersOptions,
                { signal }
            ),
        enabled: !!sections.id
    });
};

const fetchGetItemsByFavoriteType = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    sections: Sections,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        let response;
        switch (sections.viewType) {
            case 'artists': {
                response = (
                    await getArtistsApi(api).getArtists(
                        {
                            userId: user.Id,
                            parentId: parentId ?? undefined,
                            sortBy: [ItemSortBy.SortName],
                            sortOrder: [SortOrder.Ascending],
                            fields: [
                                ItemFields.PrimaryImageAspectRatio,
                                ItemFields.BasicSyncInfo
                            ],
                            filters: [ItemFilter.IsFavorite],
                            collapseBoxSetItems: false,
                            limit: 25,
                            enableTotalRecordCount: false,
                            ...sections.parametersOptions
                        },
                        {
                            signal: options?.signal
                        }
                    )
                ).data.Items;
                break;
            }
            case 'persons': {
                response = (
                    await getPersonsApi(api).getPersons(
                        {
                            userId: user.Id,
                            sortBy: [ItemSortBy.SortName],
                            sortOrder: [SortOrder.Ascending],
                            fields: [
                                ItemFields.PrimaryImageAspectRatio,
                                ItemFields.BasicSyncInfo
                            ],
                            filters: [ItemFilter.IsFavorite],
                            collapseBoxSetItems: false,
                            limit: 25,
                            enableTotalRecordCount: false,
                            ...sections.parametersOptions
                        },
                        {
                            signal: options?.signal
                        }
                    )
                ).data.Items;
                break;
            }
            default: {
                response = (
                    await getItemsApi(api).getItems(
                        {
                            userId: user.Id,
                            parentId: parentId ?? undefined,
                            sortBy: [ItemSortBy.SortName],
                            sortOrder: [SortOrder.Ascending],
                            fields: [
                                ItemFields.PrimaryImageAspectRatio,
                                ItemFields.BasicSyncInfo
                            ],
                            filters: [ItemFilter.IsFavorite],
                            collapseBoxSetItems: false,
                            limit: 25,
                            enableTotalRecordCount: false,
                            recursive: true,
                            excludeLocationTypes: [LocationType.Virtual],
                            ...sections.parametersOptions
                        },
                        {
                            signal: options?.signal
                        }
                    )
                ).data.Items;
                break;
            }
        }
        return response;
    }
};

export const useGetItemsByFavoriteType = (
    sections: Sections,
    parentId: ParentId
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['ItemsByFavoriteType', sections.id],
        queryFn: ({ signal }) =>
            fetchGetItemsByFavoriteType(
                currentApi,
                parentId,
                sections,
                { signal }
            ),
        enabled: !!sections.id
    });
};

const fetchGetUsers = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiGetUsersRequest,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).getUsers(
            {
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetUsers = (parametersOptions: UserApiGetUsersRequest) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['Users'],
        queryFn: ({ signal }) =>
            fetchGetUsers(currentApi, parametersOptions, { signal })
    });
};

const fetchGetUserById = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiGetUserByIdRequest,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).getUserById(
            {
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetUserById = (
    parametersOptions: UserApiGetUserByIdRequest
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: [
            'UserById',
            {
                ...parametersOptions
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetUserById(currentApi, parametersOptions, { signal }),
        enabled: Boolean(parametersOptions?.userId)
    });
};

const fetchGetAuthProviders = async (
    currentApi: JellyfinApiContext,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getSessionApi(api).getAuthProviders({
            signal: options?.signal
        });
        return response.data;
    }
};

export const useGetAuthProviders = () => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['AuthProviders'],
        queryFn: ({ signal }) => fetchGetAuthProviders(currentApi, { signal })
    });
};

const fetchGetPasswordResetProviders = async (
    currentApi: JellyfinApiContext,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getSessionApi(api).getPasswordResetProviders({
            signal: options?.signal
        });
        return response.data;
    }
};

export const useGetPasswordResetProviders = () => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['PasswordResetProviders'],
        queryFn: ({ signal }) =>
            fetchGetPasswordResetProviders(currentApi, { signal })
    });
};

const fetchGetMediaFolders = async (
    currentApi: JellyfinApiContext,
    parametersOptions: LibraryApiGetMediaFoldersRequest,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getLibraryApi(api).getMediaFolders(
            {
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data.Items || [];
    }
};

export const useGetMediaFolders = (
    parametersOptions: LibraryApiGetMediaFoldersRequest
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['MediaFolders', parametersOptions.isHidden],
        queryFn: ({ signal }) =>
            fetchGetMediaFolders(currentApi, parametersOptions, { signal })
    });
};

const fetchGetChannels = async (
    currentApi: JellyfinApiContext,
    parametersOptions?: ChannelsApiGetChannelsRequest,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getChannelsApi(api).getChannels(
            {
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data.Items ?? [];
    }
};

export const useGetChannels = (
    parametersOptions?: ChannelsApiGetChannelsRequest
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: [
            'Channels',
            {
                ...parametersOptions
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetChannels(currentApi, parametersOptions, { signal })
    });
};

const fetchGetDevices = async (
    currentApi: JellyfinApiContext,
    parametersOptions: DevicesApiGetDevicesRequest,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getDevicesApi(api).getDevices(
            {
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data.Items ?? [];
    }
};

export const useGetDevices = (
    parametersOptions: DevicesApiGetDevicesRequest
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: [
            'Devices',
            {
                ...parametersOptions
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetDevices(currentApi, parametersOptions, { signal }),
        enabled: !!parametersOptions.userId
    });
};

const fetchGetNamedConfiguration = async (
    currentApi: JellyfinApiContext,
    parametersOptions: ConfigurationApiGetNamedConfigurationRequest,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getConfigurationApi(api).getNamedConfiguration(
            {
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetNamedConfiguration = (
    parametersOptions: ConfigurationApiGetNamedConfigurationRequest
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: [
            'NamedConfiguration',
            {
                ...parametersOptions
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetNamedConfiguration(currentApi, parametersOptions, {
                signal
            }),
        enabled: !!parametersOptions.key
    });
};

const fetchGetParentalRatings = async (
    currentApi: JellyfinApiContext,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getLocalizationApi(api).getParentalRatings({
            signal: options?.signal
        });
        return response.data;
    }
};

export const useGetParentalRatings = () => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['ParentalRatings'],
        queryFn: ({ signal }) =>
            fetchGetParentalRatings(currentApi, { signal }),
        select: (data) => {
            let rating;
            const ratings: ParentalRating[] = [];

            for (const parentalRating of data ?? []) {
                rating = parentalRating;
                if (ratings.length) {
                    const lastRating = ratings[ratings.length - 1];

                    if (lastRating.Value === rating.Value) {
                        lastRating.Name += '/' + rating.Name;
                        continue;
                    }
                }

                ratings.push({
                    Name: rating.Name,
                    Value: rating.Value
                });
            }
            return ratings;
        }
    });
};

const fetchUpdateUser = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiUpdateUserRequest
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).updateUser({
            ...parametersOptions
        });
        return response.data;
    }
};

export const useUpdateUser = () => {
    const currentApi = useApi();
    return useMutation({
        mutationFn: (parametersOptions: UserApiUpdateUserRequest) =>
            fetchUpdateUser(currentApi, parametersOptions)
    });
};

const fetchUpdateUserPolicy = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiUpdateUserPolicyRequest
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).updateUserPolicy({
            ...parametersOptions
        });

        return response.data;
    }
};

export const useUpdateUserPolicy = () => {
    const currentApi = useApi();
    return useMutation({
        mutationFn: (parametersOptions: UserApiUpdateUserPolicyRequest) =>
            fetchUpdateUserPolicy(currentApi, parametersOptions)
    });
};

const fetchDeleteUser = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiDeleteUserRequest
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).deleteUser({
            ...parametersOptions
        });
        return response.data;
    }
};

export const useDeleteUser = () => {
    const currentApi = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (parametersOptions: UserApiDeleteUserRequest) =>
            fetchDeleteUser(currentApi, parametersOptions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Users'] }).catch(err => {
                console.error('[Users] failed to fetch Users', err);
            });
        }
    });
};

const fetchUpdateUserPassword = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiUpdateUserPasswordRequest
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).updateUserPassword({
            ...parametersOptions
        });
        return response.data;
    }
};

export const useUpdateUserPassword = () => {
    const currentApi = useApi();
    return useMutation({
        mutationFn: (parametersOptions: UserApiUpdateUserPasswordRequest) =>
            fetchUpdateUserPassword(currentApi, parametersOptions)
    });
};

const fetchUpdateUserEasyPassword = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiUpdateUserEasyPasswordRequest
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).updateUserEasyPassword({
            ...parametersOptions
        });
        return response.data;
    }
};

export const useUpdateUserEasyPassword = () => {
    const currentApi = useApi();
    return useMutation({
        mutationFn: (parametersOptions: UserApiUpdateUserEasyPasswordRequest) =>
            fetchUpdateUserEasyPassword(currentApi, parametersOptions)
    });
};

const fetchUpdateUserConfiguration = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiUpdateUserConfigurationRequest
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).updateUserConfiguration({
            ...parametersOptions
        });
        return response.data;
    }
};

export const useUpdateUserConfiguration = () => {
    const currentApi = useApi();
    return useMutation({
        mutationFn: (
            parametersOptions: UserApiUpdateUserConfigurationRequest
        ) => fetchUpdateUserConfiguration(currentApi, parametersOptions)
    });
};

const fetchCreateUserByName = async (
    currentApi: JellyfinApiContext,
    parametersOptions: UserApiCreateUserByNameRequest
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).createUserByName({
            ...parametersOptions
        });
        return response.data;
    }
};

export const useCreateUserByName = () => {
    const currentApi = useApi();
    return useMutation({
        mutationFn: (parametersOptions: UserApiCreateUserByNameRequest) =>
            fetchCreateUserByName(currentApi, parametersOptions)
    });
};

const fetchGetCurrentUser = async (
    currentApi: JellyfinApiContext,
    options?: AxiosRequestConfig
) => {
    const { api } = currentApi;
    if (api) {
        const response = await getUserApi(api).getCurrentUser({
            signal: options?.signal
        });
        return response.data;
    }
};

export const useGetCurrentUser = () => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['getCurrentUser'],
        queryFn: ({ signal }) => fetchGetCurrentUser(currentApi, { signal })
    });
};

const fetchUserViews = async (
    currentApi: JellyfinApiContext
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getUserViewsApi(api).getUserViews({
            userId: user.Id
        });
        return response.data.Items;
    }
};

export const useUserViews = () => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['UserViews'],
        queryFn: () => fetchUserViews(currentApi)
    });
};

const fetchSystemInfo = async (
    currentApi: JellyfinApiContext
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getSystemApi(api).getSystemInfo();
        return response.data;
    }
};

export const useSystemInfo = () => {
    const currentApi = useApi();
    return useQuery({
        queryKey: ['SystemInfo'],
        queryFn: () => fetchSystemInfo(currentApi)
    });
};

