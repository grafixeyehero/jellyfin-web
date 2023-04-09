import type { QueryFiltersLegacy } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ViewUserSettings } from '../../../types/interface';

interface FiltersTagsProps {
    filtes?: QueryFiltersLegacy;
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const FiltersTags: FC<FiltersTagsProps> = ({
    filtes,
    settings,
    setfilters
}) => {
    const onFiltersTagsChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = settings.filtersTags as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersTags: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersTags: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersTags]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {filtes?.Tags?.map((filter) => (
                    <FormControlLabel
                        key={filter}
                        control={
                            <Checkbox
                                checked={
                                    !!settings.filtersTags?.includes(
                                        String(filter)
                                    )
                                }
                                onChange={onFiltersTagsChange}
                                value={String(filter)}
                            />
                        }
                        label={filter}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

export default FiltersTags;
