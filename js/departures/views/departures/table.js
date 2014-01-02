define(
    [
        'nsapi/departures'
    ],
    function(
        Departures
    ) {
        'use strict';

        function DeparturesTableView(element, departures) {
            this.element = element;
            this.departures = departures;
            this.departures_table_container = document.getElementById('departures-table-container'); 
            this.departures_table_body = document.getElementById('departures-table-body');
            this.departures_not_available = document.getElementById('departures-not-available');
            this.departures_table_body_container = document.getElementById('departures-table-body-container');
        }

        DeparturesTableView.prototype.activate = function() {
            this.showDeparturesTable();
            this.setContentHeight();
            this.addEventListeners();
        };

        DeparturesTableView.prototype.deactivate = function() {
            this.removeEventListeners();
        };

        DeparturesTableView.prototype.addEventListeners = function() {
            var that = this;
            this.resizeEvent = function(event) {
                console.log('ja zors');
                that.setContentHeight();
            };
            window.addEventListener('resize', this.resizeEvent);
        };

        DeparturesTableView.prototype.removeEventListeners = function() {
            window.removeEventListener('resize', this.resizeEvent);
        };

        DeparturesTableView.prototype.setContentHeight = function() {
            this.departures_table_body_container.style.height = 
                (document.documentElement.clientHeight -
                 this.departures_table_body_container.offsetTop) + 'px';
        };

        DeparturesTableView.prototype.showDeparturesTable = function() {

            var that = this;

            function getDepartureTime(departure) {

                if (departure.vertrektijd) {

                    var departure_time_parsed = Date.parse(departure.vertrektijd);

                    if (departure_time_parsed) {

                        var departure_time = new Date(departure_time_parsed);
                        var hours = departure_time.getHours();
                        var minutes = departure_time.getMinutes();

                        if (hours < 10) hours = '0' + hours;
                        if (minutes < 10) minutes = '0' + minutes;

                        return hours + ':' + minutes;

                    }

                }

                return '';

            }

            function getTimeColumn(departure) {

                var time_column = document.createElement('td');
                var departure_time_el = document.createElement('div');

                departure_time_el.setAttribute('class', 'departure-time');
                departure_time_el.appendChild(document.createTextNode(
                    getDepartureTime(departure)
                ));

                time_column.setAttribute('class', 'time');
                time_column.appendChild(departure_time_el);

                if (departure.vertrekvertragingtekst) {

                    var delay_el = document.createElement('div');

                    delay_el.setAttribute('class', 'delay');
                    delay_el.appendChild(document.createTextNode(
                        departure.vertrekvertragingtekst
                    ));

                    time_column.appendChild(delay_el);

                }

                return time_column;

            }

            function getToColumn(departure) {

                var to_column = document.createElement('td');
                var destination_el = document.createElement('div');
                var train_type_el = document.createElement('div');

                destination_el.setAttribute('class', 'destination');
                destination_el.appendChild(
                    document.createTextNode(departure.eindbestemming)
                );

                train_type_el.setAttribute('class', 'train-type');
                train_type_el.appendChild(
                    document.createTextNode(departure.treinsoort)
                );

                to_column.setAttribute('class', 'to');
                to_column.appendChild(destination_el);
                to_column.appendChild(train_type_el);

                if (departure.routetekst) {

                    var route_info_el = document.createElement('div');

                    route_info_el.setAttribute('class', 'route-info');
                    route_info_el.appendChild(
                        document.createTextNode(departure.routetekst)
                    );

                    to_column.appendChild(route_info_el);

                }

                return to_column;

            }

            function getPlatformColumn(departure) {

                var platform_column = document.createElement('td');

                platform_column.setAttribute('class', 'platform');

                if (departure.vertrekspoor) {
                    // Sometimes buses are listed in the departures,
                    // they don't have platforms.

                    var platform_el = document.createElement('div');

                    platform_el.appendChild(
                        document.createTextNode(departure.vertrekspoor)
                    );

                    if (departure.vertrekspoor_gewijzigd) {
                        platform_el.setAttribute('class', 'platform-changed');
                    }

                    platform_column.appendChild(platform_el);

                }

                return platform_column;

            }

            function fillTable() {

                var table_body = that.departures_table_body;
                table_body.innerHTML = '';

                for (var key in that.departures) {

                    var departure = that.departures[key];
                    var time_column = getTimeColumn(departure);
                    var to_column = getToColumn(departure);
                    var platform_column = getPlatformColumn(departure);
                    var row = document.createElement('tr');

                    row.appendChild(time_column);
                    row.appendChild(to_column);
                    row.appendChild(platform_column);

                    table_body.appendChild(row);

                }

            }

            this.departures_table_container.style.display = 'block';
            this.departures_table_body_container.scrollTop = 0;
            this.departures_not_available.style.display = 'none';
            fillTable();

        };

        return DeparturesTableView;

    }
);
