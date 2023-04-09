import escapeHTML from 'escape-html';
import React, { FC, useCallback } from 'react';
import uuid from 'react-uuid';

import {
    AccessSchedule, DynamicDayOfWeek, UnratedItem, UserDto
} from '@jellyfin/sdk/lib/generated-client';
import AddIcon from '@mui/icons-material/Add';
import {
    Button, Checkbox, FormControlLabel, FormGroup, IconButton, List, Stack
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useGetParentalRatings } from '../../../hooks/useFetchItems';
import globalize from '../../../scripts/globalize';
import Loading from '../../loading/LoadingComponent';
import AccessScheduleList from './AccessScheduleList';
import BlockedTagList from './BlockedTagList';

const items = [
    {
        name: globalize.translate('Books'),
        value: UnratedItem.Book
    },
    {
        name: globalize.translate('Channels'),
        value: UnratedItem.ChannelContent
    },
    {
        name: globalize.translate('LiveTV'),
        value: UnratedItem.LiveTvChannel
    },
    {
        name: globalize.translate('Movies'),
        value: UnratedItem.Movie
    },
    {
        name: globalize.translate('Music'),
        value: UnratedItem.Music
    },
    {
        name: globalize.translate('Trailers'),
        value: UnratedItem.Trailer
    },
    {
        name: globalize.translate('Shows'),
        value: UnratedItem.Series
    },
    {
        name: globalize.translate('Other'),
        value: UnratedItem.Other
    }
];

interface UserParentalControlFormProps {
    clientUser: UserDto;
    setClientUser: React.Dispatch<
        React.SetStateAction<UserDto | null | undefined>
    >;
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UserParentalControlForm: FC<UserParentalControlFormProps> = ({
    clientUser,
    setClientUser,
    onFormSubmit
}) => {
    const { isLoading, data: parentalRatings } = useGetParentalRatings();

    const onEnabledFoldersChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const existingValue = clientUser?.Policy
                ?.BlockUnratedItems as UnratedItem[];
            if (existingValue?.includes(value as UnratedItem)) {
                const newValue = existingValue?.filter(
                    (prevState) => prevState !== (value as UnratedItem)
                );
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        BlockUnratedItems: newValue
                    }
                }));
            } else {
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        BlockUnratedItems: [
                            ...existingValue,
                            value as UnratedItem
                        ]
                    }
                }));
            }
        },
        [clientUser?.Policy?.BlockUnratedItems, setClientUser]
    );

    const onSelectChange = useCallback(
        (event: SelectChangeEvent) => {
            const target = event.target;
            const value = target.value;
            setClientUser((prevState) => ({
                ...prevState,
                Policy: {
                    ...prevState?.Policy,
                    MaxParentalRating: value === '' ? null : Number(value)
                }
            }));
        },
        [setClientUser]
    );

    const showBlockedTagPopup = useCallback(() => {
        import('../../prompt/prompt').then(({ default: prompt }) => {
            prompt({
                label: globalize.translate('LabelTag')
            }).then(function (value) {
                const existingValue = clientUser?.Policy
                    ?.BlockedTags as string[];
                if (!existingValue.includes(value)) {
                    setClientUser((prevState) => ({
                        ...prevState,
                        Policy: {
                            ...prevState?.Policy,
                            BlockedTags: [...existingValue, value]
                        }
                    }));
                }
            });
        });
    }, [clientUser?.Policy?.BlockedTags, setClientUser]);

    const showSchedulePopup = useCallback(
        (scheduleoption: AccessSchedule) => {
            const schedule = scheduleoption || {};
            import('../../accessSchedule/accessSchedule').then(
                ({ default: accessschedule }) => {
                    accessschedule
                        .show({
                            schedule: schedule
                        })
                        .then(function (updatedSchedule) {
                            const existingValue = clientUser?.Policy
                                ?.AccessSchedules as AccessSchedule[];
                            const newValue =
                                existingValue.concat(updatedSchedule);
                            setClientUser((prevState) => ({
                                ...prevState,
                                Policy: {
                                    ...prevState?.Policy,
                                    AccessSchedules: newValue
                                }
                            }));
                        });
                }
            );
        },
        [clientUser?.Policy?.AccessSchedules, setClientUser]
    );

    const onAddBlockedTagClick = useCallback(() => {
        showBlockedTagPopup();
    }, [showBlockedTagPopup]);

    const onAddScheduleClick = useCallback(() => {
        showSchedulePopup({
            DayOfWeek: DynamicDayOfWeek.Sunday,
            StartHour: 0,
            EndHour: 0
        });
    }, [showSchedulePopup]);

    const onDeleteTagClick = useCallback(
        (tag: string) => () => {
            const existingValue = clientUser?.Policy?.BlockedTags as string[];
            const removeTags = existingValue.filter((t) => t !== tag);
            setClientUser((prevState) => ({
                ...prevState,
                Policy: {
                    ...prevState?.Policy,
                    BlockedTags: removeTags
                }
            }));
        },
        [clientUser?.Policy?.BlockedTags, setClientUser]
    );

    const onDeleteScheduleClick = useCallback(
        (index) => () => {
            const newAccessSchedules =
                clientUser?.Policy?.AccessSchedules?.filter(
                    (_, i) => i !== index
                );
            setClientUser((prevState) => ({
                ...prevState,
                Policy: {
                    ...prevState?.Policy,
                    AccessSchedules: newAccessSchedules
                }
            }));
        },

        [clientUser?.Policy?.AccessSchedules, setClientUser]
    );

    if (isLoading) return <Loading />;

    return (
        <form onSubmit={onFormSubmit} className='userParentalControlForm'>
            <div className='selectContainer'>
                <Stack spacing={1}>
                    <InputLabel
                        className='inputLabel'
                        htmlFor='selectLoginProvider-label'
                    >
                        {globalize.translate('LabelMaxParentalRating')}
                    </InputLabel>
                    <Select
                        id='selectMaxParentalRating'
                        name='MaxParentalRating'
                        value={
                            clientUser?.Policy?.MaxParentalRating ?
                                String(clientUser?.Policy?.MaxParentalRating) :
                                ''
                        }
                        displayEmpty
                        onChange={onSelectChange}
                    >
                        <MenuItem value=''>
                            <em>None</em>
                        </MenuItem>
                        {parentalRatings?.map((rating) => (
                            <MenuItem
                                key={rating.Value}
                                value={String(rating.Value)}
                            >
                                {escapeHTML(rating.Name)}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        {globalize.translate('MaxParentalRatingHelp')}
                    </FormHelperText>
                </Stack>
            </div>
            <div>
                <div className='blockUnratedItems'>
                    <h3 className='checkboxListLabel'>
                        {globalize.translate('HeaderBlockItemsWithNoRating')}
                    </h3>
                    <div
                        className='checkboxList paperList'
                        style={{ padding: '.5em 1em' }}
                    >
                        <FormControl component='fieldset' variant='standard'>
                            <FormGroup>
                                {items?.map((item) => (
                                    <FormControlLabel
                                        key={item.value}
                                        control={
                                            <Checkbox
                                                className='chkFolder'
                                                checked={
                                                    !!clientUser?.Policy?.BlockUnratedItems?.includes(
                                                        item.value
                                                    )
                                                }
                                                onChange={
                                                    onEnabledFoldersChange
                                                }
                                                value={item.value}
                                            />
                                        }
                                        label={item.name}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </div>
                </div>
            </div>
            <br />
            <div className='verticalSection' style={{ marginBottom: '2em' }}>
                <div className='detailSectionHeader sectionTitleContainer flex align-items-center'>
                    <h2 className='sectionTitle'>
                        {globalize.translate('LabelBlockContentWithTags')}
                    </h2>

                    <IconButton
                        title={globalize.translate('Add')}
                        className='emby-button btnAddBlockedTag fab submit sectionTitleButton'
                        onClick={onAddBlockedTagClick}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
                <List className='blockedTagsList paperList'>
                    {clientUser?.Policy?.BlockedTags?.map((tag) => (
                        <BlockedTagList
                            key={uuid()}
                            tag={tag}
                            onDeleteTagClick={onDeleteTagClick}
                        />
                    ))}
                </List>
            </div>
            {!clientUser?.Policy?.IsAdministrator && (
                <div
                    className='accessScheduleSection verticalSection'
                    style={{ marginBottom: '2em' }}
                >
                    <div className='sectionTitleContainer flex align-items-center'>
                        <h2 className='sectionTitle'>
                            {globalize.translate('HeaderAccessSchedule')}
                        </h2>

                        <IconButton
                            title={globalize.translate('Add')}
                            className='emby-button btnAddSchedule fab submit sectionTitleButton'
                            onClick={onAddScheduleClick}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>

                    <p>{globalize.translate('HeaderAccessScheduleHelp')}</p>
                    <List className='accessScheduleList paperList'>
                        {clientUser?.Policy?.AccessSchedules?.map(
                            (accessSchedule, index) => (
                                <AccessScheduleList
                                    key={uuid()}
                                    index={index}
                                    accessSchedule={accessSchedule}
                                    onDeleteScheduleClick={
                                        onDeleteScheduleClick
                                    }
                                />
                            )
                        )}
                    </List>
                </div>
            )}
            <div>
                <Button
                    type='submit'
                    className='emby-button raised button-submit block'
                >
                    {globalize.translate('Save')}
                </Button>
            </div>
        </form>
    );
};

export default UserParentalControlForm;
