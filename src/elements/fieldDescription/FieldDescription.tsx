import classNames from 'classnames';
import * as React from 'react';
import globalize from '../../scripts/globalize';

interface FieldDescriptionProps {
    className?: string;
    description?: string;
}

const FieldDescription: React.FC<FieldDescriptionProps> = ({
    className,
    description,
    ...rest
}) => {
    const cssClass = classNames(
        'fieldDescription',
        className
    );
    return (
        <div
            className={cssClass}
            {...rest}
        >
            {globalize.translate(description)}
        </div>
    );
};

export { FieldDescription };
