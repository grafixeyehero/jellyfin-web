import { BaseItemDto } from '@thornbill/jellyfin-sdk/dist/generated-client';
import React, { FunctionComponent, useEffect, useState } from 'react';
//import ItemsContainerElement from '../../components/dashboard/users/ItemsContainerElement';
//import PaperButtonElement from '../../components/dashboard/users/PaperButtonElement';
import MovieCard from '../../components/MovieCard/MovieCard';
import './MovieListing.scss';

type MoviesProps = {
    topParentId?: string,
};

const Movies: FunctionComponent<MoviesProps> = ({ topParentId }: MoviesProps) => {
    console.log('props', topParentId);

    const [items, setItems] = useState<BaseItemDto[]>([]);

    useEffect(() => {
        const query = {
            SortBy: 'SortName,ProductionYear',
            SortOrder: 'Ascending',
            IncludeItemTypes: 'Movie',
            Recursive: true,
            Fields: 'PrimaryImageAspectRatio,MediaSourceCount,BasicSyncInfo',
            ImageTypeLimit: 1,
            EnableImageTypes: 'Primary,Backdrop,Banner,Thumb',
            StartIndex: 0,
            ParentId: topParentId
        };

        window.ApiClient.getItems(window.ApiClient.getCurrentUserId(), query).then((result) => {
            setItems(result.Items || []);
            console.log('setItems', result.Items);
        });
    }, [topParentId]);

    return (
        <div>
                Movies

            <div className='movie-container'>
                {items.map((item, index) => (
                    <MovieCard key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Movies;
