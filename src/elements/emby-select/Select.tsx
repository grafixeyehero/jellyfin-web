import classNames from 'classnames';
import React, { useState, useCallback, SelectHTMLAttributes, DetailedHTMLProps, useRef } from 'react';
import actionSheet from '../../components/actionSheet/actionSheet';
import layoutManager from '../../components/layoutManager';
import browser from '../../scripts/browser';
import globalize from '../../scripts/globalize';
import { FieldDescription } from '../fieldDescription';
import './emby-select.scss';

function enableNativeMenu() {
    if (browser.edgeUwp || browser.xboxOne) {
        return true;
    }

    // Doesn't seem to work at all
    if (browser.tizen || browser.orsay || browser.web0s) {
        return false;
    }

    // Take advantage of the native input methods
    if (browser.tv) {
        return true;
    }

    return !layoutManager.tv;
}

interface SelectProps
    extends DetailedHTMLProps<
        SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
    > {
    labelTitle?: string;
    labelClassName?: string;
    fieldDescription?: JSX.Element;
    containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({
    value,
    labelTitle,
    labelClassName,
    disabled,
    className,
    onChange,
    fieldDescription,
    children,
    ...rest
}) => {
    const [isFocus, setIsFocus] = useState(false);
    const [isBlur, setIsBlur] = useState(false);
    const labelRef = useRef<HTMLLabelElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const focusHandler = useCallback(() => {
        setIsFocus(true);
        setIsBlur(false);
    }, []);

    const blurHandler = useCallback(() => {
        setIsFocus(false);
        setIsBlur(true);
    }, []);

    const showActionSheet = useCallback((select) => {
        const labelElem = labelRef.current;
        const title = labelElem ? (labelElem.textContent || labelElem.innerText) : null;
        actionSheet.show({
            items: select.options,
            positionTo: select,
            title: title

        }).then((selectedvalue) => {
            select.value = selectedvalue;
            select.dispatchEvent(new CustomEvent('change', {
                bubbles: true
            }));
        });
    }, []);

    const keyDownHandler = useCallback((event: React.KeyboardEvent<HTMLSelectElement>) => {
        switch (event.code) {
            case 'Enter':
                if (!enableNativeMenu()) {
                    event.preventDefault();
                    showActionSheet(selectRef.current);
                }
                return;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'ArrowRight':
            case 'ArrowDown':
                if (layoutManager.tv) {
                    event.preventDefault();
                }
                return;
            default:
                break;
        }
    }, [showActionSheet]);

    const mouseDownHandler = useCallback((event: React.MouseEvent<HTMLSelectElement>) => {
        // e.button=0 for primary (left) mouse button click
        if (!event.button && !enableNativeMenu()) {
            event.preventDefault();
            showActionSheet(selectRef.current);
        }
    }, [showActionSheet]);

    const containerclass = classNames('selectContainer');

    const labelClass = classNames(
        'selectLabel',
        labelClassName,
        { 'selectLabelFocused': isFocus },
        { 'selectLabelUnfocused': isBlur }
    );

    const selectclass = classNames(
        'emby-select emby-select-withcolor',
        className,
        { 'emby-select-focusscale': layoutManager.tv }
    );

    return (
        <div className={containerclass}>
            {labelTitle && (
                <label ref={labelRef} className={labelClass}>
                    {globalize.translate(labelTitle)}
                </label>
            )}

            <select
                ref={selectRef}
                className={selectclass}
                disabled={disabled}
                onFocus={focusHandler}
                onBlur={blurHandler}
                onKeyDown={keyDownHandler}
                onMouseDown={mouseDownHandler}
                onChange={onChange}
                value={value}
                {...rest}
            >
                {children}
            </select>

            {fieldDescription}

            <div className='selectArrowContainer'>
                <span
                    className='selectArrow material-icons keyboard_arrow_down'
                    aria-hidden='true'
                />
            </div>
        </div>
    );
};

export { Select };
