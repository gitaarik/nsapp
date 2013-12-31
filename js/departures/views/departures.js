'use strict';

define(
    [
        'nsapi/departures'
    ],
    function(
        Departures
    ) {

        function DeparturesView(element, station) {

            var that = this;
            this.element = element;
            this.station = station;
            this.departures_table = document.getElementById('departures-table');
            this.departures_not_available = document.getElementById('departures-not-available');

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

        }

        DeparturesView.prototype.showDeparturesTable = function(departures) {

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

                var time_column = document.createElement('td')
                var departure_time_el = document.createElement('div');

                departure_time_el.setAttribute('class', 'departure-time');
                departure_time_el.appendChild(document.createTextNode(
                    getDepartureTime(departure)
                ));

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

                var table_body = that.departures_table.getElementsByTagName('tbody')[0];
                table_body.innerHTML = '';

                for (var key in departures) {

                    var departure = departures[key];

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

            this.departures_table.style.display = 'table';
            this.departures_not_available.style.display = 'none';
            fillTable();

        }

        DeparturesView.prototype.showError = function(departures) {
            this.departures_table.style.display = 'none';
            this.departures_not_available.style.display = 'block';
        }

        return DeparturesView;

    }
);
