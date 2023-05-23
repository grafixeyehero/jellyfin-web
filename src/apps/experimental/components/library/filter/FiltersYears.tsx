import type { QueryFiltersLegacy } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { LibraryViewSettings } from 'types/library';

interface FiltersYearsProps {
    filtes?: QueryFiltersLegacy;
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const FiltersYears: FC<FiltersYearsProps> = ({
    filtes,
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const onFiltersYearsChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = Number(event.target.value);
            const existingValue = libraryViewSettings.filtersYears as number[];
            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: number) => prevState !== value
                );
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersYears: newValue
                }));
            } else {
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersYears: [...existingValue, value]
                }));
            }
        },
        [setLibraryViewSettings, libraryViewSettings.filtersYears]
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
                                    !!libraryViewSettings.filtersYears?.includes(
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
