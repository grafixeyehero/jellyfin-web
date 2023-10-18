import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC } from 'react';
import escapeHTML from 'escape-html';
import { groupBy } from 'lodash-es';
import { Box } from '@mui/material';
import { getIndex } from './listHelper';
import ListGroupHeaderWrapper from './ListGroupHeaderWrapper';
import ListItem from './ListItem';
import 'components/listview/listview.scss';
import { ListOptions } from 'types/listOptions';

interface ListProps {
    items: BaseItemDto[];
    listOptions?: ListOptions ;
}

const List: FC<ListProps> = ({ items = [], listOptions = {} }) => {
    const groupedData = groupBy(items, (item) => {
        if (listOptions.showIndex) {
            return getIndex(item, listOptions);
        }
        return '';
    });

    return (
        <>
            {Object.entries(groupedData).map(([itemGroupTitle, gitems], index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Box key={index}>
                    {itemGroupTitle && (

                        <ListGroupHeaderWrapper index={index} >
                            {escapeHTML(itemGroupTitle)}
                        </ListGroupHeaderWrapper>)
                    }
                    {gitems.map((item) => (
                        <ListItem
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${item.Id}-${index}`}
                            index={index}
                            item={item}
                            listOptions={listOptions}
                        />
                    ))}
                </Box>
            ))}

        </>
    );
};

export default List;
