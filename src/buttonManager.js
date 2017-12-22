var $ = require("jquery");

export class ButtonManger{

    constructor(mapRef) {
        this.mapRef = mapRef;
        this.tempButton = $('#tempButton');
        this.co2Button = $('#CO2Button');

        this.tempButton.click((d) => {
            this.mapRef.setValueType('TEMPERATURE');
            if (!this.tempButton.hasClass('selected')) {
                this.co2Button.removeClass('selected');
                this.tempButton.addClass('selected');
            }
        });

        this.co2Button.click((d) => {
            this.mapRef.setValueType('CO2');
            if (!this.co2Button.hasClass('selected')) {
                this.tempButton.removeClass('selected');
                this.co2Button.addClass('selected');
            }
        });
    }

}
