define(
    [
        'settings'
    ],
    function(
        settings
    ) {
        'use strict';

        var instance = null;

        function Stations() {
            this.success_callbacks = [];
            this.failed_callbacks = [];
            this.stations = null;
            this.is_fetching = false;
        }

        Stations.prototype.getStations = function() {

            if (this.is_fetching) {
                return;
            }

            var that = this;
            var request = new XMLHttpRequest();

            request.open('GET', settings.nsapi_base_url + '/api/v1/stations/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    that.is_fetching = false;

                    if (this.status == 200) {
                        that.receivedStations(JSON.parse(this.responseText));
                    } else {
                        that.failedToReceivedStations('server_not_reachable');
                    }

                }

            };

            this.is_fetching = true;
            request.send();

        };

        Stations.prototype.receivedStations = function(stations) {

            this.stations = stations;

            if (this.success_callbacks) {

                for (var key in this.success_callbacks) {
                    this.success_callbacks[key](this.stations);
                }

                this.success_callbacks = [];

            }

        };

        Stations.prototype.failedToReceivedStations = function(error_code) {

            if (this.failed_callbacks) {

                for (var key in this.failed_callbacks) {
                    this.failed_callbacks[key](error_code);
                }

                this.failed_callbacks = [];

            }

        };

        Stations.prototype.getByCallback = function(success_callback, failed_callback) {

            if (this.stations) {
                success_callback(this.stations);
            } else {

                this.success_callbacks.push(success_callback);
                if (failed_callback) this.failed_callbacks.push(failed_callback);

                this.getStations();

            }

        };

        Stations.getInstance = function() {
             if (instance === null) {
                 instance = new Stations();
             }
             return instance;
        };

        return Stations.getInstance();

    }
);
