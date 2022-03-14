import './MovieCard.scss';

import React, {
    FunctionComponent,
    useEffect,
    useRef,
    useState
} from 'react';

import ServerConnections from '../ServerConnections';

type IProps = {
    item?: Record<string, any>;
};

const MovieCard: FunctionComponent<IProps> = ({item = {}}: IProps) => {
    const element = useRef(null);
    const [dataImage, setImage] = useState();

    useEffect(() => {
        const serverId = item.ServerId;
        const apiClient = ServerConnections.getApiClient(serverId);
        const imageTags = item.ImageTags || {};
        const imageWidth = 800;
        let url: any;
        if (imageTags.Primary) {
            url = apiClient.getScaledImageUrl(item.Id, {
                type: 'Primary',
                width: imageWidth,
                tag: item.ImageTags.Primary
            });
        } else if (imageTags.Thumb) {
            url = apiClient.getScaledImageUrl(item.Id, {
                type: 'Thumb',
                width: imageWidth,
                tag: item.ImageTags.Thumb
            });
        } else if (imageTags.Disc) {
            url = apiClient.getScaledImageUrl(item.Id, {
                type: 'Disc',
                width: imageWidth,
                tag: item.ImageTags.Disc
            });
        } else if (item.AlbumId && item.AlbumPrimaryImageTag) {
            url = apiClient.getScaledImageUrl(item.AlbumId, {
                type: 'Primary',
                width: imageWidth,
                tag: item.AlbumPrimaryImageTag
            });
        } else if (item.BackdropImageTags && item.BackdropImageTags.length) {
            url = apiClient.getScaledImageUrl(item.Id, {
                type: 'Backdrop',
                width: imageWidth,
                tag: item.BackdropImageTags[0]
            });
        }
        setImage(url);
    }, [item.AlbumId, item.AlbumPrimaryImageTag, item.BackdropImageTags, item.Id, item.ImageTags, item.ServerId]);
    return (
        <div ref={element} className='card-item'>
            <div className='card-inner'>
                <div className='card-top'>
                    <img src={dataImage} alt={item.Name} />
                </div>
                <div className='card-bottom'>
                    <div className='card-info'>
                        <h4>{item.Name}</h4>
                        <p>{item.ProductionYear}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
