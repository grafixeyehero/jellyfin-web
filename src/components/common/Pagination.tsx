import type { BaseItemDtoQueryResult } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';

import globalize from '../../scripts/globalize';
import * as userSettings from '../../scripts/settings/userSettings';
import { ViewUserSettings } from '../../types/interface';

interface PaginationProps {
    viewUserSettings: ViewUserSettings;
    setViewUserSettings: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
    itemsResult?: BaseItemDtoQueryResult;
}

const Pagination: FC<PaginationProps> = ({
    viewUserSettings,
    setViewUserSettings,
    itemsResult = {}
}) => {
    const limit = userSettings.libraryPageSize(undefined);
    const totalRecordCount = itemsResult.TotalRecordCount || 0;
    const startIndex = viewUserSettings.StartIndex || 0;
    const recordsStart = totalRecordCount ? startIndex + 1 : 0;
    const recordsEnd = limit ?
        Math.min(startIndex + limit, totalRecordCount) :
        totalRecordCount;
    const showControls = limit > 0 && limit < totalRecordCount;

    const onNextPageClick = useCallback(() => {
        if (limit > 0) {
            const newIndex = startIndex + limit;
            setViewUserSettings((prevState) => ({
                ...prevState,
                StartIndex: newIndex
            }));
        }
    }, [limit, setViewUserSettings, startIndex]);

    const onPreviousPageClick = useCallback(() => {
        if (limit > 0) {
            const newIndex = Math.max(0, startIndex - limit);
            setViewUserSettings((prevState) => ({
                ...prevState,
                StartIndex: newIndex
            }));
        }
    }, [limit, setViewUserSettings, startIndex]);

    return (
        <div className='paging'>
            <div
                className='listPaging'
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <span>
                    {globalize.translate(
                        'ListPaging',
                        recordsStart,
                        recordsEnd,
                        totalRecordCount
                    )}
                </span>
                {showControls && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Pagination;
