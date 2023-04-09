import React, { FC, useEffect, useRef } from 'react';

import ItemsContainerElement from '../../elements/ItemsContainerElement';
import imageLoader from '../images/imageLoader';
import '../../elements/emby-itemscontainer/emby-itemscontainer';
import { ViewUserSettings } from '../../types/interface';

interface ItemsContainerI {
    viewUserSettings: ViewUserSettings;
    getItemsHtml: () => string
}

const ItemsContainer: FC<ItemsContainerI> = ({ viewUserSettings, getItemsHtml }) => {
    const element = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const itemsContainer = element.current?.querySelector('.itemsContainer') as HTMLDivElement;
        itemsContainer.innerHTML = getItemsHtml();
        imageLoader.lazyChildren(itemsContainer);
    }, [getItemsHtml]);

    const cssClass = viewUserSettings.imageType == 'list' ? 'vertical-list' : 'vertical-wrap';

    return (
        <div ref={element}>
            <ItemsContainerElement
                className={`itemsContainer ${cssClass} centered padded-left padded-right padded-right-withalphapicker`}
            />
        </div>
    );
};

export default ItemsContainer;
