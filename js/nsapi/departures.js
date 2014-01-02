define(
    [
        'settings'
    ],
    function(
        settings
    ) {
        'use strict';

        var instance = null;

        function Departures() {
            this.success_callbacks = {};
            this.failed_callbacks = {};
            this.departures = {};
        }

        Departures.prototype.getDepartures = function(station) {

            var that = this;
            var request = new XMLHttpRequest();

            request.open('GET', settings.nsapi_base_url + '/api/v1/departures/' + station + '/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    if (this.status == 200) {
                        that.receivedDepartures(station, JSON.parse(this.responseText));
                    } else if (this.status == 404) {
                        that.failedToReceiveDepartures(station, 'not-found');
                    } else {
                        console.log("Failed to fetch departures. Response status: " + request.status);
                    }

                }

            };

            request.send();

        };

        Departures.prototype.receivedDepartures = function(station, departures) {

            this.departures[station] = departures;

            if (station in this.success_callbacks) {

                for (var key in this.success_callbacks[station]) {
                    this.success_callbacks[station][key](this.departures[station]);
                }

                delete this.success_callbacks[station];

            }

        };

        Departures.prototype.failedToReceiveDepartures = function(station, error_code) {

            for (var key in this.failed_callbacks[station]) {
                this.failed_callbacks[station][key](error_code);
            }

            this.failed_callback = {};

        };

        Departures.prototype.getByCallback = function(station, success_callback, failed_callback) {

            if (station in this.departures) {
                success_callback(this.departures[station]);
            } else {

                if (!(station in this.success_callbacks)) {
                    this.success_callbacks[station] = [];
                }

                if (failed_callback) {

                    if(!(station in this.failed_callbacks)) {
                        this.failed_callbacks[station] = [];
                    }

                    this.failed_callbacks[station].push(failed_callback);

                }

                this.success_callbacks[station].push(success_callback);
                this.getDepartures(station);

            }

        };

        Departures.getInstance = function() {
             if (instance === null) {
                 instance = new Departures();
             }
             return instance;
        };

        return Departures.getInstance();

    }
);
