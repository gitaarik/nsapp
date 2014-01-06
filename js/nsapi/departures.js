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

            this.departures[station] = {
                departures: departures,
                time_received: new Date()
            };

            if (station in this.success_callbacks) {

                for (var key in this.success_callbacks[station]) {
                    this.success_callbacks[station][key](
                        this.filterPastDepartures(
                            this.departures[station].departures
                        )
                    );
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

            var departures = this.getFromCache(station);

            if (departures) {
                success_callback(departures);
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

        Departures.prototype.getFromCache = function(station) {

            function isOutdated(cache) {
                // cache is outdated if it's older than 5 minutes
                return (new Date() - cache.time_received) > (1000 * 60 * 5);
            }

            if (
                station in this.departures &&
                !isOutdated(this.departures[station])
            ) {
                return this.filterPastDepartures(
                    this.departures[station].departures);
            }

        };

        /*
         * Filters departures that are in the past.
         */
        Departures.prototype.filterPastDepartures = function(departures) {

            var filtered_departures = [];

            for (var key in departures) {

                var departure = departures[key];

                // Give two minutes margin in case the train didn't
                // leave jet.
                if (
                    Date.parse(departure.departure_time_including_delay) >
                    Date.now() - (1000 * 120)
                ) {
                    filtered_departures.push(departure);
                }

            }

            return filtered_departures;

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
