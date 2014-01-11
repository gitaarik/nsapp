define(
    [
        'utils/request'
    ],
    function(
        Request
    ) {
        'use strict';

        function StationsManager(station) {
            this.request = new Request('/api/v1/departures/' + station + '/', 'GET', 60);
        }

        StationsManager.prototype.getByCallback = function(success_callback, failed_callback) {
            this.request.execute(success_callback, failed_callback);
        };

        return StationsManager;

    }
);
