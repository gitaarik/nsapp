define(
    [
    ],
    function(
    ) {
        'use strict';

        function SearchStationsInputView(element) {
            this.element = element;
            this.input_el = document.getElementById('search-station-input');
        }

        SearchStationsInputView.prototype.activate = function() {

            var that = this;

            this.input_el.focus();

            this.keyupEvent = function() {
                that.searchTermUpdatedDelegate(this.value);
            };

            this.elementClickEvent = function() {
                that.input_el.focus();
            };

            this.input_el.addEventListener('keyup', this.keyupEvent);
            this.element.addEventListener('click', this.elementClickEvent);

        };

        SearchStationsInputView.prototype.deactivate = function() {
            this.input_el.removeEventListener('keyup', this.keyupEvent);
            this.element.removeEventListener('click', this.elementClickEvent);
        };

        return SearchStationsInputView;

    }
);
