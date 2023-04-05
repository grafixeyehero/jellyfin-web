import type { QueryFiltersLegacy } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ViewUserSettings } from '../../../types/interface';

interface FiltersGenresProps {
    filtes?: QueryFiltersLegacy;
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const FiltersGenres: FC<FiltersGenresProps> = ({
    filtes,
    settings,
    setfilters
}) => {
    const onFiltersGenresChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = settings.filtersGenres as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersGenres: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersGenres: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersGenres]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {filtes?.Genres?.map((filter) => (
                    <FormControlLabel
                        key={filter}
                        control={
                            <Checkbox
                                checked={
                                    !!settings.filtersGenres?.includes(
                                        String(filter)
                                    )
                                }
                                onChange={onFiltersGenresChange}
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

export default FiltersGenres;
