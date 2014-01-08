define(
    [
        'nsapi/stations',
        'nsapi/departures',
        'departures/views/departures/table'
    ],
    function(
        Stations,
        Departures,
        DeparturesTableView
    ) {
        'use strict';

        function DeparturesView(element, station) {
            var that = this;
            this.element = element;
            this.station = station;
            this.departures_table_container_el = document.getElementById('departures-table-container'); 
            this.departures_loader_el = document.getElementById('departures-loader');
            this.departures_not_available_el = document.getElementById('departures-not-available');
            this.departures_no_connection = document.getElementById('departures-no-connection');
            this.departures_table_loader_el = document.getElementById('departures-table-loader');
            this.departures_table_no_connection_el = document.getElementById('departures-table-no-connection');
            this.departures = null;
        }

        DeparturesView.prototype.activate = function() {
            this.addEventListeners();
            this.loadDepartures(); 
            this.setHeaderName();
            this.element.style.display = 'block';
        };

        DeparturesView.prototype.deactivate = function() {

            this.removeEventListeners();
            this.element.style.display = 'none';

            if (this.departures) {
                this.departuresTableView.deactivate();
            }

        };

        DeparturesView.prototype.addEventListeners = function() {

            var that = this;

            this.windowFocusEvent = function() {

                if (that.departures) {
                    that.showDeparturesTable();
                }

                that.loadDepartures();

            };

            window.addEventListener('focus', this.windowFocusEvent);

        };

        DeparturesView.prototype.removeEventListeners = function() {
            window.removeEventListener('focus', this.windowFocusEvent);
        };

        DeparturesView.prototype.loadDepartures = function() {

            var that = this;

            this.showLoader();

            Departures.getByCallback(
                this.station.code,
                function(departures) {
                    // success
                    that.departures = departures;
                    that.showDeparturesTable();
                },
                function(error_code) {
                    // failed

                    switch(error_code) {

                        case 'not_found':
                            that.showNotAvailable(departures);
                            break;

                        case 'server_not_reachable':
                            that.showNoConnection(departures);
                            break;

                    }

                }
            );

        };

        DeparturesView.prototype.showDeparturesTable = function() {

            this.filterPastDepartures();

            this.departures_loader_el.style.display = 'none';
            this.departures_table_loader_el.style.display = 'none';
            this.departures_table_container_el.style.display = 'block';

            this.departuresTableView = new DeparturesTableView(
                document.getElementById('departures-table-container'),
                this.departures
            );
            this.departuresTableView.activate();

        };

        DeparturesView.prototype.filterPastDepartures = function() {

            var filtered_departures = [];

            for (var key in this.departures) {

                var departure = this.departures[key];

                // Give four minutes margin in case the train didn't
                // leave jet.
                if (
                    Date.parse(departure.departure_time_including_delay) >
                    Date.now() - (1000 * 60 * 4)
                ) {
                    filtered_departures.push(departure);
                }

            }

            this.departures = filtered_departures;

        };

        DeparturesView.prototype.setHeaderName = function() {
            var header_el = this.element.getElementsByTagName('header')[0];
            header_el.innerHTML = '';
            header_el.appendChild(document.createTextNode(this.station.name));
        };

        DeparturesView.prototype.showLoader = function(departures) {

            if (this.departures) {
                this.departures_table_no_connection_el.style.display = 'none';
                this.departures_table_loader_el.style.display = 'block';
            } else {
                this.departures_table_container_el.style.display = 'none';
                this.departures_table_loader_el.style.display = 'none';
                this.departures_not_available_el.style.display = 'none';
                this.departures_no_connection.style.display = 'none';
                this.departures_loader_el.style.display = 'block';
            }

        };

        DeparturesView.prototype.showNotAvailable = function(departures) {
            this.departures_table_container_el.style.display = 'none';
            this.departures_loader_el.style.display = 'none';
            this.departures_no_connection.style.display = 'none';
            this.departures_not_available_el.style.display = 'block';
        };

        DeparturesView.prototype.showNoConnection = function(departures) {

            if (this.departures) {
                this.departures_table_loader_el.style.display = 'none';
                this.departures_table_no_connection_el.style.display = 'block';
            } else {
                this.departures_table_container_el.style.display = 'none';
                this.departures_loader_el.style.display = 'none';
                this.departures_not_available_el.style.display = 'none';
                this.departures_no_connection.style.display = 'block';
            }

        };

        return DeparturesView;

    }
);

