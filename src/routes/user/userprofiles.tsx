import '../../elements/emby-button/emby-button';
import '../../elements/emby-button/paper-icon-button-light';
import '../../components/cardbuilder/card.scss';
import '../../components/indicators/indicators.scss';
import '../../styles/flexstyles.scss';

import React, { FC, useCallback, useRef } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { IconButton, Link } from '@mui/material';

import UserCardBox from '../../components/dashboard/users/UserCardBox';
import Loading from '../../components/loading/LoadingComponent';
import Page from '../../components/Page';
import { useGetUsers } from '../../hooks/useFetchItems';
import globalize from '../../scripts/globalize';
import { useNavigate } from 'react-router-dom';

const UserProfiles: FC = () => {
    const element = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isLoading, data: users } = useGetUsers({});

    const onBtnAddUserClick = useCallback(() => {
        navigate('/usernew');
    }, [navigate]);

    if (isLoading) return <Loading />;

    return (
        <Page
            id='userProfilesPage'
            className='mainAnimatedPage type-interior userProfilesPage fullWidthContent'
        >
            <div ref={element} className='content-primary'>
                <div className='verticalSection'>
                    <div className='sectionTitleContainer flex align-items-center'>
                        <h2 className='sectionTitle'>
                            {globalize.translate('HeaderUsers')}
                        </h2>

                        <IconButton
                            title={globalize.translate('ButtonAddUser')}
                            className='emby-button btnAddUser fab submit sectionTitleButton'
                            onClick={onBtnAddUserClick}
                        >
                            <AddIcon />
                        </IconButton>

                        <Link
                            className='emby-button raised button-alt headerHelpButton'
                            href='https://jellyfin.org/docs/general/server/users/adding-managing-users'
                            underline='hover'
                        >
                            {globalize.translate('Help')}
                        </Link>

                    </div>
                </div>

                <div className='localUsers itemsContainer vertical-wrap'>
                    {users?.map((user) => (
                        <UserCardBox key={user.Id} user={user} />
                    ))}
                </div>
            </div>
        </Page>
    );
};

export default UserProfiles;
