import React, { Component } from 'react';
import ItemsContainerElement from '../../components/dashboard/users/ItemsContainerElement';
import PaperButtonElement from '../../components/dashboard/users/PaperButtonElement';

export class Collections extends Component {
    render() {
        return (
            <div>
                Collections

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSelectView autoSize'
                        title='ButtonSelectView'
                        icon='material-icons view_comfy'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        className='btnSort autoSize'
                        title='Sort'
                        icon='material-icons sort_by_alpha'
                    />
                    <PaperButtonElement
                        is='paper-icon-button-light'
                        type='button'
                        className='btnNewCollection autoSize'
                        title='add'
                        icon='material-icons add'
                    />

                </div>

                <ItemsContainerElement
                    id=''
                    className='itemsContainer vertical-wrap centered padded-left padded-right'
                />

                <div className='flex align-items-center justify-content-center flex-wrap-wrap padded-top padded-left padded-right padded-bottom focuscontainer-x'>
                    <div className='paging'></div>
                </div>

            </div>
        );
    }
}

export default Collections;
