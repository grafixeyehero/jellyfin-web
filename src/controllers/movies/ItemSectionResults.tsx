import { BaseItemDto } from '@thornbill/jellyfin-sdk/dist/generated-client';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import cardBuilder from '../../components/cardbuilder/cardBuilder';
import ItemsContainerElement from '../../components/dashboard/users/ItemsContainerElement';

type CardOptions = {
    itemsContainer?: HTMLElement,
    parentContainer?: HTMLElement,
    allowBottomPadding?: boolean,
    centerText?: boolean,
    coverImage?: boolean,
    inheritThumb?: boolean,
    overlayMoreButton?: boolean,
    overlayText?: boolean,
    preferThumb?: boolean,
    scalable?: boolean,
    shape?: string,
    showParentTitle?: boolean,
    showParentTitleOrTitle?: boolean,
    showAirTime?: boolean,
    showAirDateTime?: boolean,
    showChannelName?: boolean,
    showTitle?: boolean,
    showYear?: boolean
}

type ItemSectionResultsProps = {
    title?: string;
    items?: BaseItemDto[];
    cardOptions?: CardOptions;
}

const ItemSectionResults: FunctionComponent<ItemSectionResultsProps> = ({ items = [], cardOptions = {} }: ItemSectionResultsProps) => {
    const element = useRef<HTMLDivElement>(null);

    useEffect(() => {
        cardBuilder.buildCards(items, {
            itemsContainer: element.current?.querySelector('.itemsContainer'),
            parentContainer: element.current,
            shape: 'autooverflow',
            scalable: true,
            showTitle: true,
            overlayText: false,
            centerText: true,
            allowBottomPadding: false,
            ...cardOptions
        });
    }, [cardOptions, items]);

    return (
        <div ref={element} >
            <ItemsContainerElement
                id=''
                className='itemsContainer padded-left padded-right'
            />
        </div>
    );
};

export default ItemSectionResults;
