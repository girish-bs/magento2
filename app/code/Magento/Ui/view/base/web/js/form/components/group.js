/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'underscore',
    'uiComponent'
], function (_, Component) {
    'use strict';

    function extractData(container, field, orig) {
        var data,
            value;

        container.some(function (item) {
            value = item[field];

            if (_.isFunction(value)) {
                value = value();
            }

            return !item.hidden() && (data = value);
        });

        return data || orig;
    }

    return Component.extend({
        defaults: {
            hidden: false,
            label: '',
            required: false,
            template: 'ui/group/group',
            fieldTemplate: 'ui/group/field',
            breakLine: true
        },

        /**
         * Extends this with defaults and config.
         * Then calls initObservable, iniListenes and extractData methods.
         */
        initialize: function () {
            _.bindAll(this, 'toggle');

            return this._super();
        },

        /**
         * Calls initObservable of parent class.
         * Defines observable properties of instance.
         *
         * @return {Object} - reference to instance
         */
        initObservable: function () {
            this._super()
                .observe('hidden required');

            return this;
        },

        /**
         * Assignes onUpdate callback to update event of incoming element.
         * Calls extractData method.
         * @param  {Object} elem
         * @return {Object} - reference to instance
         */
        initElement: function (elem) {
            this._super();

            elem.on({
                'toggle': this.toggle
            });

            this.extractData();

            return this;
        },

        /**
         * Extracts label and required properties from child elements
         *
         * @return {Object} - reference to instance
         */
        extractData: function () {
            var elems = this.elems();

            this.required(extractData(elems, 'required', this.required()));

            return this;
        },

        /**
         * Sets incoming value to hidden observable, calls extractData method
         *
         * @param  {Boolean} value
         */
        toggle: function (value) {
            this.extractData()
                .hidden(value);
        },

        /**
         * Defines if group has only one element.
         * @return {Boolean}
         */
        isSingle: function () {
            return this.elems.getLength() === 1;
        },

        /**
         * Defines if group has multiple elements.
         * @return {Boolean}
         */
        isMultiple: function () {
            return this.elems.getLength() > 1;
        }
    });
});
