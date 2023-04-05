import React, { FC, useCallback } from 'react';
import globalize from '../../../scripts/globalize';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ViewUserSettings } from '../../../types/interface';
interface FiltersSeriesStatusProps {
    settings: ViewUserSettings;
    setfilters: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
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
    settings,
    setfilters
}) => {
    const onFiltersSeriesStatusChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const value = String(event.target.value);
            const existingValue = settings.filtersSeriesStatus as string[];

            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,

                    filtersSeriesStatus: newValue
                }));
            } else {
                setfilters((prevState) => ({
                    ...prevState,
                    StartIndex: 0,
                    filtersSeriesStatus: [...existingValue, value]
                }));
            }
        },
        [setfilters, settings.filtersSeriesStatus]
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
                                    !!settings.filtersSeriesStatus?.includes(
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
