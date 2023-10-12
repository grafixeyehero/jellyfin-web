import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import classNames from 'classnames';
import layoutManager from 'components/layoutManager';
import { getDataAttributes } from './listHelper';
import ListContent from './ListContent';
import ListWrapper from './ListWrapper';
import 'components/mediainfo/mediainfo.scss';
import 'components/guide/programs.scss';
import { ListOptions } from 'types/listOptions';

interface ListItemProps {
    index: number;
    item: BaseItemDto;
    listOptions?: ListOptions;
}

const ListItem: FC<ListItemProps> = ({ index, item, listOptions = {} }) => {
    const action = listOptions.action ?? 'link';
    const isLargeStyle = listOptions.imageSize === 'large';
    const enableOverview = listOptions.enableOverview;
    const clickEntireItem = !!layoutManager.tv;
    const enableSideMediaInfo = listOptions.enableSideMediaInfo ?? true;
    const enableContentWrapper =
        listOptions.enableOverview && !layoutManager.tv;
    const downloadWidth = isLargeStyle ? 500 : 80;
    const dataAttributes = getDataAttributes(item, listOptions);
    const listItemClass = classNames(
        'listItem',
        {
            'listItem-border':
                listOptions.border
                ?? (listOptions.highlight !== false && !layoutManager.tv)
        },
        { 'itemAction listItem-button': clickEntireItem },
        { 'listItem-focusscale': layoutManager.tv },
        { 'listItem-largeImage': isLargeStyle },
        { 'listItem-withContentWrapper': enableContentWrapper }
    );
    return (
        <ListWrapper
            key={index}
            item={item}
            className={listItemClass}
            action={action}
            index={index}
            dataAttributes={dataAttributes}
        >
            <ListContent
                item={item}
                listOptions={listOptions}
                enableContentWrapper={enableContentWrapper}
                enableOverview={enableOverview}
                enableSideMediaInfo={enableSideMediaInfo}
                clickEntireItem={clickEntireItem}
                action={action}
                isLargeStyle={isLargeStyle}
                downloadWidth={downloadWidth}
            />
        </ListWrapper>
    );
};

export default ListItem;
