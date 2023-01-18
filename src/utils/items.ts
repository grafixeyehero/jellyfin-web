import * as userSettings from '../scripts/settings/userSettings';

export const getMUIThemeMode = () => {
    switch (userSettings.theme(undefined)) {
        case 'appletv':
        case 'light':
            return 'light';
        case 'purplehaze':
        case 'blueradiance':
        case 'wmc':
        default:
            return 'dark';
    }
};
