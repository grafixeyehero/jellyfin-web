import { type BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import LibraryIcon from '../../LibraryIcon';
import DefaultName from './DefaultName';
import ItemTypeIcon from './ItemTypeIcon';

interface DefaultIconTextProps {
    item: BaseItemDto;
    defaultCardImageIcon?: string;
}

const DefaultIconText: FC<DefaultIconTextProps> = ({ item, defaultCardImageIcon }) => {
    if (item.CollectionType) {
        return <LibraryIcon item={item} />;
    }

    if (item.Type) {
        return <ItemTypeIcon itemType={item.Type} />;
    }

    if (defaultCardImageIcon) {
        return (
            <span
                className={`cardImageIcon material-icons ${defaultCardImageIcon}`}
                aria-hidden='true'
            />
        );
    }

    return <DefaultName item={item} />;
};

export default DefaultIconText;
