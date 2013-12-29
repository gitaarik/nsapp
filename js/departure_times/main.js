'use strict';

define(
    [
        'departure_times/station_results',
        'departure_times/search_stations'
    ],
    function(
        StationResults,
        SearchStations
    ) {

        return (function() {

            var stationResults = new StationResults(
                document.getElementById('station-results')
            );

            var searchStations = new SearchStations(
                document.getElementById('search-station'),
                stationResults
            );

        });

    }
);
