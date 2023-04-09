import type { UserDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    OutlinedInput,
    Stack
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import { useQueryClient } from '@tanstack/react-query';

import {
    useGetCurrentUser,
    useGetUserById,
    useUpdateUserConfiguration,
    useUpdateUserEasyPassword,
    useUpdateUserPassword
} from '../../../hooks/useFetchItems';
import globalize from '../../../scripts/globalize';
import Dashboard from '../../../utils/dashboard';
import confirm from '../../confirm/confirm';
import loading from '../../loading/loading';
import Loading from '../../loading/LoadingComponent';
import toast from '../../toast/toast';

interface UserPasswordFormProps {
    userId: string;
}

const UserPasswordForm: FC<UserPasswordFormProps> = ({ userId }) => {
    const element = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const updateUserConfiguration = useUpdateUserConfiguration();
    const updateUserPassword = useUpdateUserPassword();
    const updateUserEasyPassword = useUpdateUserEasyPassword();
    const { isLoading, data: serverUser } = useGetUserById({
        userId: userId
    });

    const { isLoading: isCurrentUserLoading, data: currentUser } =
        useGetCurrentUser();

    const [clientUser, setClientUser] = useState<UserDto | null | undefined>(
        null
    );

    const [currentPassword, setCurrentPassword] = useState<string>('');

    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');

    const [easyPassword, setEasyPassword] = useState<string>('');

    const onCurrentPasswordChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentPassword(event.target.value);
        },
        []
    );

    const onNewPasswordChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setNewPassword(event.target.value);
        },
        []
    );

    const onNewPasswordConfirmChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setNewPasswordConfirm(event.target.value);
        },
        []
    );

    const onEasyPasswordChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setEasyPassword(event.target.value);
        },
        []
    );

    const onFormChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const target = event.target;
            const name = target.name;
            const value =
                target.type === 'checkbox' ? target.checked : target.value;
            setClientUser((prevState) => ({
                ...prevState,
                Configuration: {
                    ...prevState?.Configuration,
                    [name]: value
                }
            }));
        },
        [setClientUser]
    );

    const savePassword = useCallback(() => {
        const id = clientUser?.Id;

        if (!id) {
            throw new Error('Unexpected null user.Id');
        }

        updateUserPassword.mutate(
            {
                userId: id,
                updateUserPassword: {
                    CurrentPw: currentPassword,
                    NewPw: newPassword
                }
            },
            {
                onSuccess: async () => {
                    loading.hide();
                    toast(globalize.translate('PasswordSaved'));
                    queryClient.invalidateQueries({ queryKey: ['Users'] });
                },
                onError: async () => {
                    loading.hide();
                    Dashboard.alert({
                        title: globalize.translate('HeaderLoginFailure'),
                        message: globalize.translate('MessageInvalidUser')
                    });
                }
            }
        );
    }, [clientUser?.Id, currentPassword, newPassword, queryClient, updateUserPassword]);

    const onUpdatePasswordSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            if (newPassword != newPasswordConfirm) {
                toast(globalize.translate('PasswordMatchError'));
            } else {
                loading.show();
                savePassword();
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        },
        [newPassword, newPasswordConfirm, savePassword]
    );

    const onEasyPasswordSaved = useCallback(() => {
        const configuration = clientUser?.Configuration;
        const id = clientUser?.Id;

        if (!configuration) {
            throw new Error('Unexpected null user.Configuration');
        }

        if (!id) {
            throw new Error('Unexpected null user.Id');
        }
        updateUserConfiguration.mutate(
            {
                userId: id,
                userConfiguration: {
                    ...configuration,
                    EnableLocalPassword:
                        clientUser?.Configuration?.EnableLocalPassword
                }
            },
            {
                onSuccess: async () => {
                    loading.hide();
                    toast(globalize.translate('SettingsSaved'));
                    queryClient.invalidateQueries({ queryKey: ['Users'] });
                }
            }
        );
    }, [
        clientUser?.Configuration,
        clientUser?.Id,
        queryClient,
        updateUserConfiguration
    ]);

    const onLocalAccessSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            loading.show();
            if (easyPassword) {
                const id = clientUser?.Id;

                if (!id) {
                    throw new Error('Unexpected null user.Id');
                }
                updateUserEasyPassword.mutate(
                    {
                        userId: id,
                        updateUserEasyPassword: {
                            NewPw: easyPassword
                        }
                    },
                    {
                        onSuccess: async () => {
                            onEasyPasswordSaved();
                        }
                    }
                );
            } else {
                onEasyPasswordSaved();
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        },
        [clientUser?.Id, easyPassword, onEasyPasswordSaved, updateUserEasyPassword]
    );

    const onBtnResetEasyPasswordClick = useCallback(() => {
        const msg = globalize.translate('PinCodeResetConfirmation');

        confirm(msg, globalize.translate('HeaderPinCodeReset')).then(
            function () {
                loading.show();
                const id = clientUser?.Id;

                if (!id) {
                    throw new Error('Unexpected null user.Id');
                }
                updateUserEasyPassword.mutate(
                    {
                        userId: id,
                        updateUserEasyPassword: {
                            ResetPassword: true
                        }
                    },
                    {
                        onSuccess: async () => {
                            loading.hide();
                            Dashboard.alert({
                                message: globalize.translate(
                                    'PinCodeResetComplete'
                                ),
                                title: globalize.translate(
                                    'HeaderPinCodeReset'
                                )
                            });
                            queryClient.invalidateQueries({
                                queryKey: ['Users']
                            });
                        }
                    }
                );
            }
        );
    }, [clientUser?.Id, queryClient, updateUserEasyPassword]);

    const onBtnResetPasswordClick = useCallback(() => {
        const msg = globalize.translate('PasswordResetConfirmation');
        confirm(msg, globalize.translate('ResetPassword')).then(function () {
            loading.show();
            const id = clientUser?.Id;

            if (!id) {
                throw new Error('Unexpected null user.Id');
            }
            updateUserPassword.mutate(
                {
                    userId: id,
                    updateUserPassword: {
                        ResetPassword: true
                    }
                },
                {
                    onSuccess: async () => {
                        loading.hide();
                        Dashboard.alert({
                            message: globalize.translate(
                                'PasswordResetComplete'
                            ),
                            title: globalize.translate('ResetPassword')
                        });
                        queryClient.invalidateQueries({ queryKey: ['Users'] });
                    }
                }
            );
        });
    }, [clientUser?.Id, queryClient, updateUserPassword]);

    useEffect(() => {
        setClientUser(serverUser);
        import('../../autoFocuser').then(({ default: autoFocuser }) => {
            autoFocuser.autoFocus(element.current);
        });
    }, [serverUser]);

    if (isLoading || !clientUser || isCurrentUserLoading) return <Loading />;

    return (
        <div ref={element}>
            {(currentUser?.Policy?.IsAdministrator
                || clientUser?.Policy?.EnableUserPreferenceAccess) && (
                <form
                    className='updatePasswordForm passwordSection'
                    style={{ margin: '0 auto 2em' }}
                    onSubmit={onUpdatePasswordSubmit}
                >
                    <div className='detailSection'>
                        {clientUser?.HasConfiguredPassword && (
                            <div
                                id='fldCurrentPassword'
                                className='inputContainer'
                            >
                                <InputLabel
                                    className='inputLabel'
                                    htmlFor='txtLoginAttemptsBeforeLockout'
                                >
                                    {globalize.translate(
                                        'LabelCurrentPassword'
                                    )}
                                </InputLabel>
                                <OutlinedInput
                                    id='txtCurrentPassword'
                                    type='password'
                                    inputProps={{
                                        autoComplete: 'false'
                                    }}
                                    value={currentPassword}
                                    onChange={onCurrentPasswordChange}
                                    required
                                    fullWidth
                                />
                            </div>
                        )}
                        <div className='inputContainer'>
                            <InputLabel
                                className='inputLabel'
                                htmlFor='txtLoginAttemptsBeforeLockout'
                            >
                                {globalize.translate('LabelNewPassword')}
                            </InputLabel>
                            <OutlinedInput
                                id='txtNewPassword'
                                type='password'
                                inputProps={{
                                    autoComplete: 'false'
                                }}
                                value={newPassword}
                                onChange={onNewPasswordChange}
                                fullWidth
                            />
                        </div>
                        <div className='inputContainer'>
                            <InputLabel
                                className='inputLabel'
                                htmlFor='txtLoginAttemptsBeforeLockout'
                            >
                                {globalize.translate('LabelNewPasswordConfirm')}
                            </InputLabel>
                            <OutlinedInput
                                id='txtNewPasswordConfirm'
                                type='password'
                                inputProps={{
                                    autoComplete: 'false'
                                }}
                                value={newPasswordConfirm}
                                onChange={onNewPasswordConfirmChange}
                                fullWidth
                            />
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
                                {clientUser?.HasConfiguredPassword
                                    && !clientUser?.Policy?.IsAdministrator && (
                                    <Button
                                        type='button'
                                        id='btnResetPassword'
                                        className='emby-button raised button-cancel block'
                                        onClick={onBtnResetPasswordClick}
                                    >
                                        {globalize.translate(
                                            'ResetPassword'
                                        )}
                                    </Button>
                                )}
                            </Stack>
                        </div>
                    </div>
                </form>
            )}
            <br />
            {clientUser?.HasConfiguredPassword
                && (currentUser?.Policy?.IsAdministrator
                    || clientUser?.Policy?.EnableUserPreferenceAccess) && (
                <form
                    className='localAccessForm localAccessSection'
                    style={{ margin: '0 auto' }}
                    onSubmit={onLocalAccessSubmit}
                >
                    <div className='detailSection'>
                        <div className='detailSectionHeader'>
                            {globalize.translate('HeaderEasyPinCode')}
                        </div>
                        <br />
                        <div>{globalize.translate('EasyPasswordHelp')}</div>
                        <br />
                        <div className='inputContainer'>
                            <InputLabel
                                className='inputLabel'
                                htmlFor='txtLoginAttemptsBeforeLockout'
                            >
                                {globalize.translate('LabelEasyPinCode')}
                            </InputLabel>
                            <OutlinedInput
                                id='txtEasyPassword'
                                inputProps={{
                                    inputMode: 'numeric',
                                    autoComplete: 'false',
                                    pattern: '[0-9]*',
                                    maxLength: 5
                                }}
                                placeholder={
                                    clientUser?.HasConfiguredEasyPassword ?
                                        '******' :
                                        ''
                                }
                                value={easyPassword}
                                onChange={onEasyPasswordChange}
                                fullWidth
                            />
                        </div>
                        <br />
                        <div className='checkboxContainer checkboxContainer-withDescription'>
                            <FormControl>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                className='chkEnableLocalEasyPassword'
                                                checked={
                                                    clientUser
                                                        ?.Configuration
                                                        ?.EnableLocalPassword
                                                }
                                                onChange={onFormChange}
                                                name='EnableLocalPassword'
                                            />
                                        }
                                        label={globalize.translate(
                                            'LabelInNetworkSignInWithEasyPassword'
                                        )}
                                    />
                                </FormGroup>
                                <FormHelperText>
                                    {globalize.translate(
                                        'LabelInNetworkSignInWithEasyPasswordHelp'
                                    )}
                                </FormHelperText>
                            </FormControl>
                        </div>

                        <div>
                            <Stack spacing={2} direction='column'>
                                <Button
                                    type='submit'
                                    className='emby-button raised button-submit block'
                                >
                                    {globalize.translate('Save')}
                                </Button>
                                {clientUser?.HasConfiguredEasyPassword && (
                                    <Button
                                        type='button'
                                        id='btnResetEasyPassword'
                                        className='emby-button raised button-cancel block'
                                        onClick={
                                            onBtnResetEasyPasswordClick
                                        }
                                    >
                                        {globalize.translate(
                                            'ButtonResetEasyPassword'
                                        )}
                                    </Button>
                                )}
                            </Stack>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserPasswordForm;
