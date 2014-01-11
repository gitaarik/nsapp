define(
    [
        'utils/request'
    ],
    function(
        Request
    ) {
        'use strict';

        function StationsManager() {
            this.request = new Request('/api/v1/stationnames/', 'GET', 60 * 60 * 24);
        }

        StationsManager.prototype.getByCallback = function(success_callback, failed_callback) {
            this.request.execute(success_callback, failed_callback);
        };

        return StationsManager;

    }
);
