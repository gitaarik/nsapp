'use strict';

define(
    [
        'utils/escape_regex',
        'utils/levenshtein'
    ],
    function(
        escape_regex,
        levenshtein
    ) {

        function SearchStations(element, resultDelegate) {

            this.element = element;
            this.resultDelegate = resultDelegate;

            this.initStationNames();
            this.initStations();
            this.initEventListeners();

        }

        SearchStations.prototype.initStationNames = function() {

            var that = this;
            var request = new XMLHttpRequest();
            this.stationNames = null;

            request.open('GET', 'http://localhost:8000/api/v1/stationnames/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    if (this.status == 200) {
                        that.stationNames = JSON.parse(this.responseText);
                    } else {
                        console.log("Failed to fetch station names. Response status: " + request.status);
                    }

                }

            };

            request.send();

        },

        SearchStations.prototype.initStations = function() {

            var that = this;
            var request = new XMLHttpRequest();
            this.stations = null;

            request.open('GET', 'http://localhost:8000/api/v1/stations/');
            request.setRequestHeader('Accept', 'application/json');

            request.onreadystatechange = function() {

                if (this.readyState == 4) {

                    if (this.status == 200) {
                        that.stations = JSON.parse(this.responseText);
                    } else {
                        console.log("Failed to fetch stations. Response status: " + request.status);
                    }

                }

            };

            request.send();

        }

        SearchStations.prototype.initEventListeners = function() {

            var that = this;
            var stationInputEl = this.element.getElementsByClassName('station-input')[0];

            stationInputEl.addEventListener('keyup', function() {
                that.getResults(this.value)
            });

        }

        SearchStations.prototype.getResults = function(searchTerm) {

            var matches = [];
            searchTerm = searchTerm.trim();

            if (searchTerm.length > 2) {
                matches = this.search(searchTerm);
                matches = matches.sort(function(a, b) {
                    return a.levenshtein - b.levenshtein;
                });
            }

            this.resultDelegate.foundStations(matches);

        }

        SearchStations.prototype.search = function(searchTerm) {

            var that = this;

            /**
             * Returns the regexes to use for searching for station
             * names.
             */
            function getRegexes() {

                var regexes = [];
                var searchWords = searchTerm.split(' ');

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

                for (var name in that.stationNames) {

                    if (matchStation(name, regexes)) {

                        var code = that.stationNames[name];
                        var station = that.stations[code];

                        matches.push({
                            'code': code,
                            'name': station.name,
                            'levenshtein': levenshtein(searchTerm, name)
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
