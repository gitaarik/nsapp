'use strict';

define(
    [
    ],
    function(
    ) {

        var instance = null;

        function Stations() {
            this.callbacks = [];
            this.stations = null;
        }

        Stations.prototype.getStations = function() {

            var that = this;
            var request = new XMLHttpRequest();

            request.open('GET', 'http://localhost:8000/api/v1/stations/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    if (this.status == 200) {
                        that.receivedStations(JSON.parse(this.responseText));
                    } else {
                        console.log("Failed to fetch stations. Response status: " + request.status);
                    }

                }

            };

            request.send();

        }

        Stations.prototype.receivedStations = function(stations) {

            this.stations = stations;

            if (this.callbacks) {

                for (var key in this.callbacks) {
                    this.callbacks[key](this.stations);
                }

                this.callbacks = [];

            }

        }

        Stations.prototype.getByCallback = function(callback) {

            if (this.stations === null) {
                this.callbacks.push(callback);
                this.getStations();
            } else {
                callback(this.stations);
            }

        }

        Stations.getInstance = function() {
             if (instance === null) {
                 instance = new Stations();
             }
             return instance;
        }

        return Stations.getInstance();

    }
);
