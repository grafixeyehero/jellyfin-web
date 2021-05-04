import loading from '../components/loading/loading';
import globalize from '../scripts/globalize';
import '../elements/emby-button/emby-button';
import Dashboard from '../scripts/clientUtils';
import alert from '../components/alert';

function loadPage(page, config) {
    page.querySelector('.liveTvSettingsForm').classList.remove('hide');
    //page.querySelector('.noLiveTvServices').classList.add('hide');
    page.querySelector('#selectGuideDays').value = config.GuideDays || '';
    page.querySelector('#txtPrePaddingMinutes').value = config.PrePaddingSeconds / 60;
    page.querySelector('#txtPostPaddingMinutes').value = config.PostPaddingSeconds / 60;
    page.querySelector('#txtRecordingPath').value = config.RecordingPath || '';
    page.querySelector('#txtMovieRecordingPath').value = config.MovieRecordingPath || '';
    page.querySelector('#txtSeriesRecordingPath').value = config.SeriesRecordingPath || '';
    page.querySelector('#txtPostProcessor').value = config.RecordingPostProcessor || '';
    page.querySelector('#txtPostProcessorArguments').value = config.RecordingPostProcessorArguments || '';
    loading.hide();
}

function onSubmit(e) {
    loading.show();
    const form = this;
    ApiClient.getNamedConfiguration('livetv').then(function (config) {
        config.GuideDays = form.querySelector('#selectGuideDays').value || null;
        const recordingPath = form.querySelector('#txtRecordingPath').value || null;
        const movieRecordingPath = form.querySelector('#txtMovieRecordingPath').value || null;
        const seriesRecordingPath = form.querySelector('#txtSeriesRecordingPath').value || null;
        const recordingPathChanged = recordingPath != config.RecordingPath || movieRecordingPath != config.MovieRecordingPath || seriesRecordingPath != config.SeriesRecordingPath;
        config.RecordingPath = recordingPath;
        config.MovieRecordingPath = movieRecordingPath;
        config.SeriesRecordingPath = seriesRecordingPath;
        config.RecordingEncodingFormat = 'mkv';
        config.PrePaddingSeconds = 60 * form.querySelector('#txtPrePaddingMinutes').value;
        config.PostPaddingSeconds = 60 * form.querySelector('#txtPostPaddingMinutes').value;
        config.RecordingPostProcessor = form.querySelector('#txtPostProcessor').value;
        config.RecordingPostProcessorArguments = form.querySelector('#txtPostProcessorArguments').value;
        ApiClient.updateNamedConfiguration('livetv', config).then(function () {
            Dashboard.processServerConfigurationUpdateResult();
            showSaveMessage(recordingPathChanged);
        });
    });
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function showSaveMessage(recordingPathChanged) {
    let msg = '';

    if (recordingPathChanged) {
        msg += globalize.translate('MessageChangeRecordingPath');
    }

    if (msg) {
        alert(msg);
    }
}

export default function (view) {
    view.querySelector('#btnSelectRecordingPath').addEventListener('click', function () {
        import('../components/directorybrowser/directorybrowser').then((Module) => {
            const picker = new Module.DirectoryBrowser();
            picker.show({
                path: view.querySelector('#txtRecordingPath').value,
                callback: function (path) {
                    if (path) {
                        view.querySelector('#txtRecordingPath').value = path;
                    }

                    picker.close();
                },
                validateWriteable: true,
                header: globalize.translate('HeaderSelectRecordingPath'),
                instruction: globalize.translate('HeaderSelectRecordingPathHelp')
            });
        });
    });
    view.querySelector('#btnSelectMovieRecordingPath').addEventListener('click', function () {
        import('../components/directorybrowser/directorybrowser').then((Module) => {
            const picker = new Module.DirectoryBrowser();
            picker.show({
                path: view.querySelector('#txtMovieRecordingPath').value,
                callback: function (path) {
                    if (path) {
                        view.querySelector('#txtMovieRecordingPath').value = path;
                    }

                    picker.close();
                },
                validateWriteable: true,
                header: globalize.translate('HeaderSelectMovieRecordingPath'),
                instruction: globalize.translate('HeaderSelectMovieRecordingPathHelp')
            });
        });
    });
    view.querySelector('#btnSelectSeriesRecordingPath').addEventListener('click', function () {
        import('../components/directorybrowser/directorybrowser').then((Module) => {
            const picker = new Module.DirectoryBrowser();
            picker.show({
                path: view.querySelector('#txtSeriesRecordingPath').value,
                callback: function (path) {
                    if (path) {
                        view.querySelector('#txtSeriesRecordingPath').value = path;
                    }

                    picker.close();
                },
                validateWriteable: true,
                header: globalize.translate('HeaderSelectSeriesRecordingPath'),
                instruction: globalize.translate('HeaderSelectSeriesRecordingPathHelp')
            });
        });
    });
    view.querySelector('#btnSelectPostProcessorPath').addEventListener('click', function () {
        import('../components/directorybrowser/directorybrowser').then((Module) => {
            const picker = new Module.DirectoryBrowser();
            picker.show({
                path: view.querySelector('#txtPostProcessor').value,
                includeFiles: true,
                callback: function (path) {
                    if (path) {
                        view.querySelector('#txtPostProcessor').value = path;
                    }

                    picker.close();
                },
                validateWriteable: true,
                header: globalize.translate('HeaderSelectPostProcessorPath'),
                instruction: globalize.translate('HeaderSelectPostProcessorPathHelp')
            });
        });
    });
    view.querySelector('.liveTvSettingsForm').addEventListener('submit', onSubmit);
    view.addEventListener('viewshow', function () {
        loading.show();
        const page = this;
        ApiClient.getNamedConfiguration('livetv').then(function (config) {
            loadPage(page, config);
        });
    });
}

