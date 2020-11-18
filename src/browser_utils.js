/**
 * @file Miscellaneous browser utilities
 * @author Andrew Sayers <andrew-github.com@pileofstuff.org>
 * @copyright 2020
 * @license MIT
 */

"use strict";

/**
 * Miscellaneous browser utilities
 * @namespace
 */
var browser_utils = {

    /**
     * Fix annoying issues with specific web browsers
     *
     * <p>Current functionality described below, but might change in future.</p>
     *
     * <p>
     *   <strong>Disable Firefox's bfcache:</strong>
     *   Firefox has a featured called "bfcache", where going back and forward in history
     *   just reloads a page's state when you left, without triggering any events.
     *   Pages usually need to reload the diary from localStorage on navigation,
     *   so this function disables bfcache for the current page.
     * </p>
     *
     * @example
     *   browser_utils.fix_browser_issues();
     */
    fix_browser_issues: function() {
        try {
            window.onunload = function(){};
        } catch (e) {}
    },

    /**
     * Create an object containing URL parameters
     *
     * @example
     *   var search_params = browser_utils.parse_search_params(location.search);
     *   // Given a URL like ...?multi=value1&multi=value2&single=value
     *   {
     *     "multi": [
     *      "value1",
     *      "value2"
     *     ],
     *     "single": "value"
     *   }
     */
    parse_search_params: function(search) {
        var ret = {};
        if ( search.length ) {
            // we avoid URLSearchParams, in case anyone still needs IE compatibility
            search
                .substr(1)
                .split('&')
                .forEach(function(param) {
                    return param.replace(/^([^=]*)(.*)/,function(_,key,value) {
                        value = value.length ? value.substr(1) : null;
                        if ( ret.hasOwnProperty(key) ) {
                            if ( typeof ret[key] == 'string' ) {
                                ret[key] = [ ret[key], value ];
                            } else {
                                ret.push(value);
                            }
                        } else {
                            ret[key] = value;
                        }
                    })
                });
        }
        return ret;
    },

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = browser_utils;
    try { window.browser_utils = browser_utils } catch (e) {};
}
