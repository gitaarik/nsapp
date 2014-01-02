define(
    [
        'departures/views/search_stations/main',
        'departures/views/departures/main',
    ],
    function(
        SearchStationsView,
        DeparturesView
    ) {
        'use strict';

        function Departures() {
            this.initViews();
            this.initEventListeners();
        }

        Departures.prototype.initViews = function() {

            var that = this;

            this.back_button_el = document.getElementById('departures-back-button');
            this.search_stations_el = document.getElementById('search-stations');
            this.departures_el = document.getElementById('departures');

            this.searchStationsView = new SearchStationsView(this.search_stations_el);

            this.searchStationsView.openStationDelegate = function(station) {
                that.showDepartures(station);
            };

            this.searchStationsView.activate();

        };

        Departures.prototype.initEventListeners = function() {

            var that = this;

            this.back_button_el.addEventListener('click', function() {
                that.backButtonPressed();
            });

        };

        Departures.prototype.showDepartures = function(station) {

            this.back_button_el.style.display = 'block';
            this.searchStationsView.deactivate();

            this.departuresView = new DeparturesView(
                document.getElementById('departures'),
                station
            );
            this.departuresView.activate();

        };

        Departures.prototype.backButtonPressed = function() {
            this.back_button_el.style.display = 'none';
            this.departuresView.deactivate();
            this.searchStationsView.activate();
        };

        return Departures;

    }
);
