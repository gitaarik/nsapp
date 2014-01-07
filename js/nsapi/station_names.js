define(
    [
        'settings'
    ],
    function(
        settings
    ) {
        'use strict';

        var instance = null;

        function StationNames() {
            this.success_callbacks = [];
            this.failed_callbacks = [];
            this.station_names = null;
            this.is_fetching = false;
        }

        StationNames.prototype.getStationNames = function() {

            if (this.is_fetching) {
                return;
            }

            var that = this;
            var request = new XMLHttpRequest();

            request.open('GET', settings.nsapi_base_url + '/api/v1/stationnames/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    that.is_fetching = false;

                    if (this.status == 200) {
                        that.receivedStationNames(JSON.parse(this.responseText));
                    } else {
                        that.failedToReceivedStationNames('server_not_reachable');
                    }

                }

            };

            this.is_fetching = true;
            request.send();

        };

        StationNames.prototype.receivedStationNames = function(station_names) {

            this.station_names = station_names;

            if (this.success_callbacks) {

                for (var key in this.success_callbacks) {
                    this.success_callbacks[key](this.station_names);
                }

                this.success_callbacks = [];

            }

        };

        StationNames.prototype.failedToReceivedStationNames = function(error_code) {

            if (this.failed_callbacks) {

                for (var key in this.failed_callbacks) {
                    this.failed_callbacks[key](error_code);
                }

                this.failed_callbacks = [];

            }

        };

        StationNames.prototype.getByCallback = function(success_callback, failed_callback) {

            if (this.station_names) {
                success_callback(this.station_names);
            } else {

                this.success_callbacks.push(success_callback);
                if (failed_callback) this.failed_callbacks.push(failed_callback);

                this.getStationNames();

            }

        };

        StationNames.getInstance = function() {
             if (instance === null) {
                 instance = new StationNames();
             }
             return instance;
        };

        return StationNames.getInstance();

    }
);
