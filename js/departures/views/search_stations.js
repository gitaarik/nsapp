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

            this.element.addEventListener('keyup', function() {
                that.searchTermUpdatedDelegate(this.value);
            });

        }

        return SearchStationsView;

    }
);
