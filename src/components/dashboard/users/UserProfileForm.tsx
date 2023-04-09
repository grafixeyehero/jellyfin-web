import type { UserDto } from '@jellyfin/sdk/lib/generated-client';
import escapeHTML from 'escape-html';
import React, { FC, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Checkbox, FormControlLabel, FormGroup, OutlinedInput, Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {
    useGetAuthProviders, useGetChannels, useGetMediaFolders, useGetNamedConfiguration,
    useGetPasswordResetProviders
} from '../../../hooks/useFetchItems';
import globalize from '../../../scripts/globalize';

const getSyncPlayAccessOptions = () => {
    return [
        {
            label: globalize.translate(
                'LabelSyncPlayAccessCreateAndJoinGroups'
            ),
            value: 'CreateAndJoinGroups'
        },
        {
            label: globalize.translate('LabelSyncPlayAccessJoinGroups'),
            value: 'JoinGroups'
        },
        {
            label: globalize.translate('LabelSyncPlayAccessNone'),
            value: 'None'
        }
    ];
};
interface UserProfileFormProps {
    clientUser: UserDto;
    setClientUser: React.Dispatch<
        React.SetStateAction<UserDto | null | undefined>
    >;
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UserProfileForm: FC<UserProfileFormProps> = ({
    clientUser,
    setClientUser,
    onFormSubmit
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: authProviders } = useGetAuthProviders();
    const { data: passwordResetProviders } = useGetPasswordResetProviders();
    const { data: mediaFolders } = useGetMediaFolders({ isHidden: false });
    const { data: channels } = useGetChannels({
        userId: id,
        supportsMediaDeletion: true
    });
    const { data: config } = useGetNamedConfiguration({
        key: 'network'
    });

    const onNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setClientUser((prevState) => ({
                ...prevState,
                Name: event.target.value
            }));
        },
        [setClientUser]
    );

    const onRemoteClientBitrateLimitChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = Math.floor(
                1e6 * parseFloat(event.target.value || '0')
            );
            setClientUser((prevState) => ({
                ...prevState,
                Policy: {
                    ...prevState?.Policy,
                    RemoteClientBitrateLimit: newValue
                }
            }));
        },
        [setClientUser]
    );

    const onContentDeletionFromFoldersChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = String(event.target.value);
            const existingValue = clientUser?.Policy
                ?.EnableContentDeletionFromFolders as string[];
            if (existingValue?.includes(value)) {
                const newValue = existingValue?.filter(
                    (prevState: string) => prevState !== value
                );
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnableContentDeletionFromFolders: newValue
                    }
                }));
            } else {
                setClientUser((prevState) => ({
                    ...prevState,
                    Policy: {
                        ...prevState?.Policy,
                        EnableContentDeletionFromFolders: [
                            ...existingValue,
                            value
                        ]
                    }
                }));
            }
        },
        [clientUser?.Policy?.EnableContentDeletionFromFolders, setClientUser]
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

    const onSelectChange = useCallback(
        (event: SelectChangeEvent) => {
            const target = event.target;
            const name = target.name;
            const value = target.value;
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

    const onBtnCancelClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <form onSubmit={onFormSubmit} className='userProfileForm'>
            {clientUser?.Policy?.IsDisabled ? (
                <div className='disabledUserBanner'>
                    <div className='btn btnDarkAccent btnStatic'>
                        <div>
                            {globalize.translate(
                                'HeaderThisUserIsCurrentlyDisabled'
                            )}
                        </div>
                        <div style={{ marginTop: 5 }}>
                            {globalize.translate('MessageReenableUser')}
                        </div>
                    </div>
                </div>
            ) : null}

            <div id='fldUserName' className='inputContainer'>
                <Stack spacing={1}>
                    <InputLabel className='inputLabel' htmlFor='txtUserName'>
                        {globalize.translate('LabelName')}
                    </InputLabel>
                    <OutlinedInput
                        id='txtUserName'
                        type='text'
                        value={clientUser.Name}
                        name='Name'
                        onChange={onNameChange}
                        fullWidth
                        required
                    />
                </Stack>
            </div>

            {authProviders && authProviders.length > 1 ? (
                <div className='selectContainer fldSelectLoginProvider'>
                    <Stack spacing={1}>
                        <InputLabel
                            className='inputLabel'
                            htmlFor='selectLoginProvider-label'
                        >
                            {globalize.translate('LabelAuthProvider')}
                        </InputLabel>
                        <Select
                            id='selectLoginProvider'
                            name='AuthenticationProviderId'
                            value={
                                clientUser?.Policy?.AuthenticationProviderId
                                || ''
                            }
                            onChange={onSelectChange}
                        >
                            {authProviders?.map((option) => (
                                <MenuItem
                                    key={option.Id}
                                    value={option.Id as string}
                                >
                                    {escapeHTML(option.Name)}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            {globalize.translate('AuthProviderHelp')}
                        </FormHelperText>
                    </Stack>
                </div>
            ) : null}

            {passwordResetProviders && passwordResetProviders?.length > 1 ? (
                <div className='selectContainer fldSelectPasswordResetProvider'>
                    <Stack spacing={1}>
                        <InputLabel
                            className='inputLabel'
                            htmlFor='selectPasswordResetProvider-label'
                        >
                            {globalize.translate('LabelPasswordResetProvider')}
                        </InputLabel>
                        <Select
                            id='selectPasswordResetProvider'
                            name='PasswordResetProviderId'
                            value={
                                clientUser?.Policy?.PasswordResetProviderId
                                || ''
                            }
                            onChange={onSelectChange}
                        >
                            {passwordResetProviders?.map((option) => (
                                <MenuItem
                                    key={option.Id}
                                    value={option.Id as string}
                                >
                                    {escapeHTML(option.Name)}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            {globalize.translate('PasswordResetProviderHelp')}
                        </FormHelperText>
                    </Stack>
                </div>
            ) : null}

            {config?.EnableRemoteAccess ? (
                <div className='checkboxContainer checkboxContainer-withDescription fldRemoteAccess'>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkRemoteAccess'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableRemoteAccess
                                        }
                                        onChange={onFormChange}
                                        name='EnableRemoteAccess'
                                    />
                                }
                                label={globalize.translate('AllowRemoteAccess')}
                            />
                        </FormGroup>
                        <FormHelperText>
                            {globalize.translate('AllowRemoteAccessHelp')}
                        </FormHelperText>
                    </FormControl>
                </div>
            ) : null}

            <FormControl>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                className='chkIsAdmin'
                                checked={clientUser?.Policy?.IsAdministrator}
                                onChange={onFormChange}
                                name='IsAdministrator'
                            />
                        }
                        label={globalize.translate(
                            'OptionAllowUserToManageServer'
                        )}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                className='chkEnableCollectionManagement'
                                checked={
                                    clientUser?.Policy
                                        ?.EnableCollectionManagement
                                }
                                onChange={onFormChange}
                                name='EnableCollectionManagement'
                            />
                        }
                        label={globalize.translate('AllowCollectionManagement')}
                    />
                </FormGroup>
            </FormControl>

            <div id='featureAccessFields' className='verticalSection'>
                <h2 className='paperListLabel'>
                    {globalize.translate('HeaderFeatureAccess')}
                </h2>
                <div
                    className='checkboxList paperList'
                    style={{ padding: '.5em 1em' }}
                >
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableLiveTvAccess'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableLiveTvAccess
                                        }
                                        onChange={onFormChange}
                                        name='EnableLiveTvAccess'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowBrowsingLiveTv'
                                )}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkManageLiveTv'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableLiveTvManagement
                                        }
                                        onChange={onFormChange}
                                        name='EnableLiveTvManagement'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowManageLiveTv'
                                )}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </div>

            <div className='verticalSection'>
                <h2 className='paperListLabel'>
                    {globalize.translate('HeaderPlayback')}
                </h2>
                <div
                    className='checkboxList paperList'
                    style={{ padding: '.5em 1em' }}
                >
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableMediaPlayback'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableMediaPlayback
                                        }
                                        onChange={onFormChange}
                                        name='EnableMediaPlayback'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowMediaPlayback'
                                )}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableAudioPlaybackTranscoding'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableAudioPlaybackTranscoding
                                        }
                                        onChange={onFormChange}
                                        name='EnableAudioPlaybackTranscoding'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowAudioPlaybackTranscoding'
                                )}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableVideoPlaybackTranscoding'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableVideoPlaybackTranscoding
                                        }
                                        onChange={onFormChange}
                                        name='EnableVideoPlaybackTranscoding'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowVideoPlaybackTranscoding'
                                )}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableVideoPlaybackRemuxing'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnablePlaybackRemuxing
                                        }
                                        onChange={onFormChange}
                                        name='EnablePlaybackRemuxing'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowVideoPlaybackRemuxing'
                                )}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkForceRemoteSourceTranscoding'
                                        checked={
                                            clientUser?.Policy
                                                ?.ForceRemoteSourceTranscoding
                                        }
                                        onChange={onFormChange}
                                        name='ForceRemoteSourceTranscoding'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionForceRemoteSourceTranscoding'
                                )}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <FormHelperText>
                    {globalize.translate(
                        'OptionAllowMediaPlaybackTranscodingHelp'
                    )}
                </FormHelperText>
            </div>

            <br />
            <div className='verticalSection'>
                <div className='inputContainer'>
                    <Stack spacing={1}>
                        <InputLabel
                            className='inputLabel'
                            htmlFor='txtRemoteClientBitrateLimit'
                        >
                            {globalize.translate(
                                'LabelRemoteClientBitrateLimit'
                            )}
                        </InputLabel>
                        <OutlinedInput
                            id='txtRemoteClientBitrateLimit'
                            type='number'
                            inputProps={{
                                inputMode: 'decimal',
                                pattern: '[0-9]*(.[0-9]+)?',
                                min: 0,
                                step: 0.25
                            }}
                            value={
                                clientUser?.Policy?.RemoteClientBitrateLimit
                                && clientUser?.Policy?.RemoteClientBitrateLimit > 0 ?
                                    (
                                        clientUser?.Policy
                                            ?.RemoteClientBitrateLimit / 1e6
                                    ).toLocaleString(undefined, {
                                        maximumFractionDigits: 6
                                    }) :
                                    ''
                            }
                            name='RemoteClientBitrateLimit'
                            onChange={onRemoteClientBitrateLimitChange}
                            fullWidth
                        />

                        <FormHelperText>
                            {globalize.translate(
                                'LabelRemoteClientBitrateLimitHelp'
                            )}
                        </FormHelperText>

                        <FormHelperText>
                            {globalize.translate(
                                'LabelUserRemoteClientBitrateLimitHelp'
                            )}
                        </FormHelperText>
                    </Stack>
                </div>
            </div>

            <div className='verticalSection'>
                <div className='selectContainer fldSelectSyncPlayAccess'>
                    <Stack spacing={1}>
                        <InputLabel
                            className='inputLabel'
                            htmlFor='selectSyncPlayAccess-label'
                        >
                            {globalize.translate('LabelSyncPlayAccess')}
                        </InputLabel>
                        <Select
                            id='selectSyncPlayAccess'
                            name='SyncPlayAccess'
                            value={clientUser?.Policy?.SyncPlayAccess}
                            onChange={onSelectChange}
                        >
                            {getSyncPlayAccessOptions().map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            {globalize.translate('SyncPlayAccessHelp')}
                        </FormHelperText>
                    </Stack>
                </div>
            </div>

            <div className='verticalSection'>
                <h2
                    className='checkboxListLabel'
                    style={{ marginBottom: '1em' }}
                >
                    {globalize.translate('HeaderAllowMediaDeletionFrom')}
                </h2>
                <div className='checkboxList paperList checkboxList-paperList'>
                    <FormControlLabel
                        control={
                            <Checkbox
                                className='chkEnableDeleteAllFolders'
                                checked={
                                    clientUser?.Policy?.EnableContentDeletion
                                }
                                onChange={onFormChange}
                                name='EnableContentDeletion'
                            />
                        }
                        label={globalize.translate('AllLibraries')}
                    />

                    {!clientUser?.Policy?.EnableContentDeletion ? (
                        <div className='deleteAccess'>
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
                                                            ?.EnableContentDeletion
                                                        || clientUser?.Policy?.EnableContentDeletionFromFolders?.includes(
                                                            String(folder.Id)
                                                        )
                                                    }
                                                    onChange={
                                                        onContentDeletionFromFoldersChange
                                                    }
                                                    value={String(folder.Id)}
                                                />
                                            }
                                            label={folder.Name}
                                        />
                                    ))}

                                    {channels?.map((folder) => (
                                        <FormControlLabel
                                            key={folder.Id}
                                            control={
                                                <Checkbox
                                                    className='chkFolder'
                                                    checked={
                                                        !!clientUser?.Policy
                                                            ?.EnableContentDeletion
                                                        || clientUser?.Policy?.EnableContentDeletionFromFolders?.includes(
                                                            String(folder.Id)
                                                        )
                                                    }
                                                    onChange={
                                                        onContentDeletionFromFoldersChange
                                                    }
                                                    value={String(folder.Id)}
                                                />
                                            }
                                            label={folder.Name}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className='verticalSection'>
                <h2 className='checkboxListLabel'>
                    {globalize.translate('HeaderRemoteControl')}
                </h2>
                <div
                    className='checkboxList paperList'
                    style={{ padding: '.5em 1em' }}
                >
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableRemoteControlOtherUsers'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableRemoteControlOfOtherUsers
                                        }
                                        onChange={onFormChange}
                                        name='EnableRemoteControlOfOtherUsers'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowRemoteControlOthers'
                                )}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkRemoteControlSharedDevices'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableSharedDeviceControl
                                        }
                                        onChange={onFormChange}
                                        name='EnableSharedDeviceControl'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowRemoteSharedDevices'
                                )}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <FormHelperText>
                    {globalize.translate(
                        'OptionAllowMediaPlaybackTranscodingHelp'
                    )}
                </FormHelperText>
            </div>

            <div className='verticalSection'>
                <h2 className='checkboxListLabel'>
                    {globalize.translate('Other')}
                </h2>
                <div className='checkboxContainer checkboxContainer-withDescription'>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkEnableDownloading'
                                        checked={
                                            clientUser?.Policy
                                                ?.EnableContentDownloading
                                        }
                                        onChange={onFormChange}
                                        name='EnableContentDownloading'
                                    />
                                }
                                label={globalize.translate(
                                    'OptionAllowRemoteControlOthers'
                                )}
                            />
                        </FormGroup>
                        <FormHelperText>
                            {globalize.translate(
                                'OptionAllowContentDownloadHelp'
                            )}
                        </FormHelperText>
                    </FormControl>
                </div>

                <div
                    className='checkboxContainer checkboxContainer-withDescription'
                    id='fldIsEnabled'
                >
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkDisabled'
                                        checked={clientUser?.Policy?.IsDisabled}
                                        onChange={onFormChange}
                                        name='IsDisabled'
                                    />
                                }
                                label={globalize.translate('OptionDisableUser')}
                            />
                        </FormGroup>
                        <FormHelperText>
                            {globalize.translate('OptionDisableUserHelp')}
                        </FormHelperText>
                    </FormControl>
                </div>

                <div
                    className='checkboxContainer checkboxContainer-withDescription'
                    id='fldIsHidden'
                >
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className='chkIsHidden'
                                        checked={clientUser?.Policy?.IsHidden}
                                        onChange={onFormChange}
                                        name='IsHidden'
                                    />
                                }
                                label={globalize.translate('OptionHideUser')}
                            />
                        </FormGroup>
                        <FormHelperText>
                            {globalize.translate('OptionHideUserFromLoginHelp')}
                        </FormHelperText>
                    </FormControl>
                </div>
            </div>

            <br />
            <div className='verticalSection'>
                <div
                    className='inputContainer'
                    id='fldLoginAttemptsBeforeLockout'
                >
                    <Stack spacing={1}>
                        <InputLabel
                            className='inputLabel'
                            htmlFor='txtLoginAttemptsBeforeLockout'
                        >
                            {globalize.translate(
                                'LabelUserLoginAttemptsBeforeLockout'
                            )}
                        </InputLabel>
                        <OutlinedInput
                            id='txtLoginAttemptsBeforeLockout'
                            type='number'
                            inputProps={{
                                min: -1,
                                step: 1
                            }}
                            value={
                                clientUser?.Policy
                                    ?.LoginAttemptsBeforeLockout || 0
                            }
                            name='LoginAttemptsBeforeLockout'
                            onChange={onFormChange}
                            fullWidth
                        />

                        <FormHelperText>
                            {globalize.translate(
                                'OptionLoginAttemptsBeforeLockout'
                            )}
                        </FormHelperText>

                        <FormHelperText>
                            {globalize.translate(
                                'OptionLoginAttemptsBeforeLockoutHelp'
                            )}
                        </FormHelperText>
                    </Stack>
                </div>
            </div>

            <br />
            <div className='verticalSection'>
                <div className='inputContainer' id='fldMaxActiveSessions'>
                    <Stack spacing={1}>
                        <InputLabel
                            className='inputLabel'
                            htmlFor='txtMaxActiveSessions'
                        >
                            {globalize.translate('LabelUserMaxActiveSessions')}
                        </InputLabel>
                        <OutlinedInput
                            id='txtMaxActiveSessions'
                            type='number'
                            inputProps={{
                                min: 0,
                                step: 1
                            }}
                            value={clientUser?.Policy?.MaxActiveSessions || 0}
                            name='MaxActiveSessions'
                            onChange={onFormChange}
                            fullWidth
                        />

                        <FormHelperText>
                            {globalize.translate('OptionMaxActiveSessions')}
                        </FormHelperText>

                        <FormHelperText>
                            {globalize.translate('OptionMaxActiveSessionsHelp')}
                        </FormHelperText>
                    </Stack>
                </div>
            </div>

            <br />

            <div>
                <Stack spacing={2} direction='column'>
                    <Button
                        type='submit'
                        className='emby-button raised button-submit block'
                    >
                        {globalize.translate('Save')}
                    </Button>
                    <Button
                        type='button'
                        id='btnCancel'
                        className='emby-button raised button-cancel block'
                        onClick={onBtnCancelClick}
                    >
                        {globalize.translate('ButtonCancel')}
                    </Button>
                </Stack>
            </div>
        </form>
    );
};

export default UserProfileForm;
