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
        'use strict';

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
        };

        SearchStations.prototype.getByCallback = function(search_term, callback) {
            this.callback = callback;
            this.search_term = search_term;
            this.getResults();
        };

        SearchStations.prototype.getResults = function() {

            var that = this;

            function sortStations(stations) { 
                return stations.sort(function(a, b) {
                    return b.score - a.score;
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
            this.callback(removeDuplicates(sortStations(this.getStations())));

        };

        SearchStations.prototype.getStations = function() {

            var stations = [];

            for (var station_name in this.station_names) {

                var code = this.station_names[station_name];
                var station = this.stations[code];

                // Calculating the score for a match, kinda
                // complicated, should document this maybe sometime.
                // Also refactor probably...
                // TODO

                station_name = station_name.toLowerCase();
                var search_term = this.search_term.toLowerCase();
                var score = 0;
                var search_words;
                var search_word_key;
                var search_word;
                var station_words;
                var station_word_key;
                var station_word;
                var levenshtein_score;

                if (station_name == search_term) {
                    // exact match
                    score += 1000;
                } else {
                    
                    if (
                        search_term.length > 1 &&
                        station_name.substr(0, search_term.length) == search_term
                    ) {
                        // match start of string
                        score += 500;
                    }

                    search_words = search_term.split(' ');
                    station_words = station_name.split(' ');

                    // points per word
                    for (search_word_key in search_words) {

                        search_word = search_words[search_word_key].trim();

                        for (station_word_key in station_words) {

                            station_word = station_words[station_word_key].trim();

                            if (station_word == search_word) {
                                // exact match of a single word
                                score += 200;
                                break;
                            } else if (
                                search_word.length > 1 &&
                                station_word.substr(0, search_word.length) == search_word
                            ) {
                                // match of start of single word
                                score += 100;
                                break;
                            }

                            if (search_word.length > 3) {
                                levenshtein_score = levenshtein(search_word, station_word.substr(0, search_word.length));
                                if (levenshtein_score > 3) {
                                    score -= levenshtein_score;
                                } else {
                                    score += (3 - levenshtein_score) * 10;
                                }
                            }

                            levenshtein_score = levenshtein(search_word, station_word);
                            if (levenshtein_score > 3) {
                                score -= levenshtein_score;
                            } else {
                                score += (3 - levenshtein_score) * 15;
                            }

                        }

                    }

                    levenshtein_score = levenshtein(search_term, station_name);
                    if (levenshtein_score > 3) {
                        score -= levenshtein_score;
                    } else {
                        score += (3 - levenshtein_score) * 30;
                    }

                }

                if (score > 0) {
                    stations.push({
                        'code': station.code,
                        'name': station.name,
                        'score': score
                    });
                }

            }

            return stations;

        };

        return SearchStations;

    }
);
