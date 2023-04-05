import React, { FC, useCallback } from 'react';

import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

import { useGetViewItemsByType } from '../../hooks/useFetchItems';
import useViewUserSettings from '../../hooks/useViewUserSettings';
import globalize from '../../scripts/globalize';
import * as userSettings from '../../scripts/settings/userSettings';
import { CardOptions, ParametersOptions } from '../../types/interface';
import {
    getFiltersQuery,
    getImageTypesQuery,
    getItemFieldsQuery,
    getSortQuery
} from '../../utils/items';
import cardBuilder from '../cardbuilder/cardBuilder';
import listview from '../listview/listview';
import Loading from '../loading/LoadingComponent';
import AlphaPickerContainer from './AlphaPickerContainer';
import FilterButton from './filter/FilterButton';
import ItemsContainer from './ItemsContainer';
import NewCollectionButton from './NewCollectionButton';
import Pagination from './Pagination';
import PlayAllButton from './PlayAllButton';
import ShuffleButton from './ShuffleButton';
import SortButton from './SortButton';
import ViewSettingsButton from './ViewSettingsButton';

interface ViewItemsContainerProps {
    viewType: string;
    parentId?: string | null;
    context?: string | null;
    isBtnPlayAllEnabled?: boolean;
    isBtnShuffleEnabled?: boolean;
    isBtnSelectViewEnabled?: boolean;
    isBtnSortEnabled?: boolean;
    isBtnFilterEnabled?: boolean;
    isBtnNewCollectionEnabled?: boolean;
    isAlphaPickerEnabled?: boolean;
    itemType: BaseItemKind[];
    noItemsMessage: string;
}

const ViewItemsContainer: FC<ViewItemsContainerProps> = ({
    viewType,
    parentId,
    context,
    isBtnPlayAllEnabled = false,
    isBtnShuffleEnabled = false,
    isBtnSelectViewEnabled = true,
    isBtnSortEnabled = true,
    isBtnFilterEnabled = true,
    isBtnNewCollectionEnabled = false,
    isAlphaPickerEnabled = true,
    itemType,
    noItemsMessage
}) => {
    const [viewUserSettings, setViewUserSettings] = useViewUserSettings(
        viewType,
        parentId
    );

    const getParametersOptions = (): ParametersOptions => {
        return {
            ...getSortQuery(viewUserSettings),
            ...getItemFieldsQuery(viewType, viewUserSettings),
            ...getImageTypesQuery(viewUserSettings),
            ...getFiltersQuery(viewType, viewUserSettings),
            includeItemTypes: itemType,
            limit: userSettings.libraryPageSize(undefined) || undefined,
            isFavorite: viewType === 'favorites' ? true : undefined,
            startIndex: viewUserSettings.StartIndex,
            nameLessThan:
                viewUserSettings.NameLessThan !== null ?
                    viewUserSettings.NameLessThan :
                    undefined,
            nameStartsWith:
                viewUserSettings.NameStartsWith !== null ?
                    viewUserSettings.NameStartsWith :
                    undefined
        };
    };

    const { isLoading, data: itemsResult } = useGetViewItemsByType(
        viewType,
        parentId,
        getParametersOptions()
    );

    const getCardOptions = useCallback(() => {
        let shape;
        let preferThumb;
        let preferDisc;
        let preferLogo;
        let lines = viewUserSettings.showTitle ? 2 : 0;

        if (viewUserSettings.imageType === 'banner') {
            shape = 'banner';
        } else if (viewUserSettings.imageType === 'disc') {
            shape = 'square';
            preferDisc = true;
        } else if (viewUserSettings.imageType === 'logo') {
            shape = 'backdrop';
            preferLogo = true;
        } else if (viewUserSettings.imageType === 'thumb') {
            shape = 'backdrop';
            preferThumb = true;
        } else {
            shape = 'auto';
        }

        const cardOptions: CardOptions = {
            shape: shape,
            showTitle: viewUserSettings.showTitle,
            showYear: viewUserSettings.showYear,
            cardLayout: viewUserSettings.cardLayout,
            centerText: true,
            context: context,
            coverImage: true,
            preferThumb: preferThumb,
            preferDisc: preferDisc,
            preferLogo: preferLogo,
            overlayPlayButton: false,
            overlayMoreButton: true,
            overlayText: !viewUserSettings.showTitle
        };

        if (
            viewType === 'songs'
            || viewType === 'albums'
            || viewType === 'episodes'
        ) {
            cardOptions.showParentTitle = viewUserSettings.showTitle;
        } else if (viewType === 'artists') {
            cardOptions.showYear = false;
            lines = 1;
        }

        cardOptions.lines = lines;
        cardOptions.items = itemsResult?.Items || [];

        return cardOptions;
    }, [
        viewType,
        context,
        itemsResult?.Items,
        viewUserSettings.cardLayout,
        viewUserSettings.imageType,
        viewUserSettings.showTitle,
        viewUserSettings.showYear
    ]);

    const getItemsHtml = useCallback(() => {
        let html = '';

        if (viewUserSettings.imageType === 'list') {
            html = listview.getListViewHtml({
                items: itemsResult?.Items || [],
                context: context
            });
        } else {
            html = cardBuilder.getCardsHtml(
                itemsResult?.Items || [],
                getCardOptions()
            );
        }

        if (!itemsResult?.Items?.length) {
            html += '<div class="noItemsMessage centerMessage">';
            html
                += '<h1>' + globalize.translate('MessageNothingHere') + '</h1>';
            html += '<p>' + globalize.translate(noItemsMessage) + '</p>';
            html += '</div>';
        }

        return html;
    }, [
        getCardOptions,
        context,
        itemsResult?.Items,
        noItemsMessage,
        viewUserSettings.imageType
    ]);

    return (
        <>
            <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                <Pagination
                    itemsResult={itemsResult}
                    viewUserSettings={viewUserSettings}
                    setViewUserSettings={setViewUserSettings}
                />
                {isBtnPlayAllEnabled && <PlayAllButton parentId={parentId} />}
                {isBtnShuffleEnabled && <ShuffleButton itemId={parentId} />}

                {isBtnSelectViewEnabled && (
                    <ViewSettingsButton
                        viewType={viewType}
                        viewUserSettings={viewUserSettings}
                        setViewUserSettings={setViewUserSettings}
                    />
                )}

                {isBtnSortEnabled && (
                    <SortButton
                        viewUserSettings={viewUserSettings}
                        setViewUserSettings={setViewUserSettings}
                    />
                )}

                {isBtnFilterEnabled && (
                    <FilterButton
                        parentId={parentId}
                        itemType={itemType}
                        viewType={viewType}
                        viewUserSettings={viewUserSettings}
                        setViewUserSettings={setViewUserSettings}
                    />
                )}

                {isBtnNewCollectionEnabled && <NewCollectionButton />}
            </div>

            {isAlphaPickerEnabled && (
                <AlphaPickerContainer
                    viewUserSettings={viewUserSettings}
                    setViewUserSettings={setViewUserSettings}
                />
            )}

            {isLoading ? (
                <Loading />
            ) : (
                <ItemsContainer
                    viewUserSettings={viewUserSettings}
                    getItemsHtml={getItemsHtml}
                />
            )}

            <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                <Pagination
                    itemsResult={itemsResult}
                    viewUserSettings={viewUserSettings}
                    setViewUserSettings={setViewUserSettings}
                />
            </div>
        </>
    );
};

export default ViewItemsContainer;
