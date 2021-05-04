import loading from '../../components/loading/loading';
import globalize from '../../scripts/globalize';
import '../../elements/emby-checkbox/emby-checkbox';
import '../../elements/emby-textarea/emby-textarea';
import '../../elements/emby-input/emby-input';
import '../../elements/emby-select/emby-select';
import '../../elements/emby-button/emby-button';
import Dashboard from '../../scripts/clientUtils';
import alert from '../../components/alert';

/* eslint-disable indent */

    function loadPage(page, config, languageOptions, systemInfo) {
        page.querySelector('#txtServerName').value = systemInfo.ServerName;
        page.querySelector('#txtCachePath').value = systemInfo.CachePath || '';
        page.querySelector('#txtMetadataPath').value = systemInfo.InternalMetadataPath || '';
        page.querySelector('#txtMetadataNetworkPath').value = systemInfo.MetadataNetworkPath || '';
        const elem = page.querySelector('#selectLocalizationLanguage');
        elem.innerHTML = languageOptions.map(function (language) {
            return '<option value="' + language.Value + '">' + language.Name + '</option>';
        });
        elem.value = config.UICulture;

        loading.hide();
    }

    function onSubmit(e) {
        loading.show();
        const form = this;
        form.closest('.page');
        ApiClient.getServerConfiguration().then(function (config) {
            config.ServerName = form.querySelector('#txtServerName').value;
            config.UICulture = form.querySelector('#selectLocalizationLanguage').value;
            config.CachePath = form.querySelector('#txtCachePath').value;
            config.MetadataPath = form.querySelector('#txtMetadataPath').value;
            config.MetadataNetworkPath = form.querySelector('#txtMetadataNetworkPath').value;
            ApiClient.updateServerConfiguration(config).then(function() {
                ApiClient.getNamedConfiguration(brandingConfigKey).then(function(brandingConfig) {
                    brandingConfig.LoginDisclaimer = form.querySelector('#txtLoginDisclaimer').value;
                    brandingConfig.CustomCss = form.querySelector('#txtCustomCss').value;

                    ApiClient.updateNamedConfiguration(brandingConfigKey, brandingConfig).then(function () {
                        Dashboard.processServerConfigurationUpdateResult();
                    });
                });
            }, function () {
                alert(globalize.translate('ErrorDefault'));
                Dashboard.processServerConfigurationUpdateResult();
            });
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    const brandingConfigKey = 'branding';
    export default function (view) {
        view.querySelector('#btnSelectCachePath').addEventListener('click', function () {
            import('../../components/directorybrowser/directorybrowser').then((Module) => {
                const picker = new Module.DirectoryBrowser();
                picker.show({
                    path: view.querySelector('#txtCachePath').value,
                    callback: function (path) {
                        if (path) {
                            view.querySelector('#txtCachePath').value = path;
                        }

                        picker.close();
                    },
                    validateWriteable: true,
                    header: globalize.translate('HeaderSelectServerCachePath'),
                    instruction: globalize.translate('HeaderSelectServerCachePathHelp')
                });
            });
        });
        view.querySelector('#btnSelectMetadataPath').addEventListener('click', function () {
            import('../../components/directorybrowser/directorybrowser').then((Module) => {
                const picker = new Module.DirectoryBrowser();
                picker.show({
                    path: view.querySelector('#txtMetadataPath').value,
                    networkSharePath: view.querySelector('#txtMetadataNetworkPath').value,
                    callback: function (path, networkPath) {
                        if (path) {
                            view.querySelector('#txtMetadataPath').value = path;
                        }

                        if (networkPath) {
                            view.querySelector('#txtMetadataNetworkPath').value = networkPath;
                        }

                        picker.close();
                    },
                    validateWriteable: true,
                    header: globalize.translate('HeaderSelectMetadataPath'),
                    instruction: globalize.translate('HeaderSelectMetadataPathHelp'),
                    enableNetworkSharePath: true
                });
            });
        });
        view.querySelector('.dashboardGeneralForm').addEventListener('submit', onSubmit);
        view.addEventListener('viewshow', function () {
            const promiseConfig = ApiClient.getServerConfiguration();
            const promiseLanguageOptions = ApiClient.getJSON(ApiClient.getUrl('Localization/Options'));
            const promiseSystemInfo = ApiClient.getSystemInfo();
            Promise.all([promiseConfig, promiseLanguageOptions, promiseSystemInfo]).then(function (responses) {
                loadPage(view, responses[0], responses[1], responses[2]);
            });
            ApiClient.getNamedConfiguration(brandingConfigKey).then(function (config) {
                view.querySelector('#txtLoginDisclaimer').value = config.LoginDisclaimer || '';
                view.querySelector('#txtCustomCss').value = config.CustomCss || '';
            });
        });
    }

/* eslint-enable indent */
