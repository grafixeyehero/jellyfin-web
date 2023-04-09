import type { UserDto } from '@jellyfin/sdk/lib/generated-client';
import escapeHTML from 'escape-html';
import React, { FC, useCallback } from 'react';

import { Button, Checkbox, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';

import { useGetChannels, useGetDevices, useGetMediaFolders } from '../../../hooks/useFetchItems';
import globalize from '../../../scripts/globalize';

interface UserLibraryAccessFormProps {
    clientUser: UserDto | null | undefined;
    setClientUser: React.Dispatch<
        React.SetStateAction<UserDto | null | undefined>
    >;
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UserLibraryAccessForm: FC<UserLibraryAccessFormProps> = ({
    clientUser,
    setClientUser,
    onFormSubmit
}) => {
    const { data: mediaFolders } = useGetMediaFolders({ isHidden: false });
    const { data: channels } = useGetChannels({
        userId: clientUser?.Id
    });
    const { data: devices } = useGetDevices({
        userId: clientUser?.Id
    });

    const onEnabledFoldersChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = String(event.target.value);
            const existingValue = clientUser?.Policy
                ?.EnabledFolders as string[];
            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnabledFolders: newValue
                    }
                }));
            } else {
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnabledFolders: [...existingValue, value]
                    }
                }));
            }
        },
        [clientUser?.Policy?.EnabledFolders, setClientUser]
    );
    const onEnabledChannelsChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = String(event.target.value);
            const existingValue = clientUser?.Policy
                ?.EnabledChannels as string[];
            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnabledChannels: newValue
                    }
                }));
            } else {
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnabledChannels: [...existingValue, value]
                    }
                }));
            }
        },
        [clientUser?.Policy?.EnabledChannels, setClientUser]
    );
    const onEnabledDevicesChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = String(event.target.value);
            const existingValue = clientUser?.Policy
                ?.EnabledDevices as string[];
            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnabledDevices: newValue
                    }
                }));
            } else {
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnabledDevices: [...existingValue, value]
                    }
                }));
            }
        },
        [clientUser?.Policy?.EnabledDevices, setClientUser]
    );

    const onFormChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const target = event.target;
            const name = target.name;
            const value =
                target.type === 'checkbox' ? target.checked : target.value;
            setClientUser((prevState) => ({
                ...prevState,
                Policy: {
                    ...prevState?.Policy,
                    [name]: value
                }
            }));
        },
        [setClientUser]
    );

    return (
        <form onSubmit={onFormSubmit} className='userLibraryAccessForm'>
            <div className='folderAccessContainer'>
                <h3>{globalize.translate('HeaderLibraryAccess')}</h3>
                <div className='checkboxContainer checkboxContainer-withDescription'>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableAllFolders'
                                        checked={
                                            clientUser?.Policy?.EnableAllFolders
                                        }
                                        onChange={onFormChange}
                                        name='EnableAllFolders'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionEnableAccessToAllLibraries'
                                )}
                            />
                        </FormGroup>
                    </FormControl>
                </div>

                {!clientUser?.Policy?.EnableAllFolders ? (
                    <div className='folderAccessListContainer'>
                        <div className='folderAccess'>
                            <h3 className='checkboxListLabel'>
                                {globalize.translate('HeaderLibraries')}
                            </h3>
                            <div
                                className='checkboxList paperList'
                                style={{
                                    padding: '.5em 1em'
                                }}
                            >
                                <FormControl
                                    component='fieldset'
                                    variant='standard'
                                >
                                    <FormGroup>
                                        {mediaFolders?.map((folder) => (
                                            <FormControlLabel
                                                key={folder.Id}
                                                control={
                                                    <Checkbox
                                                        className='chkFolder'
                                                        checked={
                                                            !!clientUser?.Policy
                                                                ?.EnableAllFolders
                                                            || clientUser?.Policy?.EnabledFolders?.includes(
                                                                String(
                                                                    folder.Id
                                                                )
                                                            )
                                                        }
                                                        onChange={
                                                            onEnabledFoldersChange
                                                        }
                                                        value={String(
                                                            folder.Id
                                                        )}
                                                    />
                                                }
                                                label={folder.Name}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </div>
                        </div>
                        <FormHelperText>
                            {globalize.translate('LibraryAccessHelp')}
                        </FormHelperText>
                    </div>
                ) : null}
            </div>

            {channels?.length ? (
                <div className='channelAccessContainer'>
                    <h3>{globalize.translate('HeaderChannelAccess')}</h3>
                    <div className='checkboxContainer checkboxContainer-withDescription'>
                        <FormControl>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className='chkEnableAllChannels'
                                            checked={
                                                clientUser?.Policy
                                                    ?.EnableAllChannels
                                            }
                                            onChange={onFormChange}
                                            name='EnableAllChannels'
                                        />
                                    }
                                    label={globalize.translate(
                                        'OptionEnableAccessToAllChannels'
                                    )}
                                />
                            </FormGroup>
                        </FormControl>
                    </div>

                    {!clientUser?.Policy?.EnableAllChannels ? (
                        <div className='channelAccessListContainer'>
                            <div className='channelAccess'>
                                <h3 className='checkboxListLabel'>
                                    {globalize.translate('Channels')}
                                </h3>
                                <div
                                    className='checkboxList paperList'
                                    style={{
                                        padding: '.5em 1em'
                                    }}
                                >
                                    <FormControl
                                        component='fieldset'
                                        variant='standard'
                                    >
                                        <FormGroup>
                                            {channels?.map((folder) => (
                                                <FormControlLabel
                                                    key={folder.Id}
                                                    control={
                                                        <Checkbox
                                                            className='chkChannel'
                                                            checked={
                                                                !!clientUser
                                                                    ?.Policy
                                                                    ?.EnableAllChannels
                                                                || clientUser?.Policy?.EnabledChannels?.includes(
                                                                    String(
                                                                        folder.Id
                                                                    )
                                                                )
                                                            }
                                                            onChange={
                                                                onEnabledChannelsChange
                                                            }
                                                            value={String(
                                                                folder.Id
                                                            )}
                                                        />
                                                    }
                                                    label={folder.Name}
                                                />
                                            ))}
                                        </FormGroup>
                                    </FormControl>
                                </div>
                            </div>
                            <FormHelperText>
                                {globalize.translate('ChannelAccessHelp')}
                            </FormHelperText>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {!clientUser?.Policy?.IsAdministrator ? (
                <div className='deviceAccessContainer'>
                    <h3>{globalize.translate('HeaderDeviceAccess')}</h3>
                    <div className='checkboxContainer checkboxContainer-withDescription'>
                        <FormControl>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className='chkEnableAllDevices'
                                            checked={
                                                clientUser?.Policy
                                                    ?.EnableAllDevices
                                            }
                                            onChange={onFormChange}
                                            name='EnableAllDevices'
                                        />
                                    }
                                    label={globalize.translate(
                                        'OptionEnableAccessFromAllDevices'
                                    )}
                                />
                            </FormGroup>
                        </FormControl>
                    </div>

                    {!clientUser?.Policy?.EnableAllDevices ? (
                        <div className='deviceAccessListContainer'>
                            <div className='deviceAccess'>
                                <h3 className='checkboxListLabel'>
                                    {globalize.translate('HeaderDevices')}
                                </h3>
                                <div
                                    className='checkboxList paperList'
                                    style={{
                                        padding: '.5em 1em'
                                    }}
                                >
                                    <FormControl
                                        component='fieldset'
                                        variant='standard'
                                    >
                                        <FormGroup>
                                            {devices?.map((folder) => (
                                                <FormControlLabel
                                                    key={folder.Id}
                                                    control={
                                                        <Checkbox
                                                            className='chkDevice'
                                                            checked={
                                                                !!clientUser
                                                                    ?.Policy
                                                                    ?.EnableAllDevices
                                                                || clientUser?.Policy?.EnabledDevices?.includes(
                                                                    String(
                                                                        folder.Id
                                                                    )
                                                                )
                                                            }
                                                            onChange={
                                                                onEnabledDevicesChange
                                                            }
                                                            value={String(
                                                                folder.Id
                                                            )}
                                                        />
                                                    }
                                                    label={`${escapeHTML(
                                                        folder.Name || ''
                                                    )} ${folder.AppName}`}
                                                />
                                            ))}
                                        </FormGroup>
                                    </FormControl>
                                </div>
                            </div>
                            <FormHelperText>
                                {globalize.translate('DeviceAccessHelp')}
                            </FormHelperText>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <br />
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

export default UserLibraryAccessForm;
