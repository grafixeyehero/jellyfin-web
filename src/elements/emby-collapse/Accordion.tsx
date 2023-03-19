import React, { useCallback, DetailedHTMLProps, HTMLAttributes, useState } from 'react';
import './emby-collapse.scss';
import '../emby-button/emby-button';

interface AccordionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>,
HTMLDivElement
  > {
    open?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
    open,
    title,
    children
}) => {
    const [isOpen, setIsOpen] = useState(open);

    const toogleHandler = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return (
        <>
            <div className='emby-collapse'>
                <button
                    type='button'
                    onClick={toogleHandler}
                    id='expandButton'
                    className='emby-collapsible-button iconRight emby-button'
                >
                    <h3
                        className='emby-collapsible-title'
                    >
                        {title}
                    </h3>
                    <span
                        className={`material-icons emby-collapse-expandIcon expand_more ${
                            isOpen
                                ? 'emby-collapse-expandIconExpanded'
                                : ''
                        }`}
                        aria-hidden='true'
                    />

                </button>
                {isOpen && (
                    <div className='collapseContent expanded' style={{height: 'auto'}}>
                        {children}
                    </div>
                )
                }
            </div>
        </>
    );
};

export default Accordion;
