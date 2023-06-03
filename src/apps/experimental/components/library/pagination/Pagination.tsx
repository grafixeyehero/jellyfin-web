import type { BaseItemDtoQueryResult } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import globalize from 'scripts/globalize';
import * as userSettings from 'scripts/settings/userSettings';

import { LibraryViewSettings } from 'types/library';

interface PaginationProps {
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
    itemsResult?: BaseItemDtoQueryResult;
}

const Pagination: FC<PaginationProps> = ({
    libraryViewSettings,
    setLibraryViewSettings,
    itemsResult = {}
}) => {
    const limit = userSettings.libraryPageSize(undefined);
    const totalRecordCount = itemsResult.TotalRecordCount || 0;
    const startIndex = libraryViewSettings.StartIndex || 0;
    const recordsEnd = Math.min(startIndex + limit, totalRecordCount);

    const onNextPageClick = useCallback(() => {
        if (limit > 0) {
            const newIndex = startIndex + limit;
            setLibraryViewSettings((prevState) => ({
                ...prevState,
                StartIndex: newIndex
            }));
        }
    }, [limit, setLibraryViewSettings, startIndex]);

    const onPreviousPageClick = useCallback(() => {
        if (limit > 0) {
            const newIndex = Math.max(0, startIndex - limit);
            setLibraryViewSettings((prevState) => ({
                ...prevState,
                StartIndex: newIndex
            }));
        }
    }, [limit, setLibraryViewSettings, startIndex]);

    return (
        <div
            className='listPaging'
            style={{ display: 'flex', alignItems: 'center' }}
        >
            <span>
                {globalize.translate(
                    'ListPaging',
                    totalRecordCount ? startIndex + 1 : 0,
                    recordsEnd,
                    totalRecordCount
                )}
            </span>

            <IconButton
                title={globalize.translate('Previous')}
                className='paper-icon-button-light btnPreviousPage autoSize'
                disabled={startIndex ? false : true}
                onClick={onPreviousPageClick}
            >
                <ArrowBackIcon />
            </IconButton>

            <IconButton
                title={globalize.translate('Next')}
                className='paper-icon-button-light btnNextPage autoSize'
                disabled={
                    startIndex + limit >= totalRecordCount ?
                        true :
                        false
                }
                onClick={onNextPageClick}
            >
                <ArrowForwardIcon />
            </IconButton>
        </div>
    );
};

export default Pagination;
