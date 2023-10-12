import type {
    LibraryUpdateInfo,
    SeriesTimerInfoDto,
    TimerInfoDto,
    UserItemDataDto
} from '@jellyfin/sdk/lib/generated-client';
import { ApiClient, Event as EventObject } from 'jellyfin-apiclient';
import { getPlaylistsApi } from '@jellyfin/sdk/lib/utils/api/playlists-api';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Box } from '@mui/material';
import Sortable from 'sortablejs';
import { useApi } from 'hooks/useApi';
import Events from '../../utils/events';
import serverNotifications from '../../scripts/serverNotifications';
import inputManager from '../../scripts/inputManager';
import dom from '../../scripts/dom';
import browser from '../../scripts/browser';
import imageLoader from '../../components/images/imageLoader';
import layoutManager from '../../components/layoutManager';
import { playbackManager } from '../../components/playback/playbackmanager';
import itemShortcuts from '../../components/shortcuts';
import MultiSelect from '../../components/multiSelect/multiSelect';
import loading from '../../components/loading/loading';
import focusManager from '../../components/focusManager';
import { LibraryViewSettings, ParentId, ViewMode } from 'types/library';

function disableEvent(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function getShortcutOptions() {
    return {
        click: false
    };
}

interface ItemsContainerProps {
    className?: string;
    libraryViewSettings: LibraryViewSettings
    isContextMenuEnabled?: boolean;
    isMultiSelectEnabled?: boolean;
    isDragreOrderEnabled?: boolean;
    dataMonitor?: string;
    parentId?: ParentId;
    reloadItems: () => void;
    getItemsHtml: () => string;
    children?: React.ReactNode;
}

const ItemsContainer: FC<ItemsContainerProps> = ({
    className,
    libraryViewSettings,
    isContextMenuEnabled,
    isMultiSelectEnabled,
    isDragreOrderEnabled,
    dataMonitor,
    parentId,
    reloadItems,
    getItemsHtml,
    children
}) => {
    const { api } = useApi();
    const element = useRef<HTMLDivElement>(null);
    const multiSelectref = useRef<MultiSelect | null>(null);
    const sortableref = useRef<Sortable | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onClick = useCallback((e: MouseEvent) => {
        const itemsContainer = element.current as HTMLDivElement;
        const multiSelect = multiSelectref.current;

        if (
            multiSelect
            && multiSelect.onContainerClick.call(itemsContainer, e) === false
        ) {
            return;
        }

        itemShortcuts.onClick.call(itemsContainer, e);
    }, []);

    const onContextMenu = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const card = dom.parentWithAttribute(target, 'data-id');

        // check for serverId, it won't be present on selectserver
        if (card?.getAttribute('data-serverid')) {
            inputManager.handleCommand('menu', {
                sourceElement: card
            });

            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, []);

    const enableMultiSelect = useCallback((enabled: boolean) => {
        const current = multiSelectref.current;

        if (!enabled) {
            if (current) {
                current.destroy();
                multiSelectref.current = null;
            }
            return;
        }

        if (current) {
            return;
        }

        multiSelectref.current = new MultiSelect({
            container: element.current,
            bindOnClick: false
        });
    }, []);

    const onDrop = useCallback(
        async (evt: Sortable.SortableEvent) => {
            const el = evt.item;

            const newIndex = evt.newIndex;
            const itemId = el.getAttribute('data-playlistitemid');
            const playlistId = el.getAttribute('data-playlistid');

            if (!playlistId) {
                const oldIndex = evt.oldIndex;
                el.dispatchEvent(
                    new CustomEvent('itemdrop', {
                        detail: {
                            oldIndex: oldIndex,
                            newIndex: newIndex,
                            playlistItemId: itemId
                        },
                        bubbles: true,
                        cancelable: false
                    })
                );
                return;
            }

            if (!api) throw new Error('No API instance available');
            if (!itemId) throw new Error('null itemId');
            if (!newIndex) throw new Error('null newIndex');

            try {
                loading.show();
                await getPlaylistsApi(api).moveItem({ playlistId, itemId, newIndex });
                loading.hide();
            } catch (error) {
                loading.hide();
                reloadItems();
            }
        },
        [api, reloadItems]
    );

    const enableDragReordering = useCallback(
        (enabled: boolean) => {
            const current = sortableref.current;
            if (!enabled) {
                if (current) {
                    current.destroy();
                    sortableref.current = null;
                }
                return;
            }

            if (current) {
                return;
            }

            const itemsContainer = element.current;

            if (!itemsContainer) {
                console.error('Unexpected null reference');
                return;
            }

            sortableref.current = new Sortable(itemsContainer, {
                draggable: '.listItem',
                handle: '.listViewDragHandle',

                // dragging ended
                onEnd: (evt: Sortable.SortableEvent) => {
                    return onDrop(evt);
                }
            });
        },
        [onDrop]
    );

    const notifyRefreshNeeded = useCallback(
        (isInForeground: boolean) => {
            if (isInForeground === true) {
                reloadItems();
            } else {
                timerRef.current = setTimeout(() => reloadItems(), 10000);
            }
        },
        [reloadItems]
    );

    const getEventsToMonitor = useCallback(() => {
        const monitor = dataMonitor;
        if (monitor) {
            return monitor.split(',');
        }

        return [];
    }, [dataMonitor]);

    const onUserDataChanged = useCallback(
        (_e: EventObject, _apiClient: ApiClient, userData: UserItemDataDto) => {
            const itemsContainer = element.current as HTMLDivElement;

            import('../../components/cardbuilder/cardBuilder')
                .then((cardBuilder) => {
                    cardBuilder.onUserDataChanged(userData, itemsContainer);
                }).catch(err => {
                    console.error('[onUserDataChanged] failed to load onUserData Changed', err);
                });

            const eventsToMonitor = getEventsToMonitor();
            if (
                eventsToMonitor.indexOf('markfavorite') !== -1
                || eventsToMonitor.indexOf('markplayed') !== -1
            ) {
                notifyRefreshNeeded(false);
            }
        },
        [getEventsToMonitor, notifyRefreshNeeded]
    );

    const onTimerCreated = useCallback(
        (_e: EventObject, _apiClient: ApiClient, data: TimerInfoDto) => {
            const itemsContainer = element.current as HTMLDivElement;
            const eventsToMonitor = getEventsToMonitor();
            if (eventsToMonitor.indexOf('timers') !== -1) {
                notifyRefreshNeeded(false);
                return;
            }

            const programId = data.ProgramId;
            // This could be null, not supported by all tv providers
            const newTimerId = data.Id;
            if (programId && newTimerId) {
                import('../../components/cardbuilder/cardBuilder')
                    .then((cardBuilder) => {
                        cardBuilder.onTimerCreated(
                            programId,
                            newTimerId,
                            itemsContainer
                        );
                    }).catch(err => {
                        console.error('[onTimerCreated] failed to load onTimer Created', err);
                    });
            }
        },
        [getEventsToMonitor, notifyRefreshNeeded]
    );

    const onSeriesTimerCreated = useCallback(() => {
        const eventsToMonitor = getEventsToMonitor();
        if (eventsToMonitor.indexOf('seriestimers') !== -1) {
            notifyRefreshNeeded(false);
        }
    }, [getEventsToMonitor, notifyRefreshNeeded]);

    const onTimerCancelled = useCallback(
        (_e: EventObject, _apiClient: ApiClient, data: TimerInfoDto) => {
            const itemsContainer = element.current as HTMLDivElement;
            const eventsToMonitor = getEventsToMonitor();
            if (eventsToMonitor.indexOf('timers') !== -1) {
                notifyRefreshNeeded(false);
                return;
            }

            const timerId = data.Id;

            if (timerId) {
                import('../../components/cardbuilder/cardBuilder')
                    .then((cardBuilder) => {
                        cardBuilder.onTimerCancelled(timerId, itemsContainer);
                    }).catch(err => {
                        console.error('[onTimerCancelled] failed to load onTimer Cancelled', err);
                    });
            }
        },
        [getEventsToMonitor, notifyRefreshNeeded]
    );

    const onSeriesTimerCancelled = useCallback(
        (_e: EventObject, _apiClient: ApiClient, data: SeriesTimerInfoDto) => {
            const itemsContainer = element.current as HTMLDivElement;
            const eventsToMonitor = getEventsToMonitor();
            if (eventsToMonitor.indexOf('seriestimers') !== -1) {
                notifyRefreshNeeded(false);
                return;
            }

            const cancelledTimerId = data.Id;

            if (cancelledTimerId) {
                import('../../components/cardbuilder/cardBuilder')
                    .then((cardBuilder) => {
                        cardBuilder.onSeriesTimerCancelled(cancelledTimerId, itemsContainer);
                    }).catch(err => {
                        console.error('[onSeriesTimerCancelled] failed to load onSeriesTimer Cancelled', err);
                    });
            }
        },
        [getEventsToMonitor, notifyRefreshNeeded]
    );

    const onLibraryChanged = useCallback(
        (_e: EventObject, _apiClient: ApiClient, data: LibraryUpdateInfo) => {
            const eventsToMonitor = getEventsToMonitor();
            if (
                eventsToMonitor.indexOf('seriestimers') !== -1
                || eventsToMonitor.indexOf('timers') !== -1
            ) {
                // yes this is an assumption
                return;
            }

            const itemsAdded = data.ItemsAdded ?? [];
            const itemsRemoved = data.ItemsRemoved ?? [];
            if (!itemsAdded.length && !itemsRemoved.length) {
                return;
            }

            if (parentId) {
                const foldersAddedTo = data.FoldersAddedTo ?? [];
                const foldersRemovedFrom = data.FoldersRemovedFrom ?? [];
                const collectionFolders = data.CollectionFolders ?? [];

                if (
                    foldersAddedTo.indexOf(parentId) === -1
                    && foldersRemovedFrom.indexOf(parentId) === -1
                    && collectionFolders.indexOf(parentId) === -1
                ) {
                    return;
                }
            }

            notifyRefreshNeeded(false);
        },
        [getEventsToMonitor, notifyRefreshNeeded, parentId]
    );

    const onPlaybackStopped = useCallback(
        (_e: EventObject, stopInfo) => {
            const state = stopInfo.state;

            const eventsToMonitor = getEventsToMonitor();
            if (
                state.NowPlayingItem
                && state.NowPlayingItem.MediaType === 'Video'
            ) {
                if (eventsToMonitor.indexOf('videoplayback') !== -1) {
                    notifyRefreshNeeded(true);
                    return;
                }
            } else if (
                state.NowPlayingItem
                && state.NowPlayingItem.MediaType === 'Audio'
                && eventsToMonitor.indexOf('audioplayback') !== -1
            ) {
                notifyRefreshNeeded(true);
                return;
            }
        },
        [getEventsToMonitor, notifyRefreshNeeded]
    );

    const setFocus = useCallback(
        (
            itemsContainer: HTMLDivElement,
            focusId: string | null | undefined
        ) => {
            if (focusId) {
                const newElement = itemsContainer.querySelector(
                    '[data-id="' + focusId + '"]'
                );
                if (newElement) {
                    try {
                        focusManager.focus(newElement);
                        return;
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            focusManager.autoFocus(itemsContainer);
        },
        []
    );

    useEffect(() => {
        const itemsContainer = element.current;

        if (!itemsContainer) {
            console.error('Unexpected null reference');
            return;
        }

        const activeElement = document.activeElement;
        let focusId;
        let hasActiveElement;
        if (itemsContainer?.contains(activeElement)) {
            hasActiveElement = true;
            focusId = activeElement?.getAttribute('data-id');
        }

        itemsContainer.innerHTML = getItemsHtml();

        imageLoader.lazyChildren(itemsContainer);

        if (hasActiveElement) {
            setFocus(itemsContainer, focusId);
        }
    }, [getItemsHtml, setFocus]);

    useEffect(() => {
        const itemsContainer = element.current as HTMLDivElement;

        itemsContainer.addEventListener('click', onClick);

        if (browser.touch) {
            itemsContainer.addEventListener('contextmenu', disableEvent);
        } else if (isContextMenuEnabled !== false) {
            itemsContainer.addEventListener('contextmenu', onContextMenu);
        }

        if (
            layoutManager.desktop
            || (layoutManager.mobile && isMultiSelectEnabled !== false)
        ) {
            enableMultiSelect(true);
        }

        itemShortcuts.on(itemsContainer, getShortcutOptions());

        Events.on(serverNotifications, 'UserDataChanged', onUserDataChanged);
        Events.on(serverNotifications, 'TimerCreated', onTimerCreated);
        Events.on(serverNotifications, 'TimerCancelled', onTimerCancelled);
        Events.on(
            serverNotifications,
            'SeriesTimerCreated',
            onSeriesTimerCreated
        );
        Events.on(
            serverNotifications,
            'SeriesTimerCancelled',
            onSeriesTimerCancelled
        );
        Events.on(serverNotifications, 'LibraryChanged', onLibraryChanged);
        Events.on(playbackManager, 'playbackstop', onPlaybackStopped);

        if (isDragreOrderEnabled === true) {
            enableDragReordering(true);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            enableMultiSelect(false);
            enableDragReordering(false);
            itemsContainer.removeEventListener('click', onClick);
            itemsContainer.removeEventListener('contextmenu', onContextMenu);
            itemsContainer.removeEventListener('contextmenu', disableEvent);

            itemShortcuts.off(itemsContainer, getShortcutOptions());

            Events.off(
                serverNotifications,
                'UserDataChanged',
                onUserDataChanged
            );
            Events.off(serverNotifications, 'TimerCreated', onTimerCreated);
            Events.off(serverNotifications, 'TimerCancelled', onTimerCancelled);
            Events.off(
                serverNotifications,
                'SeriesTimerCreated',
                onSeriesTimerCreated
            );
            Events.off(
                serverNotifications,
                'SeriesTimerCancelled',
                onSeriesTimerCancelled
            );
            Events.off(serverNotifications, 'LibraryChanged', onLibraryChanged);
            Events.off(playbackManager, 'playbackstop', onPlaybackStopped);
        };
    }, [
        enableDragReordering,
        enableMultiSelect,
        isContextMenuEnabled,
        isDragreOrderEnabled,
        isMultiSelectEnabled,
        onClick,
        onContextMenu,
        onLibraryChanged,
        onPlaybackStopped,
        onSeriesTimerCancelled,
        onSeriesTimerCreated,
        onTimerCancelled,
        onTimerCreated,
        onUserDataChanged
    ]);

    const itemsContainerClass = classNames(
        'itemsContainer',
        { 'itemsContainer-tv': layoutManager.tv },
        libraryViewSettings.ViewMode === ViewMode.ListView ? 'vertical-list' : 'vertical-wrap',
        className
    );

    return (
        <Box
            ref={element}
            className={itemsContainerClass}
        >
            {children}
        </Box>
    );
};

export default ItemsContainer;
