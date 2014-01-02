define(
    [
    ],
    function(
    ) {
        'use strict';

        function SearchStationsResults(element) {
            this.element = element;
            this.setContentHeight();
            this.initEventListeners();
        }

        SearchStationsResults.prototype.initEventListeners = function() {

            var that = this;

            this.element.addEventListener('click', function(event) {
                that.handleStationListClick(event);
            });

            window.addEventListener('resize', function(event) {
                that.setContentHeight();
            });

        };

        SearchStationsResults.prototype.setContentHeight = function() {
            this.element.style.height = 
                (document.documentElement.clientHeight -
                 this.element.offsetTop) + 'px';
        };

        SearchStationsResults.prototype.handleStationListClick = function(event) {

            if (event.target.className == 'station-option') {
                this.openStationDelegate(event.target.station);
            }

        };

        SearchStationsResults.prototype.updateStations = function(stations) {

            this.element.innerHTML = '';

            for (var key in stations) {

                var station = stations[key];
                var stationEl = document.createElement('li');
                var name = document.createTextNode(station.name);

                stationEl.station = station;
                stationEl.setAttribute('class', 'station-option');
                stationEl.appendChild(name);

                this.element.appendChild(stationEl);

            }

        };

        return SearchStationsResults;

    }
);
