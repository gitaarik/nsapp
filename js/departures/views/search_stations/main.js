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
            this.station_results_container_el = document.getElementById('station-results-container');
            this.station_results_no_results_el = document.getElementById('station-results-no-results');
            this.station_results_el = document.getElementById('station-results');
            this.station_results_loader_el = document.getElementById('station-results-loader');
            this.search_station_input_container_el = document.getElementById('search-station-input-container');
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

            this.searchStationsInputView = new SearchStationsInputView(this.search_station_input_container_el);
            this.searchStationsInputView.searchTermUpdatedDelegate = function(search_term) {
                that.processSearchTerm(search_term);
            };
            this.searchStationsInputView.activate();

        };

        SearchStationsView.prototype.deactivate = function() {
            this.searchStationsResultsView.deactivate();
            this.searchStationsInputView.deactivate();
            this.element.style.display = 'none';
        };

        SearchStationsView.prototype.processSearchTerm = function(search_term) {

            var that = this;
            search_term = search_term.trim();

            if (search_term.length > 1) {

                this.showLoader();

                this.searchStations.getByCallback(search_term, function(stations) {

                    if (stations.length) {
                        that.showStationResults(stations);
                    } else {
                        that.showNoResultsMessage();
                    }

                });

            } else {
                that.showStationResults([]);
            }

        };

        SearchStationsView.prototype.showStationResults = function(stations) {

            this.station_results_no_results_el.style.display = 'none';
            this.station_results_loader_el.style.display = 'none';
            this.station_results_container_el.style.display = 'block';

            this.searchStationsResultsView.updateStations(stations);

        };

        SearchStationsView.prototype.showNoResultsMessage = function() {
            this.station_results_container_el.style.display = 'none';
            this.station_results_loader_el.style.display = 'none';
            this.station_results_no_results_el.style.display = 'block';
        };

        SearchStationsView.prototype.showLoader = function() {
            this.station_results_container_el.style.display = 'none';
            this.station_results_no_results_el.style.display = 'none';
            this.station_results_loader_el.style.display = 'block';
        };

        return SearchStationsView;

    }
);
