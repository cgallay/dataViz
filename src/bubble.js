import * as d3 from 'd3';
import { values } from 'd3';

export class BubbleChart {
    constructor(initial_year) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.selectedYear = parseInt(initial_year);
    }
    addTo(div) {

        this.Bubble = d3.select(div);
        this.canvas = this.Bubble.append('canvas')
            .attr('width', window.innerWidth)
            .attr('id', 'bubble-chart');

    }
    get_chart() {

        this.myBubbleChart = new Chart(this.canvas.node().getContext('2d'), {
            type: 'bubble',
            data: {
                datasets: []
            },
            options: {
                title: {
                    display: true,
                    text: 'CO2 / Temperature change'
                }, scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 30
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "CO2 emissions Kt/capita"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            suggestedMin: -1,
                            suggestedMax: 3
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Temperature change since 1950"
                        }
                    }]
                }
            }
        });
    }

    updateTime(year){

        this.selectedYear = parseInt(year);

        this.myBubbleChart.data.datasets.forEach((dataset, index) => {
            dataset.data.forEach(element => {
                //TODO
            }); 
        })
    }


    updateData(bubbleData) {

        let eraseIndex = [];

        let countries = bubbleData.map(country => country.name);
        
        let color = () => {
            let o = Math.round, r = Math.random, s = 255;
            let randRGB = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',';
            return [randRGB + '0.5' + ')', randRGB + '1' + ')'];
        };
        
        this.myBubbleChart.data.datasets.forEach((dataset, index) => {

            if (countries.includes(dataset.label)) {
                let ind = countries.findIndex((ele) => ele==dataset.label);
                countries.splice(ind, 1);
            }
            else{
                eraseIndex.push(index);
            }
        });
        eraseIndex.forEach(ind => {
            this.myBubbleChart.data.datasets.splice(ind, 1);
        });
        countries.forEach(newCountry => {
            
            let myColor = color();
            console.log(this.selectedYear);
            let data = bubbleData.filter(x => x.name==newCountry)[0].value.filter(x => x.year == this.selectedYear);
            console.log(data);
            this.myBubbleChart.data.datasets.push({
                label: newCountry,
                backgroundColor: myColor[0],
                borderColor: myColor[1],
                data: [{
                    x: parseFloat(data[0].co2),
                    y: parseFloat(data[0].delta),
                    r: Math.sqrt(parseFloat(data[0].pop)/100000)
                }]
            });
        });
        this.myBubbleChart.update();
    }
}