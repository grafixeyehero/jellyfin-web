import type { QueryFiltersLegacy } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ViewUserSettings } from '../../../types/interface';

interface FiltersOfficialRatingsProps {
    filtes?: QueryFiltersLegacy;
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const FiltersOfficialRatings: FC<FiltersOfficialRatingsProps> = ({
    filtes,
    settings,
    setfilters
}) => {
    const onFiltersOfficialRatingsChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = settings.filtersOfficialRatings as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersOfficialRatings: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersOfficialRatings: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersOfficialRatings]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {filtes?.OfficialRatings?.map((filter) => (
                    <FormControlLabel
                        key={filter}
                        control={
                            <Checkbox
                                checked={
                                    !!settings.filtersOfficialRatings?.includes(
                                        String(filter)
                                    )
                                }
                                onChange={onFiltersOfficialRatingsChange}
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

export default FiltersOfficialRatings;
