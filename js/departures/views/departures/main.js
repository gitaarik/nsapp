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
            this.departures_table_container = document.getElementById('departures-table-container'); 
            this.departures_not_available = document.getElementById('departures-not-available');
        }

        DeparturesView.prototype.activate = function() {

            var that = this;

            // TODO: show loading screen

            Departures.getByCallback(
                this.station.code,
                function(departures) {
                    // success
                    that.showDeparturesTable(departures);
                },
                function(error_code) {
                    // failed
                    that.showError(departures);
                }
            );

            this.element.style.display = 'block';
            this.setHeaderName();

        };

        DeparturesView.prototype.deactivate = function() {
            this.element.style.display = 'none';
        };

        DeparturesView.prototype.showDeparturesTable = function(departures) {
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

        DeparturesView.prototype.showError = function(departures) {
            this.departures_table_container.style.display = 'none';
            this.departures_not_available.style.display = 'block';
        };

        return DeparturesView;

    }
);

