'use strict';

define(
    [
    ],
    function(
    ) {

        function StationResults(element) {
            this.element = element;
            this.setContentHeight();
            this.initEventListeners();
        }

        StationResults.prototype.initEventListeners = function() {

            var that = this;

            this.element.addEventListener('click', function(event) {
                that.handleStationListClick(event);
            });

            window.addEventListener('resize', function(event) {
                that.setContentHeight();
            })

        }

        StationResults.prototype.setContentHeight = function() {
            this.element.style.height = 
                (document.documentElement.clientHeight -
                 this.element.offsetTop)
                + 'px';
        }

        StationResults.prototype.handleStationListClick = function(event) {

            if (event.target.className == 'station-option') {
                this.openStationDelegate(event.target.getAttribute('data-code'));
            }

        }

        StationResults.prototype.updateStations = function(stations) {

            this.element.innerHTML = '';

            for (var key in stations) {

                var station = stations[key];
                var stationEl = document.createElement('li');
                var name = document.createTextNode(station.name);

                stationEl.setAttribute('data-code', station.code);
                stationEl.setAttribute('class', 'station-option');
                stationEl.appendChild(name);

                this.element.appendChild(stationEl);

            }

        }

        return StationResults;

    }
);
