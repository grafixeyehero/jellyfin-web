import React, { FC, useCallback } from 'react';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import globalize from 'scripts/globalize';

import { LibraryViewSettings } from 'types/library';

interface FiltersFeaturesProps {
    visibleSettings: string[];
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const featureFiltersOptions = [
    {
        label: globalize.translate('Subtitles'),
        value: 'HasSubtitles'
    },
    {
        label: globalize.translate('Trailers'),
        value: 'HasTrailer'
    },
    {
        label: globalize.translate('Extras'),
        value: 'HasSpecialFeature'
    },
    {
        label: globalize.translate('ThemeSongs'),
        value: 'HasThemeSong'
    },
    {
        label: globalize.translate('ThemeVideos'),
        value: 'HasThemeVideo'
    }
];

const FiltersFeatures: FC<FiltersFeaturesProps> = ({
    visibleSettings,
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const onFiltersFeaturesChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = libraryViewSettings.filtersFeatures as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersFeatures: newValue
                }));
            } else {
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersFeatures: [...existingValue, value]
                }));
            }
        },
        [setLibraryViewSettings, libraryViewSettings.filtersFeatures]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {featureFiltersOptions
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
                                        !!libraryViewSettings.filtersFeatures?.includes(
                                            String(filter.value)
                                        )
                                    }
                                    onChange={onFiltersFeaturesChange}
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

export default FiltersFeatures;
