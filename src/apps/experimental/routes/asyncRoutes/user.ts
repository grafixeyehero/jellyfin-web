import { AsyncRoute, AsyncRouteType } from '../../../../components/router/AsyncRoute';

export const ASYNC_USER_ROUTES: AsyncRoute[] = [
    { path: 'search.html', page: 'search' },
    { path: 'userprofile.html', page: 'user/userprofile' },
    { path: 'home.html', page: 'home', type: AsyncRouteType.Experimental },
    { path: 'movies.html', page: 'library', type: AsyncRouteType.Experimental },
    { path: 'tv.html', page: 'library', type: AsyncRouteType.Experimental },
    { path: 'music.html', page: 'library', type: AsyncRouteType.Experimental },
    { path: 'books.html', page: 'library', type: AsyncRouteType.Experimental },
    { path: 'homevideos.html', page: 'library', type: AsyncRouteType.Experimental }
];
