import React, { Component } from 'react';
import ItemsContainerElement from '../../components/dashboard/users/ItemsContainerElement';
import PaperButtonElement from '../../components/dashboard/users/PaperButtonElement';

export class Trailers extends Component {
    render() {
        return (
            <div>
                Trailers

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>

                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSort autoSize'
                        title='Sort'
                        icon='material-icons sort_by_alpha'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnFilter autoSize'
                        title='Filter'
                        icon='material-icons filter_list'
                    />

                </div>

                <div className='alphaPicker alphaPicker-fixed alphaPicker-fixed-right alphaPicker-vertical'>
                </div>

                <ItemsContainerElement
                    id=''
                    className='itemsContainer vertical-wrap padded-left padded-right'
                />

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                </div>

            </div>
        );
    }
}

export default Trailers;
