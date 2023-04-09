import type { UserDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Link } from '@mui/material';

import UserProfileForm from '../../components/dashboard/users/UserProfileForm';
import Loading from '../../components/loading/LoadingComponent';
import toast from '../../components/toast/toast';
import {
    useGetUserById,
    useUpdateUser,
    useUpdateUserPolicy
} from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';
import { useQueryClient } from '@tanstack/react-query';

const UserProfile: FC = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const { userId } = location.state;

    const { isLoading, data: serverUser } = useGetUserById({ userId: userId });
    const updateUser = useUpdateUser();
    const updateUserPolicy = useUpdateUserPolicy();

    const element = useRef<HTMLDivElement>(null);
    const [clientUser, setClientUser] = useState<UserDto | null | undefined>(
        null
    );

    const handleUpdateUserPolicy = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();

            updateUser.mutate(
                {
                    userId: userId || '',
                    userDto:
                        {
                            ...clientUser,
                            Name: clientUser?.Name
                        } || {}
                },
                {
                    onSuccess: async () => {
                        updateUserPolicy.mutate(
                            {
                                userId: userId || '',
                                userPolicy:
                                    {
                                        ...clientUser?.Policy,
                                        RemoteClientBitrateLimit: Math.floor(
                                            1e6
                                                * (clientUser?.Policy
                                                    ?.RemoteClientBitrateLimit
                                                    || 0)
                                        ),
                                        LoginAttemptsBeforeLockout:
                                            clientUser?.Policy
                                                ?.LoginAttemptsBeforeLockout
                                            || 0,
                                        MaxActiveSessions:
                                            clientUser?.Policy
                                                ?.MaxActiveSessions || 0,
                                        EnableContentDeletionFromFolders:
                                            clientUser?.Policy
                                                ?.EnableContentDeletion ?
                                                [] :
                                                clientUser?.Policy
                                                    ?.EnableContentDeletionFromFolders
                                    } || {}
                            },
                            {
                                onSuccess: async () => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['Users']
                                    });
                                    toast(globalize.translate('SettingsSaved'));
                                }
                            }
                        );
                    }
                }
            );
        },
        [clientUser, queryClient, updateUser, updateUserPolicy, userId]
    );

    useEffect(() => {
        setClientUser(serverUser);
    }, [serverUser]);

    if (isLoading || !clientUser) return <Loading />;

    return (
        <div ref={element}>
            <div
                className='lnkEditUserPreferencesContainer'
                style={{ paddingBottom: '1em' }}
            >
                <Link
                    className='lnkEditUserPreferences button-link'
                    href={`#/mypreferencesmenu.html?userId=${userId}`}
                    underline='hover'
                >
                    {globalize.translate('ButtonEditOtherUserPreferences')}
                </Link>
            </div>

            <UserProfileForm
                clientUser={clientUser}
                setClientUser={setClientUser}
                onFormSubmit={handleUpdateUserPolicy}
            />
        </div>
    );
};

export default UserProfile;
