import type { BaseItemDtoQueryResult } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useEffect, useCallback, useRef } from 'react';

import globalize from 'scripts/globalize';
import imageLoader from 'components/images/imageLoader';
import listview from 'components/listview/listview';
import cardBuilder from 'components/cardbuilder/cardBuilder';
import ItemsContainerElement from 'elements/ItemsContainerElement';
import 'elements/emby-itemscontainer/emby-itemscontainer';

import { LibraryViewSettings } from 'types/library';
import { CardOptions } from 'types/cardOptions';

interface ItemsContainerI {
    libraryViewSettings: LibraryViewSettings;
    collectionType: string | null | undefined;
    viewType: string | undefined;
    itemsResult?: BaseItemDtoQueryResult;
    //getItemsHtml: () => string
}

const ItemsContainer: FC<ItemsContainerI> = ({ libraryViewSettings, collectionType, itemsResult, viewType }) => {
    const element = useRef<HTMLDivElement>(null);

    const getCardOptions = useCallback(() => {
        let shape;
        let preferThumb;
        let preferDisc;
        let preferLogo;
        let lines = libraryViewSettings.showTitle ? 2 : 0;

        if (libraryViewSettings.imageType === 'banner') {
            shape = 'banner';
        } else if (libraryViewSettings.imageType === 'disc') {
            shape = 'square';
            preferDisc = true;
        } else if (libraryViewSettings.imageType === 'logo') {
            shape = 'backdrop';
            preferLogo = true;
        } else if (libraryViewSettings.imageType === 'thumb') {
            shape = 'backdrop';
            preferThumb = true;
        } else {
            shape = 'auto';
        }

        const cardOptions: CardOptions = {
            shape: shape,
            showTitle: libraryViewSettings.showTitle,
            showYear: libraryViewSettings.showYear,
            cardLayout: libraryViewSettings.cardLayout,
            centerText: true,
            context: collectionType,
            coverImage: true,
            preferThumb: preferThumb,
            preferDisc: preferDisc,
            preferLogo: preferLogo,
            overlayPlayButton: false,
            overlayMoreButton: true,
            overlayText: !libraryViewSettings.showTitle
        };

        if (
            viewType === 'songs'
            || viewType === 'albums'
            || viewType === 'episodes'
        ) {
            cardOptions.showParentTitle = libraryViewSettings.showTitle;
        } else if (viewType === 'artists') {
            cardOptions.showYear = false;
            lines = 1;
        }

        cardOptions.lines = lines;
        cardOptions.items = itemsResult?.Items || [];

        return cardOptions;
    }, [
        viewType,
        collectionType,
        itemsResult?.Items,
        libraryViewSettings.cardLayout,
        libraryViewSettings.imageType,
        libraryViewSettings.showTitle,
        libraryViewSettings.showYear
    ]);

    const getItemsHtml = useCallback(() => {
        let html = '';

        if (libraryViewSettings.imageType === 'list') {
            html = listview.getListViewHtml({
                items: itemsResult?.Items || [],
                context: collectionType
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
            html
                += '<p>' + globalize.translate('MessageNoItemsAvailable') + '</p>';
            html += '</div>';
        }

        return html;
    }, [
        getCardOptions,
        collectionType,
        itemsResult?.Items,
        libraryViewSettings.imageType
    ]);

    useEffect(() => {
        const itemsContainer = element.current?.querySelector('.itemsContainer') as HTMLDivElement;
        itemsContainer.innerHTML = getItemsHtml();
        imageLoader.lazyChildren(itemsContainer);
    }, [getItemsHtml]);

    const cssClass = libraryViewSettings.imageType == 'list' ? 'vertical-list' : 'vertical-wrap';

    return (
        <div ref={element}>
            <ItemsContainerElement
                className={`itemsContainer ${cssClass} centered padded-left padded-right padded-right-withalphapicker`}
            />
        </div>
    );
};

export default ItemsContainer;
