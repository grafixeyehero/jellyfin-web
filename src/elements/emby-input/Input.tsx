import classNames from 'classnames';

import React, {
    FC,
    DetailedHTMLProps,
    InputHTMLAttributes,
    useState,
    useCallback,
    useRef
} from 'react';
import globalize from '../../scripts/globalize';
import './emby-input.scss';

interface InputProps
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    labelTitle?: string;
    labelClassName?: string;
}

const Input: FC<InputProps> = ({
    labelTitle,
    type,
    labelClassName,
    className,
    id,
    value,
    onChange,
    ...rest
}) => {
    const [isFocus, setIsFocus] = useState(false);
    const [isBlur, setIsBlur] = useState(false);
    const labelRef = useRef<HTMLLabelElement>(null);

    const focusHandler = useCallback(() => {
        setIsFocus(true);
        setIsBlur(false);
    }, []);

    const blurHandler = useCallback(() => {
        setIsFocus(false);
        setIsBlur(true);
    }, []);

    const labelClass = classNames(
        'inputLabel',
        labelClassName,
        { inputLabelFocused: isFocus },
        { inputLabelUnfocused: isBlur }
    );

    return (
        <div>
            {labelTitle && (
                <label ref={labelRef} className={labelClass}>
                    {globalize.translate(labelTitle)}
                </label>
            )}
            <input
                type={type}
                id={id}
                className={classNames('emby-input', className)}
                value={value}
                onFocus={focusHandler}
                onBlur={blurHandler}
                onChange={onChange}
                {...rest}
            />
        </div>
    );
};

export default Input;
