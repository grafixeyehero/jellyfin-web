import React, { FC, useCallback } from 'react';
import globalize from '../../../scripts/globalize';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ViewUserSettings } from '../../../types/interface';
interface FiltersStatusProps {
    visibleSettings: string[];
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const statusFiltersOptions = [
    { label: 'Played', value: 'IsPlayed' },
    { label: 'Unplayed', value: 'IsUnplayed' },
    { label: 'Favorite', value: 'IsFavorite' },
    { label: 'ContinueWatching', value: 'IsResumable' },
    { label: 'OptionSpecialEpisode', value: 'ParentIndexNumber' },
    { label: 'OptionMissingEpisode', value: 'IsMissing' },
    { label: 'OptionUnairedEpisode', value: 'IsUnaired' }
];

const FiltersStatus: FC<FiltersStatusProps> = ({
    visibleSettings,
    settings,
    setfilters
}) => {
    const onFiltersStatusChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = settings.filtersStatus as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,

                    filtersStatus: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersStatus: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersStatus]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {statusFiltersOptions
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
                                        !!settings.filtersStatus?.includes(
                                            String( filter.value)
                                        )
                                    }
                                    onChange={onFiltersStatusChange}
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

export default FiltersStatus;
