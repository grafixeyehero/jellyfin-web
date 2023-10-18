import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client';

import React, { FC } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import BookIcon from '@mui/icons-material/Book';
import FolderIcon from '@mui/icons-material/Folder';
import CollectionsIcon from '@mui/icons-material/Collections';
import QueueIcon from '@mui/icons-material/Queue';
import PhotoIcon from '@mui/icons-material/Photo';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';

interface ItemTypeIconProps {
    itemType: BaseItemKind
}

const ItemTypeIcon: FC<ItemTypeIconProps> = ({
    itemType
}) => {
    switch (itemType) {
        case BaseItemKind.MusicAlbum:
            return <AlbumIcon className='cardImageIcon' />;
        case BaseItemKind.MusicArtist:
        case BaseItemKind.Person:
            return <PersonIcon className='cardImageIcon' />;
        case BaseItemKind.Audio:
            return <AudiotrackIcon className='cardImageIcon' />;
        case BaseItemKind.Movie:
            return <MovieIcon className='cardImageIcon' />;
        case BaseItemKind.Episode:
        case BaseItemKind.Series:
            return <TvIcon className='cardImageIcon' />;
        case BaseItemKind.Program:
            return <LiveTvIcon className='cardImageIcon' />;
        case BaseItemKind.Book:
            return <BookIcon className='cardImageIcon' />;
        case BaseItemKind.Folder:
            return <FolderIcon className='cardImageIcon' />;
        case BaseItemKind.BoxSet:
            return <CollectionsIcon className='cardImageIcon' />;
        case BaseItemKind.Playlist:
            return <QueueIcon className='cardImageIcon' />;
        case BaseItemKind.Photo:
            return <PhotoIcon className='cardImageIcon' />;
        case BaseItemKind.PhotoAlbum:
            return <PhotoAlbumIcon className='cardImageIcon' />;
        default:
            return null;
    }
};

export default ItemTypeIcon;
