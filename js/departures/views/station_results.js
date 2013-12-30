'use strict';

define(
    [
    ],
    function(
    ) {

        function StationResults(element) {
            this.element = element;
            this.initEventListeners();
        }

        StationResults.prototype.initEventListeners = function() {

            var that = this;
            var stationList = this.element.getElementsByClassName('stations')[0];

            stationList.addEventListener('click', function(event) {
                that.handleStationListClick(event);
            });

        }

        StationResults.prototype.handleStationListClick = function(event) {

            if (event.target.className == 'station-option') {
                this.openStationDelegate(event.target.getAttribute('data-code'));
            }

        }

        StationResults.prototype.updateStations = function(stations) {

            var stationsList = this.element.getElementsByClassName('stations')[0];

            while (stationsList.hasChildNodes()) {
                stationsList.removeChild(stationsList.lastChild);
            }

            for (var key in stations) {

                var station = stations[key];
                var stationEl = document.createElement('li');
                var name = document.createTextNode(station.name);

                stationEl.setAttribute('data-code', station.code);
                stationEl.setAttribute('class', 'station-option');
                stationEl.appendChild(name);
                stationsList.appendChild(stationEl);

            }

        }

        return StationResults;

    }
);
