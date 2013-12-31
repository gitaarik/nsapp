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
            this.search_term = null;

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
                this.search_term !== null &&
                this.callback !== null
            );
        }

        SearchStations.prototype.getByCallback = function(search_term, callback) {
            this.callback = callback;
            this.search_term = search_term;
            this.getResults();
        }

        SearchStations.prototype.getResults = function() {

            function sortStations(stations) { 
                return stations.sort(function(a, b) {
                    return a.levenshtein - b.levenshtein;
                });
            }

            function removeDuplicates(stations) {

                var codes = [];

                for (var key in stations) {
                    var station = stations[key];
                    if (codes.indexOf(station.code) > -1) {
                        delete stations[key];
                    }
                    codes.push(station.code);
                }

                return stations;

            }

            if (!this.isReady()) {
                return;
            }

            // Remove duplicates AFTER sorting so that the duplicate
            // that had the best position will be preserved.
            this.callback(removeDuplicates(sortStations(this.search())));

        }

        SearchStations.prototype.search = function() {

            var that = this;

            /**
             * Returns the regexes to use for searching for station
             * names.
             */
            function getRegexes() {

                var regexes = [];
                var search_words = that.search_term.split(' ');

                for (var word in search_words) {
                    regexes.push(
                        new RegExp(escape_regex(search_words[word]), 'i')
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
             * Returns the matches for the search_term.
             */
            function getMatches() {

                function addMatch(station) {
                    matches.push({
                        'code': code,
                        'name': station.name,
                        'levenshtein': levenshtein(that.search_term, name)
                    });
                }

                var matches = [];
                var regexes = getRegexes();
                var matched_station_codes = [];

                for (var name in that.station_names) {

                    if (matchStation(name, regexes)) {
                        var code = that.station_names[name];
                        addMatch(that.stations[code])
                    }

                }

                return matches;

            }

            return getMatches();

        }

        return SearchStations;

    }
);
