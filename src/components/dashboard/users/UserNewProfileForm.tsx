import type { CreateUserByName } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, OutlinedInput, Stack } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';

import globalize from '../../../scripts/globalize';

interface UserNewProfileFormProps {
    userInput: CreateUserByName;
    setUserInput: React.Dispatch<React.SetStateAction<CreateUserByName>>;
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UserNewProfileForm: FC<UserNewProfileFormProps> = ({
    userInput,
    setUserInput,
    onFormSubmit
}) => {
    const navigate = useNavigate();

    const onUserInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const target = event.target;
            const name = target.name;
            const value = target.value;
            setUserInput((prevState) => ({
                ...prevState,
                [name]: value
            }));
        },
        [setUserInput]
    );

    const onBtnCancelClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <form onSubmit={onFormSubmit} className='newUserProfileForm'>
            <div className='inputContainer'>
                <InputLabel className='inputLabel' htmlFor='txtUserName'>
                    {globalize.translate('LabelName')}
                </InputLabel>
                <OutlinedInput
                    id='txtUserName'
                    type='text'
                    value={userInput.Name}
                    name='Name'
                    onChange={onUserInputChange}
                    required
                    fullWidth
                />
            </div>
            <div className='inputContainer'>
                <InputLabel className='inputLabel' htmlFor='txtPassword'>
                    {globalize.translate('LabelPassword')}
                </InputLabel>
                <OutlinedInput
                    id='txtPassword'
                    type='password'
                    value={userInput.Password}
                    name='Password'
                    onChange={onUserInputChange}
                    fullWidth
                />
            </div>
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

export default UserNewProfileForm;
