define(
    [
        'departures/helpers/search_stations',
        'departures/views/search_stations/input',
        'departures/views/search_stations/results'
    ],
    function(
        SearchStations,
        SearchStationsInputView,
        SearchStationsResultsView
    ) {
        'use strict';

        function SearchStationsView(element) {
            this.element = element;
            this.search_station_input_el = document.getElementById('search-station-input');
            this.station_results_el = document.getElementById('station-results');
            this.searchStations = new SearchStations();
        }

        SearchStationsView.prototype.activate = function() {

            var that = this;
            this.element.style.display = 'block';

            this.searchStationsResultsView = new SearchStationsResultsView(this.station_results_el);
            this.searchStationsResultsView.openStationDelegate = function(station) {
                that.openStationDelegate(station);
            };
            this.searchStationsResultsView.activate();

            this.searchStationsInputView = new SearchStationsInputView(this.search_station_input_el);
            this.searchStationsInputView.searchTermUpdatedDelegate = function(search_term) {
                that.showStationResults(search_term);
            };
            this.searchStationsInputView.activate();

        };

        SearchStationsView.prototype.deactivate = function() {
            this.searchStationsResultsView.deactivate();
            this.searchStationsInputView.deactivate();
            this.element.style.display = 'none';
        };

        SearchStationsView.prototype.showStationResults = function(search_term) {

            var that = this;
            search_term = search_term.trim();

            if (search_term.length > 2) {

                // TODO: add loader and remove loader on callback.

                this.searchStations.getByCallback(search_term, function(stations) {
                    that.searchStationsResultsView.updateStations(stations);
                });

            } else {
                that.searchStationsResultsView.updateStations([]);
            }

        };

        return SearchStationsView;

    }
);
