import * as d3 from 'd3';
import * as wNumb from 'wnumb';
import { values } from 'd3';
import * as d3_scale from 'd3-scale';
import * as d3_scale_chromatic from 'd3-scale-chromatic';

export class BubbleChart {
    constructor(initial_year) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.selectedYear = parseInt(initial_year);

    }
    addTo(div) {

        this.Bubble = d3.select(div);
        this.canvas = this.Bubble.append('canvas')
            .attr('id', 'bubble-chart');

    }
    get_chart() {

        this.myBubbleChart = new Chart(this.canvas.node().getContext('2d'), {
            type: 'bubble',
            data: {
                datasets: []
            },
            options: {
                maintainAspectRatio : false,
                title: {
                    display: true,
                    text: 'CO2 / Temperature change'
                }, scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 30
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "CO2 emissions Kt/capita"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            min: -0.5,
                            max: 2
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Temperature change since 1950"
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, chart) => {

                            let format = wNumb({
                                decimals: 3
                            });

                            let country = chart.datasets[tooltipItem.datasetIndex].label;
                            country = country.concat(": ");
                            let Popvalue = String(format.to(chart.datasets[tooltipItem.datasetIndex].data[0].r));
                            let Poplabel = Popvalue.concat(' pop, ');
                            let CO2value = String(format.to(tooltipItem.yLabel));
                            let CO2label = CO2value.concat(' kT, ');
                            let Tempvalue = String(format.to(tooltipItem.xLabel));
                            let TempLabel = Tempvalue.concat(' C°, ');

                            let output = country.concat(TempLabel.concat(CO2label.concat(Poplabel)));
                            return output;
                        }
                    }
                }
            }
        });
    }

    updateTime(year) {

        this.selectedYear = parseInt(year);
        this.myBubbleChart.data.datasets.forEach((dataset, index) => {

            dataset.data.forEach(element => {

                let data = this.bubbleData.filter(x => x.name == dataset.label)[0].value.filter(x => x.year == this.selectedYear)[0];

                element.x = parseFloat(data.delta);
                element.y = parseFloat(data.co2);
                element.r = Math.sqrt(parseFloat(data.pop) / 100000);

            });
        })
        this.myBubbleChart.update(5000);
    }


    updateData(bubbleData) {
        this.bubbleData = bubbleData;
        let eraseIndex = [];

        let countries = bubbleData.map(country => country.name);

        //find max y scales
        //let co2_values = [];
        //let r_values = [];
        countries.forEach(displayedCountry => {

            let data = bubbleData.filter(x => x.name == displayedCountry)[0].value.filter(x => x.year == this.selectedYear);
            //co2_values.push(data[0].co2);
            //r_values.push(Math.sqrt(parseFloat(data[0].pop) / 100000));
        });


        //let co2_max = Math.max.apply(null, co2_values);
        //let r_co2_max = r_values[co2_values.indexOf(String(co2_max))];

        //this.myBubbleChart.options.scales.yAxes[0].ticks.max =  co2_max ;

        let color = () => {
            let o = Math.round, r = Math.random, s = 255;

            let randRGB = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',';
            return [randRGB + '0.5' + ')', randRGB + '1' + ')'];

        };
        let color2 = (i) => {
            let r, g, b;
            let randRGBhex = d3_scale_chromatic.schemeSet2[i];

            function hex2rgb(hex) {
                // long version
                r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
                if (r) {
                    return r.slice(1, 4).map(function (x) { return parseInt(x, 16); });
                }
                // short version
                r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
                if (r) {
                    return r.slice(1, 4).map(function (x) { return 0x11 * parseInt(x, 16); });
                }
                return null;
            }
            let rgb = hex2rgb(randRGBhex)
            let randRGB = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',';

            //let randRGB = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',';
            return [randRGB + '0.5' + ')', randRGB + '1' + ')'];

        };

        this.myBubbleChart.data.datasets.forEach((dataset, index) => {

            if (countries.includes(dataset.label)) {
                let ind = countries.findIndex((ele) => ele == dataset.label);
                countries.splice(ind, 1);
            }
            else {
                eraseIndex.push(index);
            }
        });
        eraseIndex.forEach(ind => {
            this.myBubbleChart.data.datasets.splice(ind, 1);
        });

        countries.forEach(newCountry => {

            //let myColor = color();
            console.log(this.selectedYear);
            let data = bubbleData.filter(x => x.name == newCountry)[0].value.filter(x => x.year == this.selectedYear)[0];
            console.log("data");
            console.log(data);
            this.myBubbleChart.data.datasets.push({
                label: newCountry,
                data: [{
                    x: parseFloat(data.delta),
                    y: parseFloat(data.co2),
                    r: Math.sqrt(parseFloat(data.pop) / 100000)
                }]
            });
        });
        //same colors as the linecharts

        this.myBubbleChart.data.datasets.forEach((element, i) => {
            element.backgroundColor = color2(i)[0];
            element.borderColor = color2(i)[1];
        });
        this.myBubbleChart.update();
    }
}
