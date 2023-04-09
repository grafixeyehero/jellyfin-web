import useLocalStorageState, { LocalStorageState } from 'use-local-storage-state/src/useLocalStorageState';
import { getDefaultViewUserSettings } from '../utils/items';
import { ViewUserSettings } from '../types/interface';

const useViewUserSettings = (viewType: string, parentId: string | null | undefined): LocalStorageState<ViewUserSettings> => {
    return useLocalStorageState<ViewUserSettings>(`${viewType} - ${parentId}`, {
        defaultValue: {
            ...getDefaultViewUserSettings(viewType)
        }
    });
};

export default useViewUserSettings;
