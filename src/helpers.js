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
export function getRandomdata2(years){

 function randomArray(length, max) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * max);
    });
}
var value1 = randomArray(years.length, 40);
var value2= randomArray(years.length, 40);
//var years= [...Array(267).keys()];

var data1 =[];
var data2 =[];
for (var i =0; i < years.length;i++){
  data1.push({
    x:years[i],
    y:value1[i]
  });
  data2.push({
    x:years[i],
    y:value2[i]
  })

};
var data=[data1,data2];
return data;
}

export function getRandomdata(years){

 function randomArray(length, max) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * max);
    });
}
var value= randomArray(years.length, 40);
//var years= [...Array(267).keys()];

var data =[];
for (var i =0; i < years.length;i++){
  data.push({
    x:years[i],
    y:value[i]
  });

};
data=[data];
return data;
}

export function getYears(data){
  let years=[];
  for(let i =0;i<data.length;i++){
    years.push(Number(data[i].dt));
  }

  return years;
}
