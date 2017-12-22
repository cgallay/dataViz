var $ = require("jquery");
console.log('dkjskfdjskdjfkd');



export class Tutorial {
    attacheBuble(ref, placement, fun, title, content){
        ref.popover({
            placement: placement,
            html: 'true',
            title: title,
            content: content + '<Button class="btn btn-primary save">Next</Button>'
        }).on('shown.bs.popover', function () {
            var $popup = $(this);
            $(this).next('.popover').find('button.save').click(function (e) {
                $popup.popover('hide');
                fun();
            });
        });
        console.log('executed');
    }
    constructor(mapRef) {
        this.mapRef = mapRef;

        $('#storyBt').click(() => {
            $('#myModal').modal('hide');
            this.start();
        });

    }

    showModal() {
        $('#myModal').modal('show');
    }

    start(){
        this.mapRef.zoomActive(false);
        this.attacheBuble($('#panel'), 'left', () =>{
            this.mapRef.centerOn('CAN');
            this.mapRef.clickOnCountry('CAN', 'Canada');
            this.attacheBuble($('#CAN'), 'top', ()=>{

            }, 'Select a Country', 'We start by selecting canada, lets now chose an other country to compare with. ');
        }, "Content Panel", 'Form the chart that you see on the right, we can see as expected that the global waming is sady a reality');
        $('#panel').popover('show');
        /*
        this.mapRef.centerOn('CHN');
        
        this.mapRef.setTextOverCountry('FRA', 'test', 'hello');
        this.mapRef.setTextOverCountry('USA', 'test', 'hello', 'rigth');
        //$('#USA').popover('show');
        this.mapRef.clickOnCountry('FRA', 'France');
        */
        
    }
}
