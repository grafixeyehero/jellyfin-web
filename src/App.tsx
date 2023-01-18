import { History } from '@remix-run/router';
import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { HistoryRouter } from './components/HistoryRouter';
import { ApiProvider } from './hooks/useApi';
import AppRoutes from './routes/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeConfigProvider } from './hooks/useThemeConfig';

const queryClient = new QueryClient();

const App = ({ history }: { history: History }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ApiProvider>
                <ThemeConfigProvider>
                    <HistoryRouter history={history}>
                        <AppRoutes/>
                    </HistoryRouter>
                </ThemeConfigProvider>
            </ApiProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
