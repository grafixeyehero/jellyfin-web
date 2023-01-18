import React, { createContext, FC, useContext, useMemo, useState } from 'react';

import {CssBaseline, ThemeProvider, PaletteMode} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { getMUIThemeMode } from '../utils/items';

const theme = (mode: PaletteMode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: {
                    main: '#00a4dc'
                },
                secondary: {
                    main: '#aa5cc3'
                },
                background: {
                    default: '#ffffff',
                    paper: '#e6e6e6'
                },
                text: {
                    primary: 'rgba(0, 0, 0, 0.87)',
                    secondary: 'rgba(0,0,0,0.4)'
                }
            }
            : {
                primary: {
                    main: '#00a4dc'
                },
                secondary: {
                    main: '#aa5cc3'
                },
                background: {
                    default: '#101010',
                    paper: '#202020'
                }
            }
        )
    },
    typography: {
        fontFamily: ['Noto Sans', 'sans-serif'].join(','),
        fontSize: 12,
        h1: {
            fontFamily: ['Noto Sans', 'sans-serif'].join(','),
            fontSize: 40
        },
        h2: {
            fontFamily: ['Noto Sans', 'sans-serif'].join(','),
            fontSize: 32
        },
        h3: {
            fontFamily: ['Noto Sans', 'sans-serif'].join(','),
            fontSize: 24
        },
        h4: {
            fontFamily: ['Noto Sans', 'sans-serif'].join(','),
            fontSize: 20
        },
        h5: {
            fontFamily: ['Noto Sans', 'sans-serif'].join(','),
            fontSize: 16
        },
        h6: {
            fontFamily: ['Noto Sans', 'sans-serif'].join(','),
            fontSize: 14
        }
    }
});
export interface ThemeConfigContextProps {
    mode: PaletteMode
    setMode: React.Dispatch<React.SetStateAction<PaletteMode>>
}

export const ThemeConfigContext = createContext<ThemeConfigContextProps>({} as ThemeConfigContextProps);
export const useThemeConfig = () => useContext(ThemeConfigContext);

export const ThemeConfigProvider: FC = ({ children }) => {
    const [mode, setMode] = useState<PaletteMode>(getMUIThemeMode());

    const context = useMemo(() => ({
        mode,
        setMode
    }), [ mode, setMode ]);

    return (
        <ThemeConfigContext.Provider value={context}>
            <ThemeProvider theme={theme(mode)}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeConfigContext.Provider>
    );
};
