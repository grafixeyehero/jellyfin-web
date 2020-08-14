/* eslint-disable indent */

/**
 * Module for building cards from item data.
 * @module components/cardBuilder/peoplecardbuilder
 */

import cardBuilder from '../cardbuilder/cardBuilder';

    export function buildPeopleCards(items, options) {
        options = Object.assign(options || {}, {
            cardLayout: false,
            centerText: true,
            showTitle: true,
            cardFooterAside: 'none',
            showPersonRoleOrType: true,
            cardCssClass: 'personCard',
            defaultCardImageIcon: 'person'
        });
        cardBuilder.buildCards(items, options);
    }

 /* eslint-enable indent */

export default {
    buildPeopleCards: buildPeopleCards
};
