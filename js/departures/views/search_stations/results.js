define(
    [
    ],
    function(
    ) {
        'use strict';

        function SearchStationsResults(element) {
            this.element = element;
        }

        SearchStationsResults.prototype.activate = function() {
            this.addEventListeners();
            this.setContentHeight();
        };

        SearchStationsResults.prototype.deactivate = function() {
            this.removeEventListeners();
        };

        SearchStationsResults.prototype.addEventListeners = function() {

            var that = this;

            this.clickEvent = function(event) {
                that.handleStationListClick(event);
            };

            this.resizeEvent = function() {
                that.setContentHeight();
            };

            this.element.addEventListener('click', this.clickEvent);
            window.addEventListener('resize', this.resizeEvent);

        };

        SearchStationsResults.prototype.removeEventListeners = function() {
            this.element.removeEventListener('click', this.clickEvent);
            window.removeEventListener('resize', this.resizeEvent);
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
