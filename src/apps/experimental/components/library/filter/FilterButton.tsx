import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Popover } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {
    useGetQueryFiltersLegacy,
    useGetStudios
} from 'hooks/useFetchItems';
import globalize from 'scripts/globalize';
import FiltersStatus from './FiltersStatus';
import FiltersFeatures from './FiltersFeatures';
import FiltersVideoTypes from './FiltersVideoTypes';
import FiltersGenres from './FiltersGenres';
import FiltersYears from './FiltersYears';
import FiltersTags from './FiltersTags';
import FiltersOfficialRatings from './FiltersOfficialRatings';
import FiltersStudios from './FiltersStudios';
import FiltersSeriesStatus from './FiltersSeriesStatus';

import { LibraryViewSettings } from 'types/library';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ?
            'rgba(255, 255, 255, .05)' :
            'rgba(0, 0, 0, .03)',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1)
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

interface FilterButtonProps {
    parentId?: string | null;
    itemType: BaseItemKind[];
    viewType: string;
    context?: string | null;
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const FilterButton: FC<FilterButtonProps> = ({
    parentId,
    itemType,
    viewType,
    libraryViewSettings,
    setLibraryViewSettings
}) => {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const getVisibleFilters = () => {
        const visibleFilters = ['IsFavorite'];

        if (
            viewType !== 'albums'
            && viewType !== 'artists'
            && viewType !== 'albumArtists'
            && viewType !== 'songs'
            && viewType !== 'photos'
        ) {
            visibleFilters.push('IsUnplayed');
            visibleFilters.push('IsPlayed');
            visibleFilters.push('IsResumable');
        }

        if (viewType === 'movies' || viewType === 'episodes') {
            visibleFilters.push('Bluray');
            visibleFilters.push('Dvd');
            visibleFilters.push('IsHD');
            visibleFilters.push('IsSD');
            visibleFilters.push('Is3D');
            visibleFilters.push('Is4K');
        }

        if (
            viewType === 'movies'
            || viewType === 'series'
            || viewType === 'episodes'
        ) {
            visibleFilters.push('HasTrailer');
            visibleFilters.push('HasSubtitles');
            visibleFilters.push('HasSpecialFeature');
            visibleFilters.push('HasThemeSong');
            visibleFilters.push('HasThemeVideo');
        }

        if (viewType === 'episodes') {
            visibleFilters.push('ParentIndexNumber');
            visibleFilters.push('IsMissing');
            visibleFilters.push('IsUnaired');
        }

        return visibleFilters;
    };

    const isFiltersLegacyEnabled = () => {
        return (
            viewType === 'movies'
            || viewType === 'series'
            || viewType === 'albums'
            || viewType === 'albumArtists'
            || viewType === 'artists'
            || viewType === 'songs'
            || viewType === 'episodes'
        );
    };

    const isFiltersStudiosEnabled = () => {
        return viewType === 'movies' || viewType === 'series';
    };

    const isFiltersFeaturesEnabled = () => {
        return (
            viewType === 'movies'
            || viewType === 'series'
            || viewType === 'episodes'
        );
    };

    const isFiltersVideoTypesEnabled = () => {
        return viewType === 'movies' || viewType === 'episodes';
    };

    const isFiltersSeriesStatusEnabled = () => {
        return viewType === 'series';
    };

    const { data } = useGetQueryFiltersLegacy(parentId, itemType);
    const { data: studios } = useGetStudios(parentId, itemType);

    const handleChange =
        (panel: string) =>
            (event: React.SyntheticEvent, newExpanded: boolean) => {
                setExpanded(newExpanded ? panel : false);
            };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return (
        <div>
            <IconButton
                title={globalize.translate('Filter')}
                sx={{ ml: 2 }}
                aria-describedby={id}
                className='paper-icon-button-light btnShuffle autoSize'
                onClick={handleClick}
            >
                <FilterListIcon />
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
                PaperProps={{
                    style: {
                        maxHeight: '50%',
                        width: 250
                    }
                }}
            >
                <Accordion
                    expanded={expanded === 'filtersStatus'}
                    onChange={handleChange('filtersStatus')}
                    TransitionProps={{ unmountOnExit: true }}
                >
                    <AccordionSummary
                        aria-controls='filter-panel1-content'
                        id='filter-panel1-header'
                    >
                        <Typography>
                            {globalize.translate('Filters')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FiltersStatus
                            visibleSettings={getVisibleFilters()}
                            libraryViewSettings={libraryViewSettings}
                            setLibraryViewSettings={setLibraryViewSettings}
                        />
                    </AccordionDetails>
                </Accordion>
                {isFiltersSeriesStatusEnabled() && (
                    <>
                        <Accordion
                            expanded={expanded === 'filtersSeriesStatus'}
                            onChange={handleChange('filtersSeriesStatus')}
                            TransitionProps={{ unmountOnExit: true }}
                        >
                            <AccordionSummary
                                aria-controls='filter-panel1-content'
                                id='filter-panel1-header'
                            >
                                <Typography>
                                    {globalize.translate('HeaderSeriesStatus')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FiltersSeriesStatus
                                    libraryViewSettings={libraryViewSettings}
                                    setLibraryViewSettings={setLibraryViewSettings}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}
                {isFiltersFeaturesEnabled() && (
                    <>
                        <Accordion
                            expanded={expanded === 'filtersFeatures'}
                            onChange={handleChange('filtersFeatures')}
                            TransitionProps={{ unmountOnExit: true }}
                        >
                            <AccordionSummary
                                aria-controls='filter-panel2-content'
                                id='filter-panel2-header'
                            >
                                <Typography>
                                    {globalize.translate('Features')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FiltersFeatures
                                    visibleSettings={getVisibleFilters()}
                                    libraryViewSettings={libraryViewSettings}
                                    setLibraryViewSettings={setLibraryViewSettings}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}

                {isFiltersVideoTypesEnabled() && (
                    <>
                        <Accordion
                            expanded={expanded === 'filtersVideoTypes'}
                            onChange={handleChange('filtersVideoTypes')}
                            TransitionProps={{ unmountOnExit: true }}
                        >
                            <AccordionSummary
                                aria-controls='filter-panel3-content'
                                id='filter-panel3-header'
                            >
                                <Typography>
                                    {globalize.translate('HeaderVideoType')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FiltersVideoTypes
                                    visibleSettings={getVisibleFilters()}
                                    libraryViewSettings={libraryViewSettings}
                                    setLibraryViewSettings={setLibraryViewSettings}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}

                {isFiltersLegacyEnabled() && (
                    <>
                        {data?.Genres && data?.Genres?.length > 0 && (
                            <Accordion
                                expanded={expanded === 'filtersGenres'}
                                onChange={handleChange('filtersGenres')}
                                TransitionProps={{ unmountOnExit: true }}
                            >
                                <AccordionSummary
                                    aria-controls='filter-panel4-content'
                                    id='filter-panel4-header'
                                >
                                    <Typography>
                                        {globalize.translate('Genres')}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FiltersGenres
                                        filtes={data}
                                        libraryViewSettings={libraryViewSettings}
                                        setLibraryViewSettings={setLibraryViewSettings}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        )}

                        {data?.OfficialRatings && data?.OfficialRatings?.length > 0 && (
                            <Accordion
                                expanded={expanded === 'filtersOfficialRatings'}
                                onChange={handleChange(
                                    'filtersOfficialRatings'
                                )}
                                TransitionProps={{ unmountOnExit: true }}
                            >
                                <AccordionSummary
                                    aria-controls='filter-panel5-content'
                                    id='filter-panel5-header'
                                >
                                    <Typography>
                                        {globalize.translate(
                                            'HeaderParentalRatings'
                                        )}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FiltersOfficialRatings
                                        filtes={data}
                                        libraryViewSettings={libraryViewSettings}
                                        setLibraryViewSettings={setLibraryViewSettings}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        )}

                        {data?.Tags && data?.Tags.length > 0 && (
                            <Accordion
                                expanded={expanded === 'filtersTags'}
                                onChange={handleChange('filtersTags')}
                                TransitionProps={{ unmountOnExit: true }}
                            >
                                <AccordionSummary
                                    aria-controls='filter-panel6-content'
                                    id='filter-panel6-header'
                                >
                                    <Typography>
                                        {globalize.translate('Tags')}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FiltersTags
                                        filtes={data}
                                        libraryViewSettings={libraryViewSettings}
                                        setLibraryViewSettings={setLibraryViewSettings}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        )}

                        {data?.Years && data?.Years?.length > 0 && (
                            <Accordion
                                expanded={expanded === 'filtersYears'}
                                onChange={handleChange('filtersYears')}
                                TransitionProps={{ unmountOnExit: true }}
                            >
                                <AccordionSummary
                                    aria-controls='filter-panel7-content'
                                    id='filter-panel7-header'
                                >
                                    <Typography>
                                        {globalize.translate('HeaderYears')}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FiltersYears
                                        filtes={data}
                                        libraryViewSettings={libraryViewSettings}
                                        setLibraryViewSettings={setLibraryViewSettings}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </>
                )}
                {isFiltersStudiosEnabled() && (
                    <>
                        <Accordion
                            expanded={expanded === 'filtersStudios'}
                            onChange={handleChange('filtersStudios')}
                            TransitionProps={{ unmountOnExit: true }}
                        >
                            <AccordionSummary
                                aria-controls='filter-panel8-content'
                                id='filter-panel8-header'
                            >
                                <Typography>
                                    {globalize.translate('Studios')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FiltersStudios
                                    filtes={studios}
                                    libraryViewSettings={libraryViewSettings}
                                    setLibraryViewSettings={setLibraryViewSettings}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}
            </Popover>
        </div>
    );
};

export default FilterButton;
