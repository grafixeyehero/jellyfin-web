import React, { FC, useCallback } from 'react';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import {
    Typography,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import Popover from '@mui/material/Popover';
import globalize from 'scripts/globalize';
import { LibraryViewSettings } from 'types/library';

interface ViewSettingsButtonProps {
    viewType: string;
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const imageTypesOptions = [
    {
        label: globalize.translate('Primary'),
        value: 'primary'
    },
    {
        label: globalize.translate('Banner'),
        value: 'banner'
    },
    {
        label: globalize.translate('Disc'),
        value: 'disc'
    },
    {
        label: globalize.translate('Logo'),
        value: 'logo'
    },
    {
        label: globalize.translate('Thumb'),
        value: 'thumb'
    },
    {
        label: globalize.translate('List'),
        value: 'list'
    }
];

const ViewSettingsButton: FC<ViewSettingsButtonProps> = ({
    viewType,
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'selectview-popover' : undefined;

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setLibraryViewSettings({
                ...libraryViewSettings,
                [event.target.name]: event.target.checked
            });
        },
        [setLibraryViewSettings, libraryViewSettings]
    );

    const onSelectChange = useCallback(
        (event: SelectChangeEvent) => {
            setLibraryViewSettings({
                ...libraryViewSettings,
                imageType: event.target.value as string
            });
        },
        [setLibraryViewSettings, libraryViewSettings]
    );

    const getVisibleImageType = () => {
        const visibleImageType = ['primary', 'list'];

        if (
            viewType !== 'episodes'
            && viewType !== 'artists'
            && viewType !== 'albumArtists'
            && viewType !== 'albums'
            && viewType !== 'books'
            && viewType !== 'photos'
            && viewType !== 'videos'
        ) {
            visibleImageType.push('banner');
            visibleImageType.push('disc');
            visibleImageType.push('logo');
            visibleImageType.push('thumb');
        }

        return visibleImageType;
    };

    const isViewSettingsEnabled = () => {
        return libraryViewSettings.imageType !== 'list';
    };

    const isShowYearEnabled = useCallback(() => {
        return (
            viewType !== 'books'
            && viewType !== 'photos'
            && viewType !== 'videos'
        );
    }, [viewType]);

    return (
        <div>
            <IconButton
                title={globalize.translate('ButtonSelectView')}
                sx={{ ml: 2 }}
                aria-describedby={id}
                className='paper-icon-button-light btnShuffle autoSize'
                onClick={handleClick}
            >
                <ViewComfyIcon />
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
                sx={{
                    '& .MuiFormControl-root': { m: 3, width: 200 }
                }}
            >
                <FormControl>
                    <InputLabel id='select-sort-label'>
                        <Typography component='span'>
                            {globalize.translate('LabelImageType')}
                        </Typography>
                    </InputLabel>
                    <Select
                        value={libraryViewSettings.imageType}
                        label={globalize.translate('LabelImageType')}
                        onChange={onSelectChange}
                    >
                        {imageTypesOptions
                            .filter(
                                (imageType) =>
                                    getVisibleImageType().indexOf(
                                        imageType.value
                                    ) !== -1
                            )
                            .map((imageType) => (
                                <MenuItem
                                    key={imageType.value}
                                    value={imageType.value}
                                >
                                    <Typography component='span'>
                                        {imageType.label}
                                    </Typography>
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                {isViewSettingsEnabled() && (
                    <>
                        <Divider />
                        <FormControl>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={libraryViewSettings.showTitle}
                                            onChange={handleChange}
                                            name='showTitle'
                                        />
                                    }
                                    label={globalize.translate('ShowTitle')}
                                />
                                {isShowYearEnabled() && (<FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={libraryViewSettings.showYear}
                                            onChange={handleChange}
                                            name='showYear'
                                        />
                                    }
                                    label={globalize.translate('ShowYear')}
                                />)}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                libraryViewSettings.cardLayout
                                            }
                                            onChange={handleChange}
                                            name='cardLayout'
                                        />
                                    }
                                    label={globalize.translate(
                                        'EnableCardLayout'
                                    )}
                                />
                            </FormGroup>
                        </FormControl>
                    </>
                )}
            </Popover>
        </div>
    );
};

export default ViewSettingsButton;
