import * as crossfilter from 'crossfilter';
import * as d3 from 'd3';

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

    selectYear(year) {
        this.timeDimension.filter(d => d == '1970');
    }

    getData() {
        return this.dataDim.top(Infinity);
    }

    getTempForCountry(countryCode) {
        //this.df.filterAll();
        this.countryDim.filter(c => c == countryCode);
        let sortedValue = this.timeDimension.top(Infinity).sort(this.compareDate);
        return sortedValue.map(function (elem) {
            let obj = {
                x: elem.dt,
                y: elem.AverageTemperature
            };
            return obj;
        });

        //return sortedValue.map( x=> x.AverageTemperature)
    }

    getTempByCountry(selected_countries) {

        let tempByCountryDict = [];
        selected_countries.forEach(country => {

            this.countryDim.filter(c => c == country.id);
            let sortedValue = this.timeDimension.top(Infinity).sort(this.compareDate);
            let temperature = sortedValue.map(function (elem) {
                let obj = {
                    x: elem.dt,
                    y: elem.AverageTemperature
                };
                return obj;
            });

            tempByCountryDict.push({
                name: country.name,
                value: temperature
            });

        });

        return tempByCountryDict;
    }

    getCO2ByCountry(selected_countries) {

        let CO2ByCountryDict = [];

        selected_countries.forEach(country => {

            this.countryDim.filter(c => c == country.id);
            let sortedValue = this.timeDimension.top(Infinity).sort(this.compareDate);
            let CO2 = sortedValue.map(function (elem) {
                let obj = {
                    x: elem.dt,
                    y: elem.CO2
                };
                return obj;
            });

            CO2ByCountryDict.push({
                name: country.name,
                value: CO2
            });

        });

        return CO2ByCountryDict;
    }
}
