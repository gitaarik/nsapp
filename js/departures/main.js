'use strict';

define(
    [
        'nsapi/stations',
        'departures/helpers/search_stations',
        'departures/views/station_results',
        'departures/views/search_stations',
        'departures/views/departures',
    ],
    function(
        Stations,
        SearchStations,
        StationResultsView,
        SearchStationsView,
        DeparturesView
    ) {

        function Departures() {

            var that = this;
            this.stationResultsView = new StationResultsView(
                document.getElementById('station-results')
            );
            this.searchStationsView = new SearchStationsView(
                document.getElementById('search-station')
            );

            this.searchStations = new SearchStations();

            this.stationResultsView.openStationDelegate = function(station_code) {
                that.showDepartures(station_code);
            }

            this.searchStationsView.searchTermUpdatedDelegate = function(searchTerm) {
                that.showStationResults(searchTerm);
            }

        }

        Departures.prototype.showStationResults = function(searchTerm) {

            var that = this;
            searchTerm = searchTerm.trim();

            if (searchTerm.length > 2) {

                // TODO: add loader and remove loader on callback.

                this.searchStations.getByCallback(searchTerm, function(stations) {
                    that.stationResultsView.updateStations(stations);
                });

            }

        }

        Departures.prototype.showDepartures = function(station_code) {

            var departuresEl = document.getElementById('departures');

            document.getElementById('stations').style.display = 'none';

            Stations.getByCallback(function(stations) {
                departuresEl.style.display = 'block';
                new DeparturesView(departuresEl, stations[station_code]);
            });

        }

        return Departures;

    }
);
