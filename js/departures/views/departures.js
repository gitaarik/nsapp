'use strict';

define(
    [
        'nsapi/departures'
    ],
    function(
        Departures
    ) {

        function DeparturesView(element, station) {

            this.element = element;
            this.station = station;

            console.log(this.element);
            console.log(this.station);

        }

        return DeparturesView;

    }
);
