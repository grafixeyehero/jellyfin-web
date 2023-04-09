import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';

import UserPasswordForm from '../../components/dashboard/users/UserPasswordForm';

const UserPassword: FC = () => {
    const location = useLocation();
    const { userId } = location.state;

    return (
        <div className='readOnlyContent'>
            <UserPasswordForm userId={userId} />
        </div>
    );
};

export default UserPassword;
