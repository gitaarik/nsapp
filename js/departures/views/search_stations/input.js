define(
    [
    ],
    function(
    ) {
        'use strict';

        function SearchStationsInputView(element) {
            this.element = element;
            this.initEventListeners();
        }

        SearchStationsInputView.prototype.initEventListeners = function() {

            var that = this;

            this.element.addEventListener('keyup', function() {
                that.searchTermUpdatedDelegate(this.value);
            });

        };

        return SearchStationsInputView;

    }
);
