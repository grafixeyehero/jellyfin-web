import type { BaseItemDtoQueryResult } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import { ViewUserSettings } from '../../../types/interface';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface FiltersStudiosProps {
    filtes?: BaseItemDtoQueryResult;
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const FiltersStudios: FC<FiltersStudiosProps> = ({
    filtes,
    settings,
    setfilters
}) => {
    const onFiltersStudiosChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = settings.filtersStudioIds as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersStudioIds: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersStudioIds: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersStudioIds]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {filtes?.Items?.map((filter) => (
                    <FormControlLabel
                        key={filter.Id}
                        control={
                            <Checkbox
                                checked={
                                    !!settings.filtersStudioIds?.includes(
                                        String(filter.Id)
                                    )
                                }
                                onChange={onFiltersStudiosChange}
                                value={String(filter.Id)}
                            />
                        }
                        label={filter.Name}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

export default FiltersStudios;
