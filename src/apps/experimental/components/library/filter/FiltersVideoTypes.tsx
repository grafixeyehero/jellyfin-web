import React, { FC, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { LibraryViewSettings } from 'types/library';

interface FiltersVideoTypesProps {
    visibleSettings: string[];
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const videoTypesFiltersOptions = [
    { label: 'SD', value: 'IsSD' },
    { label: 'DVD', value: 'Dvd' },
    { label: 'HD', value: 'IsHD' },
    { label: 'Blu-ray', value: 'Bluray' },
    { label: '4K', value: 'Is4K' },
    { label: '3D', value: 'Is3D' },
    { label: 'ISO', value: 'Iso' }
];

const FiltersVideoTypes: FC<FiltersVideoTypesProps> = ({
    visibleSettings,
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const onFiltersVideoTypesChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = libraryViewSettings.filtersVideoTypes as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersVideoTypes: newValue
                }));
            } else {
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersVideoTypes: [...existingValue, value]
                }));
            }
        },
        [setLibraryViewSettings, libraryViewSettings.filtersVideoTypes]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {videoTypesFiltersOptions
                    .filter(
                        (filter) =>
                            visibleSettings.indexOf(filter.value) !== -1
                    )
                    .map((filter) => (
                        <FormControlLabel
                            key={filter.value}
                            control={
                                <Checkbox
                                    checked={
                                        !!libraryViewSettings.filtersVideoTypes?.includes(
                                            String(filter.value)
                                        )
                                    }
                                    onChange={onFiltersVideoTypesChange}
                                    value={String(filter.value)}
                                />
                            }
                            label={filter.label}
                        />
                    ))}
            </FormGroup>
        </FormControl>
    );
};

export default FiltersVideoTypes;
