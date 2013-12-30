'use strict';

define(
    [
    ],
    function(
    ) {

        var instance = null;

        function Departures() {
            this.callbacks = {};
            this.departures = {};
        }

        Departures.prototype.getDepartures = function(station) {

            var that = this;
            var request = new XMLHttpRequest();

            request.open('GET', 'http://localhost:8000/api/v1/departures/' + station + '/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    if (this.status == 200) {
                        that.receivedDepartures(station, JSON.parse(this.responseText));
                    } else {
                        console.log("Failed to fetch departures. Response status: " + request.status);
                    }

                }

            };

            request.send();

        }

        Departures.prototype.receivedDepartures = function(station, departures) {

            this.departures[station] = departures;

            if (station in this.callbacks) {

                for (var key in this.callbacks[station]) {
                    this.callbacks[station][key](this.departures[station]);
                }

                delete this.callbacks[station];

            }

        }

        Departures.prototype.getByCallback = function(station, callback) {

            if (station in this.departures) {
                callback(this.departures[station]);
            } else {

                if (!(station in this.callbacks)) {
                    this.callbacks[station] = [];
                }

                this.callbacks[station].push(callback);
                this.getDepartures(station);

            }

        }

        Departures.getInstance = function() {
             if (instance === null) {
                 instance = new Departures();
             }
             return instance;
        }

        return Departures.getInstance();

    }
);
