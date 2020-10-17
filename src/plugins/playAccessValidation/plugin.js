import globalize from '../../scripts/globalize';
import ServerConnections from '../../components/ServerConnections';

function showErrorMessage() {
    return import('../../components/alert').then(({default: alert}) => {
        return alert(globalize.translate('MessagePlayAccessRestricted'));
    });
}

class PlayAccessValidation {
    constructor() {
        this.name = 'Playback validation';
        this.type = 'preplayintercept';
        this.id = 'playaccessvalidation';
        this.order = -2;
    }

    intercept(options) {
        const item = options.item;
        if (!item) {
            return Promise.resolve();
        }
        const serverId = item.ServerId;
        if (!serverId) {
            return Promise.resolve();
        }

        return ServerConnections.getApiClient(serverId).getCurrentUser().then(function (user) {
            if (user.Policy.EnableMediaPlayback) {
                return Promise.resolve();
            }

            // reject but don't show an error message
            if (!options.fullscreen) {
                return Promise.reject();
            }

            return showErrorMessage();
        });
    }
}

export default PlayAccessValidation;
