'use strict';

define(
    [
        'nsapi/station_names',
        'nsapi/stations',
        'utils/escape_regex',
        'utils/levenshtein'
    ],
    function(
        StationNames,
        Stations,
        escape_regex,
        levenshtein
    ) {

        function SearchStations(element) {

            var that = this;
            this.station_names = null;
            this.stations = null;
            this.callback = null;
            this.searchTerm = null;

            StationNames.getByCallback(function(station_names) {
                that.station_names = station_names;
                that.getResults();
            });

            Stations.getByCallback(function(stations) {
                that.stations = stations;
                that.getResults();
            });

        }

        SearchStations.prototype.isReady = function() {
            return (
                this.station_names !== null &&
                this.stations !== null &&
                this.searchTerm !== null &&
                this.callback !== null
            );
        }

        SearchStations.prototype.getByCallback = function(searchTerm, callback) {
            this.callback = callback;
            this.searchTerm = searchTerm;
            this.getResults();
        }

        SearchStations.prototype.getResults = function() {

            if (!this.isReady()) {
                return;
            }

            var matches = [];

            if (!(this.station_names && this.stations)) {
                // TODO: stations aren't fetched yet, display a loader image
                // until stations are fetched and search can take place.
            }

            matches = this.search();
            matches = matches.sort(function(a, b) {
                return a.levenshtein - b.levenshtein;
            });

            this.callback(matches);

        }

        SearchStations.prototype.search = function() {

            var that = this;

            /**
             * Returns the regexes to use for searching for station
             * names.
             */
            function getRegexes() {

                var regexes = [];
                var searchWords = that.searchTerm.split(' ');

                for (var word in searchWords) {
                    regexes.push(
                        new RegExp(escape_regex(searchWords[word]), 'i')
                    );
                }

                return regexes;

            }

            /**
             * Returns whether a station matches or not.
             */
            function matchStation(name, regexes) {

                var match = true;

                for (var regex in regexes) {
                    if (name.search(regexes[regex]) == -1) {
                        match = false;
                    }
                }

                return match;

            }

            /**
             * Returns the matches for the searchTerm.
             */
            function getMatches() {

                var matches = [];
                var regexes = getRegexes();

                for (var name in that.station_names) {

                    if (matchStation(name, regexes)) {

                        var code = that.station_names[name];
                        var station = that.stations[code];

                        matches.push({
                            'code': code,
                            'name': station.name,
                            'levenshtein': levenshtein(that.searchTerm, name)
                        });

                    }

                }

                return matches;

            }

            return getMatches();

        }

        return SearchStations;

    }
);
