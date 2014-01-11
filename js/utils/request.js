define(
    [
        'settings'
    ],
    function(
        settings
    ) {
        'use strict';

        var CACHE = {};

        function Request(path, method, cache_seconds) {

            if (!method) {
                method = 'GET';
            }

            if (!cache_seconds) {
                cache_seconds = 0;
            }

            this.path = path;
            this.method = method;
            this.cache_seconds = cache_seconds;
            this.cache_key = this.path + '_' + this.method;

        }

        Request.prototype.execute = function(success_callback, failed_callback) {

            var cache = this.getFromCache();

            if (cache) {
                success_callback(cache);
            } else {
                this.request(success_callback, failed_callback);
            }

        };

        Request.prototype.request = function(success_callback, failed_callback) {

            var that = this;
            var request = new XMLHttpRequest();

            request.open(this.method, settings.nsapi_base_url + this.path);
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    if (this.status == 200) {
                        that.requestSuccessful(this.responseText, success_callback);
                    } else if (this.status == 404) {
                        failed_callback('not_found');
                    } else {
                        failed_callback('server_not_reachable');
                    }

                }

            };

            request.send();

        };

        Request.prototype.requestSuccessful = function(responseText, callback) {

            var data = JSON.parse(responseText);

            CACHE[this.cache_key] = {
                time_received: Date.now(),
                data: data
            };

            callback(data);

        };

        Request.prototype.getFromCache = function(success_callback, failed_callback) {

            var that = this;

            function isOutdated(cache) {
                return (new Date() - cache.time_received) > (1000 * that.cache_seconds);
            }

            if (this.cache_key in CACHE && !isOutdated(CACHE[this.cache_key])) {
                return CACHE[this.cache_key].data;
            }

        };

        return Request;

    }
);
