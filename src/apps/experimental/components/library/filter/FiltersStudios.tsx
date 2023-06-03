import type { BaseItemDtoQueryResult } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { LibraryViewSettings } from 'types/library';

interface FiltersStudiosProps {
    filtes?: BaseItemDtoQueryResult;
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const FiltersStudios: FC<FiltersStudiosProps> = ({
    filtes,
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const onFiltersStudiosChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = libraryViewSettings.filtersStudioIds as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersStudioIds: newValue
                }));
            } else {
                setLibraryViewSettings((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersStudioIds: [...existingValue, value]
                }));
            }
        },
        [setLibraryViewSettings, libraryViewSettings.filtersStudioIds]
    );

    return (
        <FormControl component='fieldset' variant='standard'>
            <FormGroup>
                {filtes?.Items?.map((filter) => (
                    <FormControlLabel
                        key={filter.Id}
                        control={
                            <Checkbox
                                checked={
                                    !!libraryViewSettings.filtersStudioIds?.includes(
                                        String(filter.Id)
                                    )
                                }
                                onChange={onFiltersStudiosChange}
                                value={String(filter.Id)}
                            />
                        }
                        label={filter.Name}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

export default FiltersStudios;
