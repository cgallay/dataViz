/**
 * This is a test function simply printing
 * a message into the console
 *
*/
export function test() {
    console.log("test by charles");
}

/**
*create random data
*/
export function getRandomdata(){

 function randomArray(length, max) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * max);
    });
}
var value = randomArray(267, 40);
var years= [...Array(267).keys()];

var data =[];
for (var i =0; i < years.length;i++){
  data.push({
    dt:years[i],
    temp:value[i]
  })

};

return data;
}
