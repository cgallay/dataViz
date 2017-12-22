var $ = require("jquery");

export class Tutorial {
    
    constructor(mapRef) {
        this.mapRef = mapRef;
    }

    start(){
        this.mapRef.zoomActive(false);
        this.mapRef.centerOn('CHN');
        this.mapRef.setTextOverCountry('FRA', 'test', 'hello');
        this.mapRef.setTextOverCountry('USA', 'test', 'hello', 'rigth');
        //$('#USA').popover('show');
        this.mapRef.clickOnCountry('FRA', 'France');
        $('#myModal').modal('show')
    }


}