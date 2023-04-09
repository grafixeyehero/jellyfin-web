import type { UserDto } from '@jellyfin/sdk/lib/generated-client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import UserParentalControlForm from '../../components/dashboard/users/UserParentalControlForm';
import Loading from '../../components/loading/LoadingComponent';
import toast from '../../components/toast/toast';
import { useGetUserById, useUpdateUserPolicy } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';

const UserParentalControl: FC = () => {
    const location = useLocation();
    const { userId } = location.state;

    const updateUserPolicy = useUpdateUserPolicy();

    const { isLoading, data: serverUser } = useGetUserById({
        userId: userId
    });

    const [clientUser, setClientUser] = useState<UserDto | null | undefined>(
        null
    );

    const element = useRef<HTMLDivElement>(null);

    const handleUpdateUserPolicy = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();

            updateUserPolicy.mutate(
                {
                    userId: userId || '',
                    userPolicy:{
                        ...clientUser?.Policy
                    } || {}
                },
                {
                    onSuccess: async () => {
                        toast(globalize.translate('SettingsSaved'));
                    }
                }
            );
        },
        [clientUser, updateUserPolicy, userId]
    );

    useEffect(() => {
        setClientUser(serverUser);
    }, [serverUser]);

    if (isLoading || !clientUser) return <Loading />;

    return (
        <div ref={element}>
            <UserParentalControlForm
                clientUser={clientUser}
                setClientUser={setClientUser}
                onFormSubmit={handleUpdateUserPolicy}
            />
        </div>
    );
};

export default UserParentalControl;
