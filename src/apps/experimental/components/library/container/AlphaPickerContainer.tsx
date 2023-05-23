import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import AlphaPicker from 'components/alphaPicker/alphaPicker';
import { LibraryViewSettings } from 'types/library';

interface AlphaPickerContainerProps {
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const AlphaPickerContainer: FC<AlphaPickerContainerProps> = ({ libraryViewSettings, setLibraryViewSettings }) => {
    const [ alphaPicker, setAlphaPicker ] = useState<AlphaPicker>();
    const element = useRef<HTMLDivElement>(null);

    alphaPicker?.updateControls(libraryViewSettings);

    const onAlphaPickerChange = useCallback((e) => {
        const newValue = (e as CustomEvent).detail.value;
        let updatedValue: React.SetStateAction<LibraryViewSettings>;
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
        setLibraryViewSettings((prevState) => ({
            ...prevState,
            StartIndex: 0,
            ...updatedValue
        }));
    }, [setLibraryViewSettings]);

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
