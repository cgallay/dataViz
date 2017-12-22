var $ = require("jquery");

export class ButtonManger{

    constructor(mapRef) {
        this.mapRef = mapRef;
        this.tempButton = $('#tempButton');
        this.tempButton.click((d) => {
            mapRef.setValueType('TEMPERATURE');
        });
        $('#CO2Button').click((d) => {
            mapRef.setValueType('CO2');
        });
    }

}
