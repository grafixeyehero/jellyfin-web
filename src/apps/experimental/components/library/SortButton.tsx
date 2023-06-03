import React, { FC, useCallback } from 'react';

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

import globalize from 'scripts/globalize';
import { LibraryViewSettings } from 'types/library';

interface SortButtonProps {
    viewType: string;
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<
        React.SetStateAction<LibraryViewSettings>
    >;
}

const sortByOptions = [
    {
        label: globalize.translate('Name'),
        value: 'SortName'
    },
    {
        label: globalize.translate('OptionRandom'),
        value: 'Random'
    },
    {
        label: globalize.translate('OptionImdbRating'),
        value: 'CommunityRating'
    },
    {
        label: globalize.translate('OptionCriticRating'),
        value: 'CriticRating'
    },
    {
        label: globalize.translate('OptionDateAdded'),
        value: 'DateCreated'
    },
    {
        label: globalize.translate('OptionDatePlayed'),
        value: 'DatePlayed'
    },
    {
        label: globalize.translate('OptionParentalRating'),
        value: 'OfficialRating'
    },
    {
        label: globalize.translate('OptionPlayCount'),
        value: 'PlayCount'
    },
    {
        label: globalize.translate('OptionReleaseDate'),
        value: 'PremiereDate'
    },
    {
        label: globalize.translate('Runtime'),
        value: 'Runtime'
    },
    {
        label: globalize.translate('Folders'),
        value: 'IsFolder'
    }
];

const sortOrderMenuOptions = [
    { label: 'Ascending', value: 'Ascending' },
    { label: 'Descending', value: 'Descending' }
];

const SortButton: FC<SortButtonProps> = ({
    viewType,
    libraryViewSettings,
    setLibraryViewSettings
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

            setLibraryViewSettings((prevState) => ({
                ...prevState,
                StartIndex: 0,
                [name]: event.target.value
            }));
        },
        [setLibraryViewSettings]
    );

    const getVisibleSortBy = () => {
        const visibleSortBy = ['SortName', 'Random', 'DateCreated'];

        if (
            viewType !== 'books'
            && viewType !== 'photos'
            && viewType !== 'videos'
        ) {
            visibleSortBy.push('CommunityRating');
            visibleSortBy.push('CriticRating');
            visibleSortBy.push('DatePlayed');
            visibleSortBy.push('OfficialRating');
            visibleSortBy.push('PlayCount');
            visibleSortBy.push('PremiereDate');
            visibleSortBy.push('Runtime');
            visibleSortBy.push('OfficialRating');
        }

        if (viewType === 'books' || viewType === 'photos' || viewType === 'videos') {
            visibleSortBy.push('IsFolder');
        }

        return visibleSortBy;
    };

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
                                value={libraryViewSettings.SortBy as string}
                                label={globalize.translate('LabelSortBy')}
                                name='SortBy'
                                onChange={onSelectChange}
                            >
                                {sortByOptions
                                    .filter(
                                        (option) =>
                                            getVisibleSortBy().indexOf(
                                                option.value
                                            ) !== -1
                                    )
                                    .map((option) => (
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
                                value={libraryViewSettings.SortOrder as string}
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
