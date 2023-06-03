import React, { createContext, FC, useContext, useEffect, useMemo } from 'react';

import { LibraryViewSettings } from 'types/library';
import { useLocalStorage } from './useLocalStorage';

export interface LibrarySettingsContextProps {
    libraryViewSettings: LibraryViewSettings;
    setLibraryViewSettings: React.Dispatch<React.SetStateAction<LibraryViewSettings>>;
}

const LibrarySettingsContext = createContext<LibrarySettingsContextProps>(
    {} as LibrarySettingsContextProps
);

export const useLibrarySettings = () => useContext(LibrarySettingsContext);

const DEFAULT_Library_View_SETTINGS: LibraryViewSettings = {
    SortBy: 'SortName',
    SortOrder: 'Ascending',
    StartIndex: 0,
    cardLayout: false,
    filtersFeatures: [],
    filtersGenres: [],
    filtersOfficialRatings: [],
    filtersSeriesStatus: [],
    filtersStatus: [],
    filtersStudioIds: [],
    filtersTags: [],
    filtersVideoTypes: [],
    filtersYears: [],
    imageType: 'primary',
    showTitle: true,
    showYear: false
};

interface LibrarySettingsProviderProps {
    parentId: string | null;
    viewType: string;
}

export const LibrarySettingsProvider: FC<LibrarySettingsProviderProps> = ({
    parentId,
    viewType,
    children
}) => {
    const [libraryViewSettings, setLibraryViewSettings] = useLocalStorage<LibraryViewSettings>(`${viewType} - ${parentId}`, DEFAULT_Library_View_SETTINGS);

    const context = useMemo(
        () => ({
            libraryViewSettings,
            setLibraryViewSettings
        }),
        [setLibraryViewSettings, libraryViewSettings]
    );

    useEffect(() => {
        // update default imageType
        if (viewType === 'studios' && libraryViewSettings.imageType !== 'thumb') {
            setLibraryViewSettings((prevState) => ({
                ...prevState,
                imageType: 'thumb'
            }));
        } else if (viewType === 'songs' && libraryViewSettings.imageType !== 'list') {
            setLibraryViewSettings((prevState) => ({
                ...prevState,
                imageType: 'list'
            }));
        }
    }, [viewType, setLibraryViewSettings, libraryViewSettings.imageType]);

    return (
        <LibrarySettingsContext.Provider value={context}>
            {children}
        </LibrarySettingsContext.Provider>
    );
};
