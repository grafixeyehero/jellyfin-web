import globalize from 'globalize';
import appSettings from 'appSettings';
import appHost from 'apphost';
import focusManager from 'focusManager';
import loading from 'loading';
import connectionManager from 'connectionManager';
import subtitleAppearanceHelper from 'subtitleAppearanceHelper';
import dom from 'dom';
import events from 'events';
import 'listViewStyle';
import 'emby-select';
import 'emby-input';
import 'emby-checkbox';
import 'flexStyles';

/* eslint-disable indent */

    function populateLanguages(select, languages) {
        let html = '';

        html += `<option value=''>${globalize.translate('AnyLanguage')}</option>`;
        for (let i = 0, length = languages.length; i < length; i++) {
            const culture = languages[i];
            html += `<option value='${culture.ThreeLetterISOLanguageName}'>${culture.DisplayName}</option>`;
        }

        select.innerHTML = html;
    }

    function getSubtitleAppearanceObject(context) {
        const appearanceSettings = {};

        appearanceSettings.textSize = context.querySelector('#selectTextSize').value;
        appearanceSettings.dropShadow = context.querySelector('#selectDropShadow').value;
        appearanceSettings.font = context.querySelector('#selectFont').value;
        appearanceSettings.textBackground = context.querySelector('#inputTextBackground').value;
        appearanceSettings.textColor = context.querySelector('#inputTextColor').value;

        return appearanceSettings;
    }

    function loadForm(context, user, userSettings, appearanceSettings, apiClient) {

        apiClient.getCultures().then(allCultures => {

            if (appHost.supports('subtitleburnsettings') && user.Policy.EnableVideoPlaybackTranscoding) {
                context.querySelector('.fldBurnIn').classList.remove('hide');
            }

            const selectSubtitleLanguage = context.querySelector('#selectSubtitleLanguage');

            populateLanguages(selectSubtitleLanguage, allCultures);

            selectSubtitleLanguage.value = user.Configuration.SubtitleLanguagePreference || '';
            context.querySelector('#selectSubtitlePlaybackMode').value = user.Configuration.SubtitleMode || '';

            context.querySelector('#selectSubtitlePlaybackMode').dispatchEvent(new CustomEvent('change', {}));

            context.querySelector('#selectTextSize').value = appearanceSettings.textSize || '';
            context.querySelector('#selectDropShadow').value = appearanceSettings.dropShadow || '';
            context.querySelector('#inputTextBackground').value = appearanceSettings.textBackground || 'transparent';
            context.querySelector('#inputTextColor').value = appearanceSettings.textColor || '#ffffff';
            context.querySelector('#selectFont').value = appearanceSettings.font || '';

            context.querySelector('#selectSubtitleBurnIn').value = appSettings.get('subtitleburnin') || '';

            onAppearanceFieldChange({
                target: context.querySelector('#selectTextSize')
            });

            loading.hide();
        });
    }

    function saveUser(context, user, userSettingsInstance, appearanceKey, apiClient) {

        let appearanceSettings = userSettingsInstance.getSubtitleAppearanceSettings(appearanceKey);
        appearanceSettings = Object.assign(appearanceSettings, getSubtitleAppearanceObject(context));

        userSettingsInstance.setSubtitleAppearanceSettings(appearanceSettings, appearanceKey);

        user.Configuration.SubtitleLanguagePreference = context.querySelector('#selectSubtitleLanguage').value;
        user.Configuration.SubtitleMode = context.querySelector('#selectSubtitlePlaybackMode').value;

        return apiClient.updateUserConfiguration(user.Id, user.Configuration);
    }

    function save(instance, context, userId, userSettings, apiClient, enableSaveConfirmation) {

        loading.show();

        appSettings.set('subtitleburnin', context.querySelector('#selectSubtitleBurnIn').value);

        apiClient.getUser(userId).then(user => {

            saveUser(context, user, userSettings, instance.appearanceKey, apiClient).then(() => {

                loading.hide();
                if (enableSaveConfirmation) {
                    import('toast').then(({default: toast}) => {
                        toast(globalize.translate('SettingsSaved'));
                    });
                }

                events.trigger(instance, 'saved');

            }, () => {
                loading.hide();
            });
        });
    }

    function onSubmit(e) {
        const self = this;
        const apiClient = connectionManager.getApiClient(self.options.serverId);
        const userId = self.options.userId;
        const userSettings = self.options.userSettings;

        userSettings.setUserInfo(userId, apiClient).then(() => {
            const enableSaveConfirmation = self.options.enableSaveConfirmation;
            save(self, self.options.element, userId, userSettings, apiClient, enableSaveConfirmation);
        });

        // Disable default form submission
        if (e) {
            e.preventDefault();
        }

        return false;
    }

    function onSubtitleModeChange(e) {

        const view = dom.parentWithClass(e.target, 'subtitlesettings');

        const subtitlesHelp = view.querySelectorAll('.subtitlesHelp');
        for (let i = 0, length = subtitlesHelp.length; i < length; i++) {
            subtitlesHelp[i].classList.add('hide');
        }
        view.querySelector(`.subtitles${this.value}Help`).classList.remove('hide');
    }

    function onAppearanceFieldChange(e) {

        const view = dom.parentWithClass(e.target, 'subtitlesettings');

        const appearanceSettings = getSubtitleAppearanceObject(view);

        const elements = {
            window: view.querySelector('.subtitleappearance-preview-window'),
            text: view.querySelector('.subtitleappearance-preview-text')
        };

        subtitleAppearanceHelper.applyStyles(elements, appearanceSettings);
    }

    function embed(options, self) {

        return import('text!./subtitlesettings.template.html').then(({default: template}) => {

            options.element.classList.add('subtitlesettings');
            options.element.innerHTML = globalize.translateDocument(template, 'core');

            options.element.querySelector('form').addEventListener('submit', onSubmit.bind(self));

            options.element.querySelector('#selectSubtitlePlaybackMode').addEventListener('change', onSubtitleModeChange);
            options.element.querySelector('#selectTextSize').addEventListener('change', onAppearanceFieldChange);
            options.element.querySelector('#selectDropShadow').addEventListener('change', onAppearanceFieldChange);
            options.element.querySelector('#selectFont').addEventListener('change', onAppearanceFieldChange);
            options.element.querySelector('#inputTextColor').addEventListener('change', onAppearanceFieldChange);
            options.element.querySelector('#inputTextBackground').addEventListener('change', onAppearanceFieldChange);

            if (options.enableSaveButton) {
                options.element.querySelector('.btnSave').classList.remove('hide');
            }

            if (appHost.supports('subtitleappearancesettings')) {
                options.element.querySelector('.subtitleAppearanceSection').classList.remove('hide');
            }

            self.loadData();

            if (options.autoFocus) {
                focusManager.autoFocus(options.element);
            }
        });
    }

    class SubtitleSettings {
        constructor(options) {

            this.options = options;

            embed(options, this);
        }

        loadData() {

            const self = this;
            const context = self.options.element;

            loading.show();

            const userId = self.options.userId;
            const apiClient = connectionManager.getApiClient(self.options.serverId);
            const userSettings = self.options.userSettings;

            apiClient.getUser(userId).then(user => {
                userSettings.setUserInfo(userId, apiClient).then(() => {
                    self.dataLoaded = true;

                    const appearanceSettings = userSettings.getSubtitleAppearanceSettings(self.options.appearanceKey);

                    loadForm(context, user, userSettings, appearanceSettings, apiClient);
                });
            });
        }

        submit() {
            onSubmit.call(this);
        }

        destroy() {
            this.options = null;
        }
    }

/* eslint-enable indent */
export default SubtitleSettings;
