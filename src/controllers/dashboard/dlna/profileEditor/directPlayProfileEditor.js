import dialogHelper from 'dialogHelper';
import layoutManager from 'layoutManager';
import globalize from 'globalize';
import 'paper-icon-button-light';
import 'emby-input';
import 'emby-select';
import 'formDialogStyle';

function centerFocus(elem, horiz, on) {
    import('scrollHelper').then(({default: scrollHelper}) => {
        const fn = on ? 'on' : 'off';
        scrollHelper.centerFocus[fn](elem, horiz);
    });
}

export function show(directPlayProfile) {
    return new Promise(function (resolve, reject) {
        import('text!./directPlayProfileEditor.template.html').then(({default: template}) => {
            const dialogOptions = {
                removeOnClose: true,
                scrollY: false
            };

            if (layoutManager.tv) {
                dialogOptions.size = 'fullscreen';
            } else {
                dialogOptions.size = 'small';
            }

            const dlg = dialogHelper.createDialog(dialogOptions);

            dlg.classList.add('formDialog');

            let html = '';
            let submitted = false;

            html += globalize.translateHtml(template, 'core');

            dlg.innerHTML = html;

            dlg.querySelector('#selectDirectPlayProfileType', dlg).value = directPlayProfile.Type || 'Video';
            dlg.querySelector('#txtDirectPlayContainer', dlg).value = directPlayProfile.Container || '';
            dlg.querySelector('#txtDirectPlayAudioCodec', dlg).value = directPlayProfile.AudioCodec || '';
            dlg.querySelector('#txtDirectPlayVideoCodec', dlg).value = directPlayProfile.VideoCodec || '';

            if (layoutManager.tv) {
                centerFocus(dlg.querySelector('.formDialogContent'), false, true);
            }

            dialogHelper.open(dlg);

            dlg.addEventListener('close', function () {
                if (layoutManager.tv) {
                    centerFocus(dlg.querySelector('.formDialogContent'), false, false);
                }

                if (submitted) {
                    resolve(directPlayProfile);
                } else {
                    reject();
                }
            });

            dlg.querySelector('#selectDirectPlayProfileType').addEventListener('change', function (e) {
                if (this.value == 'Video') {
                    dlg.querySelector('#fldDirectPlayVideoCodec').classList.remove('hide');
                } else {
                    dlg.querySelector('#fldDirectPlayVideoCodec').classList.add('hide');
                }

                if (this.value == 'Photo') {
                    dlg.querySelector('#fldDirectPlayAudioCodec').classList.add('hide');
                } else {
                    dlg.querySelector('#fldDirectPlayAudioCodec').classList.remove('hide');
                }
            });

            dlg.querySelector('.btnCancel').addEventListener('click', function (e) {
                dialogHelper.close(dlg);
            });

            dlg.querySelector('form').addEventListener('submit', function (e) {
                submitted = true;

                directPlayProfile.Type = dlg.querySelector('#selectDirectPlayProfileType', dlg).value;
                directPlayProfile.Container = dlg.querySelector('#txtDirectPlayContainer', dlg).value;
                directPlayProfile.AudioCodec = dlg.querySelector('#txtDirectPlayAudioCodec', dlg).value;
                directPlayProfile.VideoCodec = dlg.querySelector('#txtDirectPlayVideoCodec', dlg).value;

                dialogHelper.close(dlg);

                e.preventDefault();
                return false;
            });

            dlg.querySelector('#selectDirectPlayProfileType').dispatchEvent(new CustomEvent('change', {
                bubbles: true
            }));
        });
    });
}

export default {
    show: show
};

