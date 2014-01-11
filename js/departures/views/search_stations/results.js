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

            var class_name = event.target.className;
            var station = event.target.station;

            if (['station-option', 'name'].indexOfclass_name) > -1) {
                this.openStationDelegate(station);
            } else if (class_name == 'favorite') {
                this.addStationToFavorites(station);
            }

        };

        SearchStationsResults.prototype.addStationToFavorites = function(stations) {
            // make star bright
            // call addstationToFavoritesDelegate
        };

        SearchStationsResults.prototype.updateStations = function(stations) {

            this.element.innerHTML = '';

            for (var key in stations) {

                var station = stations[key];
                var stationEl = document.createElement('li');
                var favorite_el = document.createElement('div');
                var name_el = document.createElement('div');
                var name_text = document.createTextNode(station.name);

                name_el.setAttribute('class', 'name');
                name_el.appendChild(name_text);

                favorite_el.setAttribute('class', 'favorite');

                stationEl.station = station;
                stationEl.setAttribute('class', 'station-option');
                stationEl.appendChild(name_el);
                stationEl.appendChild(favorite_el);

                this.element.appendChild(stationEl);

            }

        };

        return SearchStationsResults;

    }
);
