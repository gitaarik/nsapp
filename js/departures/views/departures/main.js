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
        }

        DeparturesView.prototype.activate = function() {

            this.addEventListeners();
            this.loadDepartures(); 
            this.element.style.display = 'block';
            this.setHeaderName();

        };

        DeparturesView.prototype.deactivate = function() {

            this.removeEventListeners();
            this.element.style.display = 'none';

            if (this.success) {
                this.departuresTableView.deactivate();
            }

        };

        DeparturesView.prototype.addEventListeners = function() {

            var that = this;

            this.windowFocusEvent = function() {
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
                    that.success = true;
                    that.showDeparturesTable(departures);
                },
                function(error_code) {
                    // failed
                    that.success = false;

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

        DeparturesView.prototype.showDeparturesTable = function(departures) {

            this.departures_loader_el.style.display = 'none';
            this.departures_table_container_el.style.display = 'block';

            this.departuresTableView = new DeparturesTableView(
                document.getElementById('departures-table-container'),
                departures
            );
            this.departuresTableView.activate();

        };

        DeparturesView.prototype.setHeaderName = function() {
            var header_el = this.element.getElementsByTagName('header')[0];
            header_el.innerHTML = '';
            header_el.appendChild(document.createTextNode(this.station.name));
        };

        DeparturesView.prototype.showLoader = function(departures) {
            this.departures_table_container_el.style.display = 'none';
            this.departures_not_available_el.style.display = 'none';
            this.departures_no_connection.style.display = 'none';
            this.departures_loader_el.style.display = 'block';
        };

        DeparturesView.prototype.showNotAvailable = function(departures) {
            this.departures_table_container_el.style.display = 'none';
            this.departures_loader_el.style.display = 'none';
            this.departures_no_connection.style.display = 'none';
            this.departures_not_available_el.style.display = 'block';
        };

        DeparturesView.prototype.showNoConnection = function(departures) {
            this.departures_table_container_el.style.display = 'none';
            this.departures_loader_el.style.display = 'none';
            this.departures_not_available_el.style.display = 'none';
            this.departures_no_connection.style.display = 'block';
        };

        return DeparturesView;

    }
);

