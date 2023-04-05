import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import AlphaPicker from '../alphaPicker/alphaPicker';
import { ViewUserSettings } from '../../types/interface';

interface AlphaPickerContainerProps {
    viewUserSettings: ViewUserSettings;
    setViewUserSettings: React.Dispatch<React.SetStateAction<ViewUserSettings>>;
}

const AlphaPickerContainer: FC<AlphaPickerContainerProps> = ({ viewUserSettings, setViewUserSettings }) => {
    const [ alphaPicker, setAlphaPicker ] = useState<AlphaPicker>();
    const element = useRef<HTMLDivElement>(null);

    alphaPicker?.updateControls(viewUserSettings);

    const onAlphaPickerChange = useCallback((e) => {
        const newValue = (e as CustomEvent).detail.value;
        let updatedValue: React.SetStateAction<ViewUserSettings>;
        if (newValue === '#') {
            updatedValue = {
                NameLessThan: 'A',
                NameStartsWith: undefined
            };
        } else {
            updatedValue = {
                NameLessThan: undefined,
                NameStartsWith: newValue
            };
        }
        setViewUserSettings((prevState) => ({
            ...prevState,
            StartIndex: 0,
            ...updatedValue
        }));
    }, [setViewUserSettings]);

    useEffect(() => {
        const alphaPickerElement = element.current;

        setAlphaPicker(new AlphaPicker({
            element: alphaPickerElement,
            valueChangeEvent: 'click'
        }));

        if (alphaPickerElement) {
            alphaPickerElement.addEventListener('alphavaluechanged', onAlphaPickerChange);
        }

        return () => {
            alphaPickerElement?.removeEventListener('alphavaluechanged', onAlphaPickerChange);
        };
    }, [onAlphaPickerChange]);

    return (
        <div ref={element} className='alphaPicker alphaPicker-fixed alphaPicker-fixed-right alphaPicker-vertical alphabetPicker-right' />
    );
};

export default AlphaPickerContainer;
