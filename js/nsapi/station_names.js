'use strict';

define(
    [
    ],
    function(
    ) {

        var instance = null;

        function StationNames() {
            this.callbacks = [];
            this.station_names = null;
        }

        StationNames.prototype.getStationNames = function() {

            var that = this;
            var request = new XMLHttpRequest();

            request.open('GET', 'http://localhost:8000/api/v1/stationnames/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    if (this.status == 200) {
                        that.receivedStationNames(JSON.parse(this.responseText));
                    } else {
                        console.log("Failed to fetch station names. Response status: " + request.status);
                    }

                }

            };

            request.send();

        }

        StationNames.prototype.receivedStationNames = function(station_names) {

            this.station_names = station_names;

            if (this.callbacks) {

                for (var key in this.callbacks) {
                    this.callbacks[key](this.station_names);
                }

                this.callbacks = [];

            }

        }

        StationNames.prototype.getByCallback = function(callback) {

            if (this.station_names === null) {
                this.callbacks.push(callback);
                this.getStationNames();
            } else {
                callback(this.station_names);
            }

        }

        StationNames.getInstance = function() {
             if (instance === null) {
                 instance = new StationNames();
             }
             return instance;
        }

        return StationNames.getInstance();

    }
);
