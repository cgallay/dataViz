import * as crossfilter from 'crossfilter';
import * as d3 from 'd3';
import { select } from 'd3';

/**
 * The goal of this class is to centralize every
 * interaciton that we have with the data
 */
export class DataManager {
    constructor(data) {
        this.data = data;
        this.cf = crossfilter(data);
        this.dataDim = this.cf.dimension(d => d);
        this.countryDim = this.cf.dimension(d => d["ISO Code"]);
        this.timeDimension = this.cf.dimension(d => d.dt);
        this.deltaDimension = this.cf.dimension(d => d.delta);
        this.co2Dim = this.cf.dimension(d => d.CO2);
        this.popDimension = this.cf.dimension(d => d.population);
    }

    /**
     * Compare function to be use with .sort() to sort the data by years
     */
    static compareDate(a, b) {
        if (a.dt < b.dt) {
            return -1;
        }
        if (a.dt > b.dt) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }

    /**
     * Return the domain into which the temperatures lies
     * (usefull for the colormap)
     */
    getTempDomain() {
        let temperature = this.data.map((d) => d.AverageTemperature).sort((a, b) => a - b);
        let domain = [d3.quantile(temperature, 0), d3.quantile(temperature, .50), d3.quantile(temperature, 1)];
        return domain;
    }
    
    getCo2Domain() {
        let C02 = this.data.map((d) => d.CO2).sort((a, b) => a - b);
        let domain = [d3.quantile(C02, 0), d3.quantile(C02, .50), d3.quantile(C02, 1)];
        return domain;
    }

    selectYear(year) {
        return this.timeDimension.filter(d => d==year).top(Infinity);

    }

    getData() {
        return this.dataDim.top(Infinity);
    }

    getDataByCountry(selected_countries) {

        let dataDictList = [[], [], [], []]; // TempChart, CO2Chart, footprintChart, BubbleChart

        selected_countries.forEach(country => {

            this.countryDim.filter(c => c == country.id);
            let sortedValue = this.timeDimension.top(Infinity).sort((a,b)=> a.dt-b.dt);

            let data = sortedValue.map( (elem) => {

                return [{/*
                    x: elem.dt,
                    y: elem.AverageTemperature
                },{/*/
                    x: elem.dt,
                    y: elem.delta
                },{//*/
                    x: elem.dt,
                    y: elem.CO2
                },{
                    x: elem.dt,
                    y: elem.footprint
                },{
                    year: elem.dt,
                    pop: elem.population,
                    delta: elem.delta,
                    co2: elem.CO2,
                }];
            });

            dataDictList.forEach((chartDict, i) => {
                chartDict.push({
                    name: country.name,
                    value: data.map(elem => elem[i])
                })
            });


        });

        return dataDictList;
    }
}
