export class Tutorial{
    
    constructor(mapRef) {
        this.mapRef = mapRef;
    }

    start(){
        this.mapRef.zoomActive(false);
        this.mapRef.setTextOverCountry('#ESP', 'test', 'hello');
        
    }

}