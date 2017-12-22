var $ = require("jquery");

export class ButtonManger{

    constructor(mapRef) {
        this.mapRef = mapRef;
        this.tempButton = $('#tempButton');
        this.co2Button = $('#CO2Button');

        this.tempButton.click((d) => {
            this.mapRef.setValueType('TEMPERATURE');
            if (!this.tempButton.hasClass('active')) {
                this.co2Button.removeClass('active');
                this.tempButton.addClass('active');
            }
        });

        this.co2Button.click((d) => {
            this.mapRef.setValueType('CO2');
            if (!this.co2Button.hasClass('active')) {
                this.tempButton.removeClass('active');
                this.co2Button.addClass('active');
            }
        });
    }

}
