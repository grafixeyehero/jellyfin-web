import React, { Component } from 'react';
import ItemsContainerElement from '../../components/dashboard/users/ItemsContainerElement';
import globalize from '../../scripts/globalize';

export class Suggestions extends Component {
    render() {
        return (
            <div>
                Suggestions

                <div id='resumableSection' className='verticalSection hide'>
                    <div className='sectionTitleContainer sectionTitleContainer-cards'>
                        <h2 className='sectionTitle sectionTitle-cards padded-left'>
                            {globalize.translate('HeaderContinueWatching')}
                        </h2>
                    </div>

                    <ItemsContainerElement
                        id='resumableItems'
                        className='itemsContainer padded-left padded-right'
                    />

                </div>

                <div className='verticalSection'>
                    <div className='sectionTitleContainer sectionTitleContainer-cards'>
                        <h2 className='sectionTitle sectionTitle-cards padded-left'>
                            {globalize.translate('HeaderLatestMovies')}
                        </h2>
                    </div>

                    <ItemsContainerElement
                        id='recentlyAddedItems'
                        className='itemsContainer padded-left padded-right'
                    />

                </div>

                <div className='recommendations'>
                </div>
                <div className='noItemsMessage hide padded-left padded-right'>
                    <br />
                    <p>
                        {globalize.translate('MessageNoMovieSuggestionsAvailable')}
                    </p>
                </div>

            </div>
        );
    }
}

export default Suggestions;
