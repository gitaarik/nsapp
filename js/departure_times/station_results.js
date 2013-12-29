'use strict';

define(['utils/escape_regex'], function(escape_regex) {

    function StationResults(element) {
        this.element = element;
    }

    StationResults.prototype.foundStations = function(foundStations) {

        var stationsList = this.element.getElementsByClassName('stations')[0];

        while (stationsList.hasChildNodes()) {
            stationsList.removeChild(stationsList.lastChild);
        }

        for (var key in foundStations) {

            var foundStation = foundStations[key];
            var stationEl = document.createElement('li');
            var name = document.createTextNode(foundStation.name);

            stationEl.appendChild(name);
            stationsList.appendChild(stationEl);

        }

    }

    return StationResults;

});

