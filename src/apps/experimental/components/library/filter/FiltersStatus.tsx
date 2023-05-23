import React, { FC, useCallback } from 'react';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import globalize from 'scripts/globalize';

import { LibraryViewSettings } from 'types/library';

interface FiltersStatusProps {
    visibleSettings: string[];
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const statusFiltersOptions = [
    {
        label: globalize.translate('Played'),
        value: 'IsPlayed'
    },
    {
        label: globalize.translate('Unplayed'),
        value: 'IsUnplayed'
    },
    {
        label: globalize.translate('Favorite'),
        value: 'IsFavorite'
    },
    {
        label: globalize.translate('ContinueWatching'),
        value: 'IsResumable'
    },
    {
        label: globalize.translate('OptionSpecialEpisode'),
        value: 'ParentIndexNumber'
    },
    {
        label: globalize.translate('OptionMissingEpisode'),
        value: 'IsMissing'
    },
    {
        label: globalize.translate('OptionUnairedEpisode'),
        value: 'IsUnaired'
    }
];

const FiltersStatus: FC<FiltersStatusProps> = ({
    visibleSettings,
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const onFiltersStatusChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = libraryViewSettings.filtersStatus as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,

                    filtersStatus: newValue
                }));
            } else {
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersStatus: [...existingValue, value]
                }));
            }
        },
        [setLibraryViewSettings, libraryViewSettings.filtersStatus]
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
                                        !!libraryViewSettings.filtersStatus?.includes(
                                            String( filter.value)
                                        )
                                    }
                                    onChange={onFiltersStatusChange}
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

export default FiltersStatus;
