define(
    [
    ],
    function(
    ) {
        'use strict';

        function SearchStationsInputView(element) {
            this.element = element;
        }

        SearchStationsInputView.prototype.activate = function() {

            var that = this;

            this.element.focus();

            this.keyupEvent = function() {
                that.searchTermUpdatedDelegate(this.value);
            };

            this.element.addEventListener('keyup', this.keyupEvent);

        };

        SearchStationsInputView.prototype.deactivate = function() {
            this.element.removeEventListener('keyup', this.keyupEvent);
        };

        return SearchStationsInputView;

    }
);
