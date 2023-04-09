import React, { FC, useCallback } from 'react';
import { ViewUserSettings } from '../../types/interface';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { Popover } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import globalize from '../../scripts/globalize';

interface SortButtonProps {
    viewUserSettings: ViewUserSettings;
    setViewUserSettings: React.Dispatch<
        React.SetStateAction<ViewUserSettings>
    >;
}

const sortMenuOptions = [
    { label: 'Name', value: 'SortName' },
    { label: 'OptionRandom', value: 'Random' },
    { label: 'OptionImdbRating', value: 'CommunityRating' },
    { label: 'OptionCriticRating', value: 'CriticRating' },
    { label: 'OptionDateAdded', value: 'DateCreated' },
    { label: 'OptionDatePlayed', value: 'DatePlayed' },
    { label: 'OptionParentalRating', value: 'OfficialRating' },
    { label: 'OptionPlayCount', value: 'PlayCount' },
    { label: 'OptionReleaseDate', value: 'PremiereDate' },
    { label: 'Runtime', value: 'Runtime' }
];

const sortOrderMenuOptions = [
    { label: 'Ascending', value: 'Ascending' },
    { label: 'Descending', value: 'Descending' }
];

const SortButton: FC<SortButtonProps> = ({
    viewUserSettings,
    setViewUserSettings
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'sort-popover' : undefined;

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const onSelectChange = useCallback(
        (event: SelectChangeEvent) => {
            const name = event.target.name;

            setViewUserSettings((prevState) => ({
                ...prevState,
                StartIndex: 0,
                [name]: event.target.value
            }));
        },
        [setViewUserSettings]
    );

    return (
        <div>
            <IconButton
                title={globalize.translate('Sort')}
                sx={{ ml: 2 }}
                aria-describedby={id}
                className='paper-icon-button-light btnShuffle autoSize'
                onClick={handleClick}
            >
                <SortByAlphaIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <Box
                    sx={{
                        '& .MuiFormControl-root': { m: 2, width: '18ch' }
                    }}
                >
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id='select-sort-label'>
                                <Typography component='span'>
                                    {globalize.translate('LabelSortBy')}
                                </Typography>
                            </InputLabel>
                            <Select
                                labelId='select-sort-label'
                                id='selectSortBy'
                                value={viewUserSettings.SortBy as string}
                                label={globalize.translate('LabelSortBy')}
                                name='SortBy'
                                onChange={onSelectChange}
                            >
                                {sortMenuOptions.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        <Typography component='span'>
                                            {globalize.translate(option.label)}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <Divider />
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id='select-sortorder-label'>
                                <Typography component='span'>
                                    {globalize.translate('LabelSortOrder')}
                                </Typography>
                            </InputLabel>
                            <Select
                                labelId='select-sortorder-label'
                                id='selectSortOrder'
                                value={viewUserSettings.SortOrder as string}
                                label={globalize.translate('LabelSortOrder')}
                                name='SortOrder'
                                onChange={onSelectChange}
                            >
                                {sortOrderMenuOptions.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        <Typography component='span'>
                                            {option.label}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </Box>
            </Popover>
        </div>
    );
};

export default SortButton;
