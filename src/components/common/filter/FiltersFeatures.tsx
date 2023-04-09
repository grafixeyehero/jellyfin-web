import React, { FC, useCallback } from 'react';
import globalize from '../../../scripts/globalize';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ViewUserSettings } from '../../../types/interface';

interface FiltersFeaturesProps {
    visibleSettings: string[];
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const featureFiltersOptions = [
    { label: 'Subtitles', value: 'HasSubtitles' },
    { label: 'Trailers', value: 'HasTrailer' },
    { label: 'Extras', value: 'HasSpecialFeature' },
    { label: 'ThemeSongs', value: 'HasThemeSong' },
    { label: 'ThemeVideos', value: 'HasThemeVideo' }
];

const FiltersFeatures: FC<FiltersFeaturesProps> = ({
    visibleSettings,
    settings,
    setfilters
}) => {
    const onFiltersFeaturesChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = settings.filtersFeatures as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersFeatures: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersFeatures: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersFeatures]
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
                                        !!settings.filtersFeatures?.includes(
                                            String(filter.value)
                                        )
                                    }
                                    onChange={onFiltersFeaturesChange}
                                    value={String(filter.value)}
                                />
                            }
                            label={globalize.translate(filter.label)}
                        />
                    ))}
            </FormGroup>
        </FormControl>
    );
};

export default FiltersFeatures;
