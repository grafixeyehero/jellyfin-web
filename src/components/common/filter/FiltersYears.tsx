import type { QueryFiltersLegacy } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ViewUserSettings } from '../../../types/interface';
interface FiltersYearsProps {
    filtes?: QueryFiltersLegacy;
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const FiltersYears: FC<FiltersYearsProps> = ({
    filtes,
    settings,
    setfilters
}) => {
    const onFiltersYearsChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = Number(event.target.value);
            const existingValue = settings.filtersYears as number[];
            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: number) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersYears: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersYears: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersYears]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {filtes?.Years?.map((filter) => (
                    <FormControlLabel
                        key={filter}
                        control={
                            <Checkbox
                                checked={
                                    !!settings.filtersYears?.includes(
                                        Number(filter)
                                    )
                                }
                                onChange={onFiltersYearsChange}
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

export default FiltersYears;
