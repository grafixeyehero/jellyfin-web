import ServerConnections from '../ServerConnections';
import itemHelper from '../itemHelper';
import mediaInfo from '../mediainfo/mediainfo';
import {playbackManager} from '../playback/playbackmanager';
import globalize from '../../scripts/globalize';
import dom from '../../scripts/dom';
import {appHost} from '../apphost';
import './ItemHoverMenu.css';
import '../../elements/emby-button/emby-button';
import '../../elements/emby-playstatebutton/emby-playstatebutton';
import '../../elements/emby-ratingbutton/emby-ratingbutton';

let preventHover = false;
let showOverlayTimeout;

function onHoverOut(e) {
    let elem = e.target;
    if (showOverlayTimeout) {
        clearTimeout(showOverlayTimeout);
        showOverlayTimeout = null;
    }
    elem = elem.classList.contains('cardOverlayTarget') ? elem : elem.querySelector('.cardOverlayTarget');
    if (elem) {
        slideDownToHide(elem);
    }
}

function onSlideTransitionComplete() {
    this.classList.add('hide');
}

function slideDownToHide(elem) {
    if (elem.classList.contains('hide')) {
        return;
    }
    dom.addEventListener(elem, dom.whichTransitionEvent(), onSlideTransitionComplete, {
        once: true
    });
    elem.classList.remove('cardOverlayTarget-open');
}

function slideUpToShow(elem) {
    dom.removeEventListener(elem, dom.whichTransitionEvent(), onSlideTransitionComplete, {
        once: true
    });
    elem.classList.remove('hide');
    void elem.offsetWidth;
    elem.classList.add('cardOverlayTarget-open');
}

function getOverlayHtml(apiClient, item, card) {
    let html = '';
    html += '<div class="cardOverlayInner">';
    const className = card.className.toLowerCase();
    const isMiniItem = className.indexOf('mini') !== -1;
    const isSmallItem = isMiniItem || className.indexOf('small') !== -1;
    const isPortrait = className.indexOf('portrait') !== -1;
    const parentName = isSmallItem || isMiniItem || isPortrait ? null : item.SeriesName;
    const name = item.EpisodeTitle ? item.Name : itemHelper.getDisplayName(item);
    html += '<div>';
    const logoHeight = 26;
    let imgUrl;
    if (parentName && item.ParentLogoItemId) {
        imgUrl = apiClient.getScaledImageUrl(item.ParentLogoItemId, {
            maxHeight: logoHeight,
            type: 'logo',
            tag: item.ParentLogoImageTag
        });
        html += '<img src="' + imgUrl + '" style="max-height:' + logoHeight + 'px;max-width:100%;" />';
    } else if (item.ImageTags.Logo) {
        imgUrl = apiClient.getScaledImageUrl(item.Id, {
            maxHeight: logoHeight,
            type: 'logo',
            tag: item.ImageTags.Logo
        });
        html += '<img src="' + imgUrl + '" style="max-height:' + logoHeight + 'px;max-width:100%;" />';
    } else {
        html += parentName || name;
    }
    html += '</div>';
    if (parentName) {
        html += '<p>';
        html += name;
        html += '</p>';
    } else if (!isSmallItem && !isMiniItem) {
        html += '<div class="cardOverlayMediaInfo">';
        html += mediaInfo.getPrimaryMediaInfoHtml(item, {
            endsAt: false
        });
        html += '</div>';
    }
    html += '<div class="cardOverlayButtons">';
    if (playbackManager.canPlay(item)) {
        html += '<button is="emby-button" class="itemAction autoSize fab cardOverlayFab mini" data-action="resume"><span class="material-icons cardOverlayFab play_arrow"></span></button>';
    }
    if (item.LocalTrailerCount) {
        html += '<button title="' + globalize.translate('sharedcomponents#Trailer') + '" is="emby-button" class="itemAction autoSize fab cardOverlayFab mini" data-action="playtrailer"><span class="material-icons cardOverlayFab videocam"></span></button>';
    }
    const moreIcon = appHost.moreIcon === 'more_horiz' ? 'keyboard_control' : 'more_vert';
    html += `<button is="emby-button" class="itemAction autoSize fab cardOverlayFab mini" data-action="menu" data-playoptions="false"><span class="material-icons cardOverlayFab ${moreIcon}"></span></button>`;
    const userData = item.UserData || ({});
    if (itemHelper.canMarkPlayed(item)) {
        html += '<button is="emby-playstatebutton" type="button" data-action="none" class="itemAction fab cardOverlayFab mini" data-id="' + item.Id + '" data-serverid="' + item.ServerId + '" data-itemtype="' + item.Type + '" data-played="' + userData.Played + '"><span class="material-icons cardOverlayFab check"></span></button>';
    }
    if (itemHelper.canRate(item)) {
        const likes = userData.Likes == null ? '' : userData.Likes;
        html += '<button is="emby-ratingbutton" type="button" data-action="none" class="itemAction fab cardOverlayFab mini" data-id="' + item.Id + '" data-serverid="' + item.ServerId + '" data-itemtype="' + item.Type + '" data-likes="' + likes + '" data-isfavorite="' + userData.IsFavorite + '"><span class="material-icons cardOverlayFab favorite"></span></button>';
    }
    html += '</div>';
    html += '</div>';
    return html;
}

function onCardOverlayButtonsClick(e) {
    const button = dom.parentWithClass(e.target, 'btnUserData');
    if (button) {
        e.stopPropagation();
    }
}

function onShowTimerExpired(elem) {
    let innerElem = elem.querySelector('.cardOverlayTarget');
    if (!innerElem) {
        innerElem = document.createElement('div');
        innerElem.classList.add('hide');
        innerElem.classList.add('cardOverlayTarget');
        innerElem.classList.add('itemAction');
        innerElem.setAttribute('data-action', 'link');
        let appendTo = elem.querySelector('div.cardContent') || elem.querySelector('.cardScalable') || elem.querySelector('.cardBox');
        if (!appendTo) {
            appendTo = elem;
        }
        appendTo.classList.add('withHoverMenu');
        appendTo.appendChild(innerElem);
    }
    const dataElement = dom.parentWithAttribute(elem, 'data-id');
    if (!dataElement) {
        return;
    }
    const id = dataElement.getAttribute('data-id');
    const type = dataElement.getAttribute('data-type');
    if (type === 'Timer' || type === 'SeriesTimer' || type === 'Program') {
        return;
    }
    const serverId = dataElement.getAttribute('data-serverid');
    const apiClient = ServerConnections.getApiClient(serverId);
    apiClient.getItem(apiClient.getCurrentUserId(), id).then(function (item) {
        innerElem.innerHTML = getOverlayHtml(apiClient, item, dataElement);
        innerElem.querySelector('.cardOverlayButtons').addEventListener('click', onCardOverlayButtonsClick);
    });
    slideUpToShow(innerElem);
}

function onHoverIn(e) {
    const elem = e.target;
    const card = dom.parentWithClass(elem, 'cardBox');
    if (!card) {
        return;
    }
    if (preventHover === true) {
        preventHover = false;
        return;
    }
    if (showOverlayTimeout) {
        clearTimeout(showOverlayTimeout);
        showOverlayTimeout = null;
    }
    showOverlayTimeout = setTimeout(function () {
        onShowTimerExpired(card);
    }, 100);
}

function preventTouchHover() {
    preventHover = true;
}

class ItemHoverMenu {
    constructor(parentElement) {
        this.parent = parentElement;
        this.parent.addEventListener('mouseenter', onHoverIn, true);
        this.parent.addEventListener('mouseleave', onHoverOut, true);
        dom.addEventListener(this.parent, 'touchstart', preventTouchHover, {
            passive: true
        });
    }
    destroy() {
        this.parent.removeEventListener('mouseenter', onHoverIn, true);
        this.parent.removeEventListener('mouseleave', onHoverOut, true);
        dom.removeEventListener(this.parent, 'touchstart', preventTouchHover, {
            passive: true
        });
    }
}

export {ItemHoverMenu};
