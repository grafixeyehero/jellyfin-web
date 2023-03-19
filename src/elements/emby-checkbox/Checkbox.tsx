import classNames from 'classnames';

import React, { FC, DetailedHTMLProps, InputHTMLAttributes, useRef, useEffect, useCallback } from 'react';
import browser from '../../scripts/browser';
import dom from '../../scripts/dom';
import './emby-checkbox.scss';

interface CheckboxProps
    extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
    > {
        label?: string;
        labelClassName?: string;
        inputClassName?: string;
        dataOutLineClass?: string;
        dataCheckedIcon?: string;
        dataUnCheckedIcon?: string;
}

const Checkbox: FC<CheckboxProps> = ({
    checked,
    label,
    labelClassName,
    className,
    dataOutLineClass,
    dataCheckedIcon,
    dataUnCheckedIcon,
    value,
    onChange,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const enableRefreshHack = browser.tizen || browser.orsay || browser.operaTv || browser.web0s ? true : false;

    const forceRefresh = (loading: boolean) => {
        const labelElem = labelRef.current as HTMLLabelElement;
        labelElem.style.animationName = 'repaintChrome';
        labelElem.style.animationDelay = (loading === true ? '500ms' : '');
        labelElem.style.animationDuration = '10ms';
        labelElem.style.animationIterationCount = '1';

        setTimeout(function () {
            labelElem.style.animationName = '';
        }, (loading === true ? 520 : 20));
    };

    const keyDownHandler = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        const inputElem = inputRef.current as HTMLInputElement;
        if (event.code === 'Enter' || (event.code === 'Space' && browser.tizen)) {
            event.preventDefault();
            inputElem.checked = !inputElem.checked;

            inputElem.dispatchEvent(new CustomEvent('change', {
                bubbles: true
            }));

            return false;
        }
    }, []);

    useEffect(() => {
        const inputElem = inputRef.current;

        if (!inputElem) {
            console.error('Unexpected null reference');
            return;
        }
        //inputElem.addEventListener('keydown', handler);
        if (enableRefreshHack) {
            forceRefresh.call(this, true);
            dom.addEventListener(inputElem, 'click', forceRefresh, {
                passive: true
            });
            dom.addEventListener(inputElem, 'blur', forceRefresh, {
                passive: true
            });
            dom.addEventListener(inputElem, 'focus', forceRefresh, {
                passive: true
            });
            dom.addEventListener(inputElem, 'change', forceRefresh, {
                passive: true
            });
        }

        return () => {
            //inputElem.removeEventListener('keydown', handler);
            dom.removeEventListener(inputElem, 'click', forceRefresh, {
                passive: true
            });
            dom.removeEventListener(inputElem, 'blur', forceRefresh, {
                passive: true
            });
            dom.removeEventListener(inputElem, 'focus', forceRefresh, {
                passive: true
            });
            dom.removeEventListener(inputElem, 'change', forceRefresh, {
                passive: true
            });
        };
    }, [enableRefreshHack]);

    const labelClass = classNames(
        'emby-checkbox-label',
        labelClassName
    );

    const outlineClass = classNames(
        'checkboxOutline',
        dataOutLineClass
    );

    const checkedIcon = dataCheckedIcon || 'check';
    const uncheckedIcon = dataUnCheckedIcon || '';

    return (
        <label ref={labelRef} className={labelClass}>
            <input
                type='checkbox'
                className={classNames('emby-checkbox', className)}
                ref={inputRef}
                value={value}
                checked={checked}
                onKeyDown={keyDownHandler}
                onChange={onChange}
                {...rest}

            />

            <span className='checkboxLabel'>{label}</span>

            <span className={outlineClass}>
                <span className={`material-icons checkboxIcon checkboxIcon-checked ${checkedIcon}`} aria-hidden='true'></span>
                <span className={`material-icons checkboxIcon checkboxIcon-unchecked ${uncheckedIcon}`} aria-hidden='true'></span>
            </span>
        </label>
    );
};

export default Checkbox;
