import React, { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { CreateUserByName } from '@jellyfin/sdk/lib/generated-client';
import { Link } from '@mui/material';

import UserNewProfileForm from '../../components/dashboard/users/UserNewProfileForm';
import loading from '../../components/loading/loading';
import Page from '../../components/Page';
import toast from '../../components/toast/toast';
import { useCreateUserByName } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';

const UserNew: FC = () => {
    const navigate = useNavigate();

    const createUserByName = useCreateUserByName();

    const [userInput, setUserInput] = useState<CreateUserByName>({
        Name: '',
        Password: ''
    });

    const saveUser = useCallback(() => {
        createUserByName.mutate(
            {
                createUserByName: userInput
            },
            {
                onSuccess: async (user) => {
                    const id = user?.Id;
                    if (!id) {
                        throw new Error('Unexpected null user.Id');
                    }
                    setUserInput({
                        Name: '',
                        Password: ''
                    });
                    navigate('/useredit/profile', {
                        state: {
                            userId: id,
                            tabId: 'profile'
                        }
                    });
                    toast(globalize.translate('SettingsSaved'));
                },
                onError: async () => {
                    toast(globalize.translate('ErrorDefault'));
                    loading.hide();
                }
            }
        );
    }, [createUserByName, navigate, userInput]);

    const onNewUserProfileFormSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            loading.show();
            saveUser();
            e.preventDefault();
            e.stopPropagation();
            return false;
        },
        [saveUser]
    );

    return (
        <Page id='newUserPage' className='mainAnimatedPage type-interior'>
            <div className='content-primary'>
                <div className='verticalSection'>
                    <div className='sectionTitleContainer flex align-items-center'>
                        <h2 className='sectionTitle'>
                            {globalize.translate('HeaderAddUser')}
                        </h2>

                        <Link
                            className='emby-button raised button-alt headerHelpButton'
                            href='https://jellyfin.org/docs/general/server/users/'
                            underline='hover'
                        >
                            {globalize.translate('Help')}
                        </Link>
                    </div>
                </div>

                <UserNewProfileForm
                    userInput={userInput}
                    setUserInput={setUserInput}
                    onFormSubmit={onNewUserProfileFormSubmit}
                />
            </div>
        </Page>
    );
};

export default UserNew;
