import React, { FC, useCallback } from 'react';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import globalize from 'scripts/globalize';

import { LibraryViewSettings } from 'types/library';

interface FiltersSeriesStatusProps {
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const statusFiltersOptions = [
    {
        label: globalize.translate('Continuing'),
        value: 'Continuing'
    },
    {
        label: globalize.translate('Ended'),
        value: 'Ended'
    }
];

const FiltersSeriesStatus: FC<FiltersSeriesStatusProps> = ({
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const onFiltersSeriesStatusChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = libraryViewSettings.filtersSeriesStatus as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,

                    filtersSeriesStatus: newValue
                }));
            } else {
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersSeriesStatus: [...existingValue, value]
                }));
            }
        },
        [setLibraryViewSettings, libraryViewSettings.filtersSeriesStatus]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {statusFiltersOptions.map((filter) => (
                    <FormControlLabel
                        key={filter.value}
                        control={
                            <Checkbox
                                checked={
                                    !!libraryViewSettings.filtersSeriesStatus?.includes(
                                        String( filter.value)
                                    )
                                }
                                onChange={onFiltersSeriesStatusChange}
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

export default FiltersSeriesStatus;
