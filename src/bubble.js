import * as d3 from 'd3';

export class BubbleChart {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.selected = [];
    }
    addTo(div) {

        this.Bubble = d3.select(div);
        this.canvas = this.Bubble.append('canvas')
            .attr('width', window.innerWidth)
            //.attr('height', window.innerHeight)
            .attr('id', 'bubble-chart');

    }
    get_chart() {

        this.myBubbleChart = new Chart(this.canvas.node().getContext('2d'), {
            type: 'bubble',
            data: {
                datasets: [/*
                    {
                        label: ["China"],
                        backgroundColor: "rgba(255,221,50,0.2)",
                        borderColor: "rgba(255,221,50,1)",
                        data: [{
                            x: 21269017,
                            y: 5.245,
                            r: 15
                        }]
                    }, {
                        label: ["Denmark"],
                        backgroundColor: "rgba(60,186,159,0.2)",
                        borderColor: "rgba(60,186,159,1)",
                        data: [{
                            x: 258702,
                            y: 7.526,
                            r: 10
                        }]
                    }, {
                        label: ["Germany"],
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderColor: "#000",
                        data: [{
                            x: 3979083,
                            y: 6.994,
                            r: 15
                        }]
                    }, {
                        label: ["Japan"],
                        backgroundColor: "rgba(193,46,12,0.2)",
                        borderColor: "rgba(193,46,12,1)",
                        data: [{
                            x: 4931877,
                            y: 5.921,
                            r: 15
                        }]
                    }
                */]
            },
            options: {
                title: {
                    display: true,
                    text: 'CO2 / Temperature change'
                }, scales: {
                    yAxes: [{
                        ticks: {
                            //suggestedMin: 50,
                            //suggestedMax: 100
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "CO2 emissions Kt/capita"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            //min: 5000,
                            suggestedMax: 30000000
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Temperature change since 1960"
                        }
                    }]
                }
            }
        });
    }

    update(selected) {

        let countries = [];
        let eraseIndex = [];

        selected.forEach(country => {
            countries.push(country.name);
        });
        
        let color = () => {
            var o = Math.round, r = Math.random, s = 255;
            let randRGB = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',';
            return [randRGB + '0.2' + ')', randRGB + '1' + ')'];
        };
        
        this.myBubbleChart.data.datasets.forEach((dataset, index) => {

            if (countries.includes(dataset.label)) {
                let ind = countries.findIndex((ele) => {
                    return ele==dataset.label;
                });
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

            this.myBubbleChart.data.datasets.push({
                label: newCountry,
                backgroundColor: myColor[0],
                borderColor: myColor[1],
                data: [{
                    x: Math.round(Math.random() * 30000000),
                    y: 5.921,
                    r: 15
                }]
            });
        });
        this.myBubbleChart.update();
    }
}