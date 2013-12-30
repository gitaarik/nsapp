'use strict';

define(
    [
    ],
    function(
    ) {

        function SearchStationsView(element) {
            this.element = element;
            this.initEventListeners();
        }

        SearchStationsView.prototype.initEventListeners = function() {

            var that = this;
            this.stationInputEl = this.element.getElementsByClassName('station-input')[0];

            this.stationInputEl.addEventListener('keyup', function() {
                that.searchTermUpdatedDelegate(this.value);
            });

        }

        return SearchStationsView;

    }
);
