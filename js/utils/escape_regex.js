define([], function() {
    'use strict';

    return function escapeRegExp(str) {
        // escapes a string for use in a regex.
        // http://stackoverflow.com/a/6969486/1248175
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

});
