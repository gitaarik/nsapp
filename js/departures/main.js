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
            this.initViews();
            this.initEventListeners();
        }

        Departures.prototype.initEventListeners = function() {

            var that = this;

            this.back_button_el.addEventListener('click', function() {
                that.backButtonPressed();
            });

        }

        Departures.prototype.initViews = function() {

            var that = this;

            this.back_button_el = document.getElementById('departures-back-button');
            this.stations_el = document.getElementById('stations');
            this.search_station_input_el = document.getElementById('search-station-input');
            this.departures_el = document.getElementById('departures');

            this.search_station_input_el.focus();

            this.stationResultsView = new StationResultsView(
                document.getElementById('station-results')
            );
            this.searchStationsView = new SearchStationsView(this.search_station_input_el);
            this.searchStations = new SearchStations();

            this.stationResultsView.openStationDelegate = function(station_code) {
                that.showDepartures(station_code);
            }

            this.searchStationsView.searchTermUpdatedDelegate = function(search_term) {
                that.showStationResults(search_term);
            }

        }

        Departures.prototype.showStationResults = function(search_term) {

            var that = this;
            search_term = search_term.trim();

            if (search_term.length > 2) {

                // TODO: add loader and remove loader on callback.

                this.searchStations.getByCallback(search_term, function(stations) {
                    that.stationResultsView.updateStations(stations);
                });

            } else {
                that.stationResultsView.updateStations([]);
            }

        }

        Departures.prototype.showDepartures = function(station_code) {

            var that = this;
            this.stations_el.style.display = 'none';

            // TODO: add loader and remove loader on callback.

            Stations.getByCallback(function(stations) {

                function setHeaderName(station) {
                    var header_el = that.departures_el.getElementsByTagName('header')[0];
                    header_el.innerHTML = '';
                    header_el.appendChild(document.createTextNode(station.name));
                }

                var station = stations[station_code];

                that.departures_el.style.display = 'block';
                that.back_button_el.style.display = 'block';

                setHeaderName(station);

                new DeparturesView(that.departures_el, station);

            });

        }

        Departures.prototype.backButtonPressed = function() {
            this.departures_el.style.display = 'none';
            this.back_button_el.style.display = 'none';
            this.stations_el.style.display = 'block';
            this.search_station_input_el.focus();
        }

        return Departures;

    }
);
