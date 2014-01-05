define(
    [
    ],
    function(
    ) {
        'use strict';

        function SearchStationsInputView(element) {
            this.element = element;
            this.input_el = document.getElementById('search-station-input');
            this.first_load = true;
        }

        SearchStationsInputView.prototype.activate = function() {
            this.addEventListeners();
            this.input_el.focus();
            this.processInitialValue();
        };

        SearchStationsInputView.prototype.deactivate = function() {
            this.removeEventListeners();
        };

        /*
         * Process any value that's present when the page loads.
         *
         * This could happen when the user refreshes the page when the
         * input element was filled.
         */
        SearchStationsInputView.prototype.processInitialValue = function() {
            if (this.first_load && this.input_el.value.length > 0) {
                this.first_load = false;
                this.searchTermUpdatedDelegate(this.input_el.value);
                this.moveCursorToEnd();
            }
        };

        /**
         * Move the cursor to the end of the input box
         */
        SearchStationsInputView.prototype.moveCursorToEnd = function() {
            var tmp_value = this.input_el.value;
            this.input_el.value = '';
            this.input_el.value = tmp_value;
        };

        SearchStationsInputView.prototype.addEventListeners = function() {

            var that = this;

            this.keyupEvent = function() {
                that.searchTermUpdatedDelegate(this.value);
            };

            this.elementClickEvent = function() {
                that.input_el.focus();
            };

            this.windowActivatedEvent = function() {
                that.input_el.focus();
            }

            this.input_el.addEventListener('keyup', this.keyupEvent);
            this.element.addEventListener('click', this.elementClickEvent);
            window.addEventListener('focus', this.windowActivatedEvent);

        };

        SearchStationsInputView.prototype.removeEventListeners = function() {
            this.input_el.removeEventListener('keyup', this.keyupEvent);
            this.element.removeEventListener('click', this.elementClickEvent);
            window.removeEventListener('focus', this.windowActivatedEvent);
        };

        return SearchStationsInputView;

    }
);
