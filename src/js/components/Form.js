import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import 'babel-polyfill';
import { countryCodes } from '../../countryDictionary';
import '../../styles/style.css';

class Form extends Component {
    constructor() {
        super();


        this.state = {
            cities: [],
            citiesDisplayed: [],
            countryCode: [],
            cityId: [],
            currentCity: undefined,
            isFahrenheit: true,
            fahrenheit: [],
            celsius: [],
            currentTemp: [],
            currentHours: '',
            currentMinutes: '',
            period: '',
            addCityClicked: false,
            cityTileClicked: false,
            cityInput: '',
            isAutocomplete: false,
            matchedCities: [],
            timezone: [],
            selectedCity: undefined,
            selectedCountry: undefined,
            weather: [],
            forecastData: [],
            selectedForecast: [],
            weatherDescription: [],
            minTemp: [],
            maxTemp: [],
            uvIndex: [],
            currentForecast: [],
            hourlyForecast: [],
            dailyForecast: [],
            airData: [],
            aqi: [],
            aqiArray: [],
            loadingAirData: true,
            opacityPercentage: 1,
            position:'sticky',
            positionCity:'sticky',
            overlayDiv: 'initial'
        };

        this.addCityHandler = this.addCityHandler.bind(this);
        this.cityInputHandler = this.cityInputHandler.bind(this);
        this.testData = this.testData.bind(this);
        this.cityInputAutocomplete = this.cityInputAutocomplete.bind(this);
        this.forecastData = this.forecastData.bind(this);
        this.cityTileHandler = this.cityTileHandler.bind(this);
        this.darkSkyData = this.darkSkyData.bind(this);
    }

    listenScrollEvent = e => {
      if (window.scrollY < 10) {
        this.setState({opacityPercentage: 1})
      }
      if (window.scrollY > 10) {
        this.setState({opacityPercentage: 0.9})
      }
      if (window.scrollY > 20) {
        this.setState({opacityPercentage: 0.8})
      }
      if (window.scrollY > 30) {
        this.setState({opacityPercentage: 0.7})
      }
      if (window.scrollY > 40) {
        this.setState({opacityPercentage: 0.6})
      }
      if (window.scrollY > 50) {
        this.setState({opacityPercentage: 0.5})
      }
      if (window.scrollY > 60) {
        this.setState({opacityPercentage: 0.4})
      }
      if (window.scrollY > 70) {
        this.setState({opacityPercentage: 0.3})
      }
      if (window.scrollY > 80) {
        this.setState({opacityPercentage: 0.2})
      }
      if (window.scrollY > 90) {
        this.setState({opacityPercentage: 0.1})
      }
      if (window.scrollY > 100) {
        this.setState({opacityPercentage: 0})
      }
      
      if (window.scrollY > 300) {
        this.setState({positionCity:'fixed',
        position: 'fixed',
        overlayDiv: 'fixed'})
      }
      if (window.scrollY < 300) {
        this.setState({positionCity: 'sticky',
        position:'sticky',
      overlayDiv: 'initial'});
      }
    }

    componentDidMount () {
      this.tick();
      console.log(countryCodes);
      this.intervalTime = setInterval(
        () => this.tick(),
        1000
      );
      this.intervalWeather = setInterval(
        () => this.testData(),
        54000000
      );
      window.addEventListener('scroll', this.listenScrollEvent);
    }

    tick() {
      let currentUTCHour = new Date().getUTCHours();
      let currentMinutes = new Date().getMinutes();
      if(currentMinutes < 10){
        currentMinutes =  '0' + `${currentMinutes}`;
      }
      this.setState({
        currentMinutes,
        currentHours: currentUTCHour
      });
    }

    async forecastData (country, city) {
      let countryFinal = countryCodes.filter(code => {
        return code[country];
      })[0][country];

      await fetch(`http://localhost:3000/forecastWeather`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'city': `${city}`,
          'country': `${countryFinal}`
        }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        console.log(data);
        if(this.state.forecastData.length === 0){
          this.setState({
            forecastData: [{[`${city}*${country}`]: data.list}]
          })
        } else if (this.state.forecastData.length !== 0) {
          this.setState({
            forecastData: [...this.state.forecastData, {[`${city}*${country}`]: data.list}]
          })
        }
      })
    }

    async airData (lat, lon, currentCity) {
      const parameters = ['pm25','pm10','o3','co','so2','no2'];
      for(let i=0;i<parameters.length;i++) {
        let averagingPeriod;
        switch(parameters[i]) {
          case 'pm25':
          case 'pm10':
          case 'so2':
            averagingPeriod = 24;
            break;
          case 'o3':
          case 'co':
            averagingPeriod = 8;
            break;
          case 'no2':
            averagingPeriod = 1;
            break;
          default:
            averagingPeriod = 12;
        }
       await fetch(`http://localhost:3000/airData`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'latitude': `${lat}`,
            'longitude': `${lon}`,
            'averagingperiod': `${averagingPeriod}`,
            'parameter': `${parameters[i]}`
          }
        })
        .then(response => response.json())
        .then(data => {
          data = JSON.parse(data);
          console.log(data);
          if(i === 0 && data.results.length !== 0){
            this.setState({
              // airData:{[`${currentCity}${i}`]: data.results}
              airData:[data.results]
            })
          } 
          if(i >= 1 && i<6 && data.results.length !== 0){
            this.setState({
              airData:[...this.state.airData, data.results]
            })
          }
        })
      }
    }

    async testData (country, city) {
      console.log(country, city);
      let countryFinal = countryCodes.filter(code => {
        return code[country];
      })[0][country];

      await fetch(`http://localhost:3000/currentWeather`, {
          method: 'get',
          headers: {
              'Content-Type': 'application/json',
              'city': `${city}`,
              'country': `${countryFinal}`
          }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        if(data.name !== undefined){
        const fahrenheit = Math.round((data.main.temp - 273.15) * 9/5 + 32);
        const celsius = Math.round((data.main.temp - 273.15));
        const timezone = data.timezone/3600;
        const weatherDescription = data.weather[0].description.charAt(0).toUpperCase()+data.weather[0].description.slice(1);
        const faMinTemp = Math.round((data.main.temp_min - 273.15) * 9/5 + 32);
        const faMaxTemp = Math.round((data.main.temp_max - 273.15) * 9/5 + 32);      
        const ceMinTemp = Math.round((data.main.temp_min - 273.15));
        const ceMaxTemp = Math.round((data.main.temp_max - 273.15));
        const rainfall = data.rain?Math.round(data.rain['1h']/25.4):0;
        const windSpeed = data.wind.speed*2.237;
        const flFahrenheit = Math.round((data.main.feels_like - 273.15) * 9/5 + 32);
        const flCelsius = Math.round((data.main.feels_like - 273.15));
        const pressure = Math.round(data.main.pressure/33.864);
        const visibility = Math.round(data.visibility/1609);
        console.log(data);

        if(this.state.cities.length > 0){
          this.setState({currentCity: `${city}*${country}`,
            cityId: [...this.state.cityId, data.id],
            temp: data.main.temp,
            fahrenheit: [...this.state.fahrenheit, {[`${city}*${country}`]: fahrenheit}],
            celsius: [...this.state.celsius, {[`${city}*${country}`]: celsius}],
            addCityClicked: false,
            timezone: [...this.state.timezone, {[`${city}*${country}`]:timezone}],
            weather: [...this.state.weather, data.weather[0].main],
            weatherDescription: [...this.state.weatherDescription, weatherDescription],
            faMinTemp: [...this.state.minTemp, faMinTemp],
            faMaxTemp: [...this.state.maxTemp, faMaxTemp],
            ceMinTemp: [...this.state.minTemp, ceMinTemp],
            ceMaxTemp: [...this.state.maxTemp, ceMaxTemp],
            sunrise: [...this.state.sunrise, data.sys.sunrise],
            sunset: [...this.state.sunset, data.sys.sunset],
            rainfall: [...this.state.rainfall, rainfall],
            humidity: [...this.state.humidity, data.main.humidity],
            windSpeed: [...this.state.windSpeed, windSpeed],
            windDirection: [...this.state.windDirection, data.wind.deg],
            flFahrenheit: [...this.state.flFahrenheit, flFahrenheit],
            flCelsius: [...this.state.flCelsius, flCelsius],
            pressure: [...this.state.pressure, pressure],
            visibility: [...this.state.visibility, visibility],
            coordinates: [...this.state.coordinates,{city: `${city}*${country}`, lat:data.coord.lat, lon:data.coord.lon}],

            });
        } else if (this.state.cities.length === 0) {
            this.setState({currentCity: `${city}*${country}`,
              cityId: [...this.state.cityId, data.id],
              temp: data.main.temp,
              fahrenheit: [...this.state.fahrenheit, {[`${city}*${country}`]: fahrenheit}],
              celsius: [...this.state.celsius, {[`${city}*${country}`]: celsius}],
              addCityClicked: false,
              timezone: [{[`${city}*${country}`]:timezone}],
              weather: [data.weather[0].main], 
              weatherDescription: [weatherDescription],
              faMinTemp: [faMinTemp],
              faMaxTemp: [faMaxTemp],
              ceMinTemp: [ceMinTemp],
              ceMaxTemp: [ceMaxTemp],
              sunrise: [data.sys.sunrise],
              sunset: [data.sys.sunset],
              rainfall: [rainfall],
              humidity: [data.main.humidity],
              windSpeed: [windSpeed],
              windDirection: [data.wind.deg],
              flFahrenheit: [flFahrenheit],
              flCelsius: [flCelsius],
              pressure: [pressure],
              visibility: [visibility],
              coordinates: [{city: `${city}*${country}`,lat:data.coord.lat, lon:data.coord.lon}],
            });
        }
        }
      })
      .catch(e => console.error(e))
    }
    
    async darkSkyData (city, country, latitude, longitude) {
      console.log(latitude, longitude); 
      
      await fetch(`http://localhost:3000/darkSky`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'latitude': `${latitude}`,
          'longitude': `${longitude}`
        }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        console.log(data);
        if(this.state.currentForecast.length === 0){
          this.setState({
            currentForecast: [{[`${city}*${country}`]: data.currently}],
            hourlyForecast: [{[`${city}*${country}`]: data.hourly.data.slice(1,25)}],
            dailyForecast: [{[`${city}*${country}`]: data.daily.data}]
          });
        } else if(this.state.currentForecast.length >= 1){
            this.setState({
              currentForecast: [...this.state.currentForecast, {[`${city}*${country}`]: data.currently}],
              hourlyForecast: [...this.state.hourlyForecast, {[`${city}*${country}`]: data.hourly.data.slice(1,25)}],
              dailyForecast: [...this.state.dailyForecast, {[`${city}*${country}`]: data.daily.data}],
            });
          }

      })
    }

    tempConverter = () => {
      let currentTemp = this.state.temp;
      if(this.state.isFahrenheit){
        currentTemp = parseInt((currentTemp - 32) * 5/9);
        console.log(currentTemp);
      } else {
        currentTemp = parseInt((currentTemp * 9/5) + 32);
      }
      this.setState(prevState => ({
        currentTemp,
        isFahrenheit: !prevState.isFahrenheit
      }));
    }

    forecastTempConverter= (temp) => {
      if(this.state.isFahrenheit){
        temp = Math.round(parseInt((temp - 273.15) * 9/5 + 32));
      } else {
        temp = Math.round(parseInt((temp - 273.15)));
      }
      return temp;
    }

    addCityButtonHandler = () => {
      this.setState(prevState => ({
        addCityClicked: !prevState.addCityClicked
      }));
    }

    async addCityHandler (city, country) {
      const cities = this.state.cities;
      const countryCode = this.state.countryCode;
      if(cities.filter(item => item === city).length === 0 || countryCode.filter(item => item === country).length === 0){
        await this.testData(country, city);
        await this.forecastData(country, city);
      }
      if(cities.filter(item => item === city).length===0 ||
      countryCode.filter(item => item === country).length === 0 &&
      this.state.fahrenheit.filter(item => typeof(item[`${city}*${country}`]) === 'number').length !== 0) {
        this.setState(prevState => ({
          cities: [...prevState.cities, `${city}*${country}`],
          countryCode: [...this.state.countryCode, country],
          matchedCities: []
          }));
        await this.darkSkyData(city, country, this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lat, this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lon);
        console.log('Current Forecast: ',this.state.currentForecast);
        console.log('Hourly Forecast: ', this.state.hourlyForecast);
        console.log('Daily Forecast: ', this.state.dailyForecast);
        console.log(this.state.cities);
        await this.airData(this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lat,this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lon, `${city}*${country}`); 
        if(this.state.airData.length !== 0){
          this.state.airData.forEach((dataPoint, index) => {
            let concentrationValue = undefined;
            let aqiHigh = undefined;
            let aqiLow = undefined;
            let breakPointHigh = undefined;
            let breakPointLow = undefined;
            console.log(dataPoint);
            if(dataPoint.length>=1){
              switch(dataPoint[0]['parameter']) {
                case 'pm25':
                  concentrationValue = dataPoint.reduce((total, valueObject)=> {
                    return total + valueObject.value;
                  },0)/24;

                  aqiHigh = concentrationValue<=12?50:
                  concentrationValue>12&&concentrationValue<=35.4?100:
                  concentrationValue>35.4&&concentrationValue<=55.4?150:
                  concentrationValue>55.4&&concentrationValue<=150.4?200:
                  concentrationValue>150.4&&concentrationValue<=250.4?300:
                  concentrationValue>250.4&&concentrationValue<=350.4?400:
                  concentrationValue>350.4&&concentrationValue<=500.4?500:
                  999;

                  aqiLow = concentrationValue<=12?0:
                  concentrationValue>12&&concentrationValue<=35.4?51:
                  concentrationValue>35.4&&concentrationValue<=55.4?101:
                  concentrationValue>55.4&&concentrationValue<=150.4?151:
                  concentrationValue>150.4&&concentrationValue<=250.4?201:
                  concentrationValue>250.4&&concentrationValue<=350.4?301:
                  concentrationValue>350.4&&concentrationValue<=500.4?401:
                  501;
                  
                  breakPointHigh = aqiHigh===50?12:
                  aqiHigh===100?35.4:
                  aqiHigh===150?55.4:
                  aqiHigh===200?150.4:
                  aqiHigh===300?250.4:
                  aqiHigh===400?350.4:
                  aqiHigh===500?500.4:
                  99999.9;

                  breakPointLow = aqiHigh===50?0:
                  aqiHigh===100?12:
                  aqiHigh===150?35.4:
                  aqiHigh===200?55.4:
                  aqiHigh===300?150.4:
                  aqiHigh===400?250.4:
                  aqiHigh===500?350.4:
                  500.4;
                  break;
                case 'pm10':
                  concentrationValue = dataPoint.reduce((total, valueObject)=> {
                    return total + valueObject.value;
                  },0)/24;

                  aqiHigh = concentrationValue<=54?50:
                  concentrationValue>54&&concentrationValue<=154?100:
                  concentrationValue>154&&concentrationValue<=254?150:
                  concentrationValue>254&&concentrationValue<=354?200:
                  concentrationValue>354&&concentrationValue<=424?300:
                  concentrationValue>424&&concentrationValue<=504?400:
                  concentrationValue>504&&concentrationValue<=604?500:
                  999;

                  aqiLow = concentrationValue<=54?0:
                  concentrationValue>54&&concentrationValue<=154?51:
                  concentrationValue>154&&concentrationValue<=254?101:
                  concentrationValue>254&&concentrationValue<=354?151:
                  concentrationValue>354&&concentrationValue<=424?201:
                  concentrationValue>424&&concentrationValue<=504?301:
                  concentrationValue>504&&concentrationValue<=604?401:
                  501;
                  
                  breakPointHigh = aqiHigh===50?54:
                  aqiHigh===100?154:
                  aqiHigh===150?254:
                  aqiHigh===200?354:
                  aqiHigh===300?424:
                  aqiHigh===400?504:
                  aqiHigh===500?604:
                  99999.9;
                  
                  breakPointLow = aqiHigh===50?0:
                  aqiHigh===100?55:
                  aqiHigh===150?154:
                  aqiHigh===200?254:
                  aqiHigh===300?354:
                  aqiHigh===400?424:
                  aqiHigh===500?504:
                  604;

                  break;
                case 'o3':
                  concentrationValue = dataPoint.reduce((total,valueObject)=> {
                    return total + valueObject.value;
                  },0)*24.45/48/8000;

                  aqiHigh = concentrationValue<=0.054?50:
                  concentrationValue>0.054&&concentrationValue<=0.07?100:
                  concentrationValue>0.07&&concentrationValue<=0.085?150:
                  concentrationValue>0.085&&concentrationValue<=0.105?200:
                  300;

                  aqiLow = concentrationValue<=0.054?0:
                  concentrationValue>0.054&&concentrationValue<=0.07?51:
                  concentrationValue>0.07&&concentrationValue<=0.085?101:
                  concentrationValue>0.085&&concentrationValue<=0.105?151:
                  201;
                  
                  breakPointHigh = aqiHigh===50?0.054:
                  aqiHigh===100?0.07:
                  aqiHigh===150?0.085:
                  aqiHigh===200?0.105:
                  0.2;
                  
                  breakPointLow = aqiHigh===50?0:
                  aqiHigh===100?0.054:
                  aqiHigh===150?0.07:
                  aqiHigh===200?0.085:
                  0.105;

                  break;
                case 'co':
                  concentrationValue = dataPoint.reduce((total, valueObject)=> {
                    return total + valueObject.value;
                  },0)*24.45/28.01/8000;

                  aqiHigh = concentrationValue<=4.4?50:
                  concentrationValue>4.4&&concentrationValue<=9.4?100:
                  concentrationValue>9.4&&concentrationValue<=12.4?150:
                  concentrationValue>12.4&&concentrationValue<=15.4?200:
                  concentrationValue>15.4&&concentrationValue<=30.4?300:
                  concentrationValue>30.4&&concentrationValue<=40.4?400:
                  concentrationValue>40.4&&concentrationValue<=50.4?500:
                  999;

                  aqiLow = concentrationValue<=4.4?0:
                  concentrationValue>4.4&&concentrationValue<=9.4?51:
                  concentrationValue>9.4&&concentrationValue<=12.4?101:
                  concentrationValue>12.4&&concentrationValue<=15.4?151:
                  concentrationValue>15.4&&concentrationValue<=30.4?201:
                  concentrationValue>30.4&&concentrationValue<=40.4?301:
                  concentrationValue>40.4&&concentrationValue<=50.4?401:
                  501;
                  
                  breakPointHigh = aqiHigh===50?4.4:
                  aqiHigh===100?9.4:
                  aqiHigh===150?12.4:
                  aqiHigh===200?15.4:
                  aqiHigh===300?30.4:
                  aqiHigh===400?40.4:
                  aqiHigh===500?50.4:
                  99999;
                  
                  breakPointLow = aqiHigh===50?0:
                  aqiHigh===100?4.4:
                  aqiHigh===150?9.4:
                  aqiHigh===200?12.4:
                  aqiHigh===300?15.4:
                  aqiHigh===400?30.4:
                  aqiHigh===500?40.4:
                  50.4;

                  break;
                case 'so2':
                  concentrationValue = dataPoint.reduce((total, valueObject)=> {
                    return total + valueObject.value;
                  },0)*24.45/64.066/24;

                  aqiHigh = concentrationValue<=304?-1:
                  concentrationValue>304&&concentrationValue<=604?300:
                  concentrationValue>604&&concentrationValue<=804?400:
                  concentrationValue>804&&concentrationValue<=1004?500:
                  999;

                  aqiLow = concentrationValue<=304?-1:
                  concentrationValue>304&&concentrationValue<=604?201:
                  concentrationValue>604&&concentrationValue<=804?301:
                  concentrationValue>804&&concentrationValue<=1004?401:
                  501;
                  
                  breakPointHigh = aqiHigh===-1?304:
                  aqiHigh===300?604:
                  aqiHigh===400?804:
                  aqiHigh===500?1004:
                  99999;
                  
                  breakPointLow = aqiHigh===-1?0:
                  aqiHigh===300?304:
                  aqiHigh===400?604:
                  aqiHigh===500?804:
                  1004;

                  break;
                case 'no2':
                  concentrationValue = dataPoint.reduce((total, valueObject)=> {
                    return total + valueObject.value;
                  },0)*24.45/46.0055;

                  aqiHigh = concentrationValue<=53?50:
                  concentrationValue>53&&concentrationValue<=100?100:
                  concentrationValue>100&&concentrationValue<=360?150:
                  concentrationValue>360&&concentrationValue<=649?200:
                  concentrationValue>649&&concentrationValue<=1249?300:
                  concentrationValue>1249&&concentrationValue<=1649?400:
                  concentrationValue>1649&&concentrationValue<=2049?500:
                  999;

                  aqiLow = concentrationValue<=53?0:
                  concentrationValue>53&&concentrationValue<=100?51:
                  concentrationValue>100&&concentrationValue<=360?101:
                  concentrationValue>360&&concentrationValue<=649?151:
                  concentrationValue>649&&concentrationValue<=1249?201:
                  concentrationValue>1249&&concentrationValue<=1649?301:
                  concentrationValue>1649&&concentrationValue<=2049?401:
                  501;
                  
                  breakPointHigh = aqiHigh===50?53:
                  aqiHigh===100?100:
                  aqiHigh===150?360:
                  aqiHigh===200?649:
                  aqiHigh===300?1249:
                  aqiHigh===400?1649:
                  aqiHigh===500?2049:
                  99999;
                  
                  breakPointLow = aqiHigh===50?0:
                  aqiHigh===100?54:
                  aqiHigh===150?100:
                  aqiHigh===200?360:
                  aqiHigh===300?649:
                  aqiHigh===400?1249:
                  aqiHigh===500?1649:
                  2049;

                  break;
                default:
                  console.log(dataPoint);
              }
            }
            const aqi = ((aqiHigh-aqiLow)/(breakPointHigh-breakPointLow))*(concentrationValue-breakPointLow)+aqiLow;
            this.setState({
              aqi: [...this.state.aqi, aqi]
            })
            if(index === this.state.airData.length-1){
              this.setState({
                aqiArray: [...this.state.aqiArray, {[this.state.currentCity]: Math.round(this.state.aqi.reduce((a, b) => {
                  return Math.max(a,b);
                }, 0))}],
                airData: [],
                aqi: []
              })
            };
            console.log(`${dataPoint[0]['parameter']} value: `, aqi);
          })
      } else {
          this.setState({
            loadingAirData: false
          })
      }
      } else {
        console.log('try another city');
      }
    }

    async cityInputHandler (event) {
      this.state.cityInput = event.target.value;
      await this.cityInputAutocomplete(this.state.cityInput);
    }

    async cityInputAutocomplete (query) {
      await fetch('http://localhost:3000/autocomplete', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'query': `${query}`
        }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        console.log(data);
        if(data.suggestions.length !== 0){
          const matchedCities = data.suggestions.filter(entry => {
            return entry.matchLevel === 'city';
          });
          console.log('Matched Cities', matchedCities);
          if(matchedCities.length>=1){
            this.setState({matchedCities});
          }
        }
      });
    }

    async cityTileHandler (e) {
      e.persist();
      const citySelection = e.nativeEvent.path.filter(item => item.id !== '' && item.id !== 'container' && item.tagName === 'DIV')[0].id.split('*')[0];
      const countrySelection = e.nativeEvent.path.filter(item => item.id !== '' && item.id !== 'container' && item.tagName === 'DIV')[0].id.split('*')[1];
      const selection = `${citySelection}*${countrySelection}`;
      const selectedCurrentForecast = this.state.currentForecast.filter(forecast => forecast[`${citySelection}*${countrySelection}`])[0];
      const selectedHourlyForecast = this.state.hourlyForecast.filter(forecast => forecast[`${citySelection}*${countrySelection}`])[0];
      const selectedDailyForecast = this.state.dailyForecast.filter(forecast => forecast[`${citySelection}*${countrySelection}`])[0];
      const selectedTimezone = this.state.timezone[this.state.cities.indexOf(`${citySelection}*${countrySelection}`)][`${citySelection}*${countrySelection}`]*3600*1000;

      // console.log(selectedHourlyForecast[selection]);
      // console.log(selectedDailyForecast[selection]);
      this.setState({
        cityTileClicked: true,
        selectedCity: citySelection,
        selectedCountry: countrySelection,
        selectedCurrentForecast,
        selectedHourlyForecast,
        selectedDailyForecast,
        selectedTimezone,
        selection
      });
    }

    hamburgerButtonHandler = () => {
      this.setState({
        cityTileClicked: false
      })
    }

    sunDirection = (sunDirection) => {
      let zoneHours = parseInt(new Date(this.state[sunDirection][this.state.cities.indexOf(`${this.state.selectedCity}*${this.state.selectedCountry}`)]*1000).getUTCHours())+this.state.timezone[this.state.cities.indexOf(`${this.state.selectedCity}*${this.state.selectedCountry}`)][`${this.state.selectedCity}*${this.state.selectedCountry}`];
      let zoneMinutes = parseInt(new Date(this.state[sunDirection][this.state.cities.indexOf(`${this.state.selectedCity}*${this.state.selectedCountry}`)]*1000).getUTCMinutes())
      let finalHours = zoneHours>23?zoneHours-24:zoneHours<0?24+zoneHours:zoneHours;
      let period = finalHours > 11 ? 'PM':'AM';
      return `${finalHours===0?12:finalHours>12?finalHours-12:finalHours}:${zoneMinutes<10?`0${zoneMinutes}`:zoneMinutes} ${period}`;
    }

    dayOfTheWeekHandler = (dayNumber) => { 
      let dayOfTheWeek = undefined;
      switch(dayNumber) {
        case 0:
          dayOfTheWeek = 'Sunday';
          break;
        case 1:
          dayOfTheWeek = 'Monday';
          break;
        case 2:
          dayOfTheWeek = 'Tuesday';
          break;
        case 3:
          dayOfTheWeek = 'Wednesday';
          break;
        case 4:
          dayOfTheWeek = 'Thursday';
          break;
        case 5:
          dayOfTheWeek = 'Friday';
          break;
        case 6:
          dayOfTheWeek = 'Saturday';
          break;
        default:
          dayOfTheWeek = 'Today'
      }
      return dayOfTheWeek;
    }

    windDirectionHandler = (windDirection) => {
      let cardinalDirection = undefined;
      switch(windDirection) {
        case (windDirection >= 348.75?windDirection:null):
        case (windDirection < 11.25?windDirection:null):
          cardinalDirection = 'N ';
          break;
        case (windDirection >= 11.25 && windDirection < 33.75?windDirection:null):
          cardinalDirection = 'NNE ';
          break;
        case (windDirection >= 33.75 && windDirection < 56.25?windDirection:null):
          cardinalDirection = 'NE ';
          break;
        case (windDirection >= 56.25 && windDirection < 78.75?windDirection:null):
          cardinalDirection = 'ENE ';
          break;
        case (windDirection >= 78.75 && windDirection < 101.25?windDirection:null):
          cardinalDirection = 'E ';
          break;
        case (windDirection >= 101.25 && windDirection < 123.75?windDirection:null):
          cardinalDirection = 'ESE ';
          break;
        case (windDirection >= 123.75 && windDirection < 146.25?windDirection:null):
          cardinalDirection = 'SE ';
          break;
        case (windDirection >= 146.25 && windDirection < 168.75?windDirection:null):
          cardinalDirection = 'SSE ';
          break;
        case (windDirection >= 168.75 && windDirection < 191.25?windDirection:null):
          cardinalDirection = 'S ';
          break;
        case (windDirection >= 191.25 && windDirection < 213.75?windDirection:null):
          cardinalDirection = 'SSW ';
          break;
        case (windDirection >= 213.75 && windDirection < 236.25?windDirection:null): 
          cardinalDirection = 'SW ';
          break;
        case (windDirection >= 236.25 && windDirection < 258.75?windDirection:null):
          cardinalDirection = 'WSW ';
          break;
        case (windDirection >= 258.75 && windDirection < 281.25?windDirection:null):
          cardinalDirection = 'W ';
          break;
        case (windDirection >= 281.25 && windDirection < 303.75?windDirection:null):
          cardinalDirection = 'WNW ';
          break;
        case (windDirection >= 303.75 && windDirection < 326.25?windDirection:null):
          cardinalDirection = 'NW ';
          break;
        case (windDirection >= 326.25 && windDirection < 348.75?windDirection:null):
          cardinalDirection = 'NNW ';
          break;
        default:
          cardinalDirection = '';
      }
      return cardinalDirection;
    }

    aqiText = (aqi) => {
      let aqiText = undefined;
      switch(aqi){
        case(aqi<50?aqi:null):
          aqiText = 'Good';
          break;
        case(aqi>50&&aqi<100?aqi:null):
          aqiText = 'Moderate';
          break;
        case(aqi>100&&aqi<150?aqi:null):
          aqiText = 'Unhealthy for Sensitive Groups';
          break;
        case(aqi>150&&aqi<200?aqi:null):
          aqiText = 'Unhealthy';
          break;
        case(aqi>200&&aqi<300?aqi:null):
          aqiText = 'Very Unhealthy';
          break;
        case(aqi>300?aqi:null):
          aqiText = 'Hazardous';
          break;
        default:
          aqiText = '';
      }
      return aqiText;
    }
    resetLoadingAirData = () => {
      this.setState({
        loadingAirData: true
      })
    }

    timezoneHandler = (unixStamp) => {
      let selection = this.state.selection;
      let zoneHours = parseInt(new Date(unixStamp).getUTCHours())+this.state.timezone[this.state.cities.indexOf(selection)][selection];
      let finalHours = zoneHours>23?zoneHours-24:zoneHours<0?24+zoneHours:zoneHours;
      let period = finalHours > 11 ? 'PM':'AM';
      return `${finalHours===0?12:finalHours>12?finalHours-12:finalHours} ${period}`;
    }

    render() {
        const { currentCity,
          fahrenheit,
          celsius,
          isFahrenheit,
          currentHours,
          currentMinutes,
          period,
          addCityClicked,
          cityTileClicked,
          cities,
          matchedCities,
          isAutocomplete,
          cityId,
          timezone,
          selectedCity,
          selectedCountry,
          weather,
          countryCode,
          forecastData,
          selectedForecast,
          weatherDescription,
          faMinTemp,
          faMaxTemp,
          ceMinTemp,
          ceMaxTemp,
          sunrise,
          sunset,
          rainfall,
          humidity,
          windSpeed,
          windDirection,
          flFahrenheit,
          flCelsius,
          pressure,
          visibility,
          coordinates,
          currentForecast,
          hourlyForecast,
          dailyForecast,
          selectedHourlyForecast,
          selectedDailyForecast,
          selectedCurrentForecast,
          selectedTimezone,
          selection,
          aqiArray,
          loadingAirData,
          opacityPercentage,
          position,
          positionCity,
          overlayDiv
         } = this.state;
        return (
          <Fragment>
              {   cities.length >= 1 && !cityTileClicked && dailyForecast === undefined || aqiArray.length !== cities.length && loadingAirData === true?
                  <div>
                    <p>Loading...</p>
                  </div>
                  : !cityTileClicked ?
                cities.map((city, index) => {
                  let adjustedHours = currentHours+timezone[index][city];
                  let timezoneHours = adjustedHours>23?adjustedHours-24:adjustedHours<0?24+adjustedHours:adjustedHours;
                  return (<Fragment key={city,index}>
                    <div id={`${city}*${countryCode[index]}`} onLoad={this.resetLoadingAirData} onClick={e => this.cityTileHandler(e)} style={{display:'grid',justifyContent: 'space-between',gridTemplateColumns:'1fr 1fr',backgroundColor:'blue',color:'white'}}>
                      <div>
                        <p style={{display:'grid',margin:'1rem 0 0 2rem',gridColumn:'1 / 2',gridRow: '1 / 2',alignSelf:'start',justifySelf:'start'}}>{`${timezoneHours===0?12:timezoneHours>12?timezoneHours-12:timezoneHours}:${currentMinutes} ${timezoneHours>11?'PM':'AM'}`}</p>
                        <h1 style={{display:'grid',margin:'0 0 0 2rem',alignSelf:'start',justifySelf:'start',gridColumn:'1 / 2',gridRow: '1 / 2'}}>{city}</h1>
                      </div>
                    { cities.length>=1 && currentForecast.filter(item => typeof(item[city])==='object')?
                      <h1 style={{justifySelf:'end', marginRight:'2rem'}}>{currentForecast.length>=cities.length && currentForecast.length >=1?`${Math.round(currentForecast.filter(fore => typeof(fore[city]) === 'object')[0][city].temperature)}°`:null}</h1>
                      :
                      null
                    }
                    </div>
                  </Fragment>);
                })
                : selectedCity ?
                    <Fragment>
                      <div style={{backgroundColor:'white', position:`${overlayDiv}`, width:overlayDiv==='fixed'?'100%':null, top:overlayDiv==='fixed'?0:null, height:overlayDiv==='fixed'?'378px':null}}>
                      <div id='stickyDiv' style={{display:'grid', justifySelf:'center', position:`${positionCity}`, top:positionCity==='fixed'?'-50px':'50px', transform: positionCity==='fixed'? 'translateX(-50%)':null, left:'50%', marginTop:'100px'}}>
                        <h1 style={{zIndex:5, display:'grid', justifyContent:'center', margin:0, whiteSpace:'nowrap'}}>{selectedCity}</h1>
                        <p style={{zIndex:5, display:'grid', justifyContent:'center', textAlign:'center', margin:0, whiteSpace:'nowrap'}}>{selectedCurrentForecast[selection]['summary']}</p>
                      </div>
                      <div style={{display:'grid', justifyContent:'center', }}>
                        <p style={{display:'inline', textAlign:'center', fontSize:'6rem', opacity:`${opacityPercentage}`}}>
                          {/* {isFahrenheit ?
                          `${fahrenheit.filter(entry => entry[`${selectedCity}*${selectedCountry}`])[0][`${selectedCity}*${selectedCountry}`]}`
                          :
                          `${celsius.filter(entry => entry[`${selectedCity}*${selectedCountry}`])[0][`${selectedCity}*${selectedCountry}`]}`
                          } */}
                          {
                            currentForecast.length>=cities.length && currentForecast.length >=1?Math.round(currentForecast.filter(fore => typeof(fore[`${selectedCity}*${selectedCountry}`]) === 'object')[0][`${selectedCity}*${selectedCountry}`].temperature):null
                          }
                          <span style={{fontSize:'3rem', display:'inline', verticalAlign:'top', margin:0}}>°</span>
                          </p>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', opacity:`${opacityPercentage}`}}>
                        <p style={{display:'grid', margin:'0 0 0 2rem', gridRow:'1', whiteSpace:'nowrap', fontSize:'2rem'}}>{this.dayOfTheWeekHandler(new Date(selectedDailyForecast[selection][0].time*1000+selectedTimezone).getUTCDay())}</p>
                        <p style={{display:'grid', justifyContent:'end', margin:'0 2rem 0 0', gridRow:'1', whiteSpace:'nowrap', fontSize:'2rem'}}>{`${Math.round(selectedDailyForecast[selection][0].temperatureMax)} ${Math.round(selectedDailyForecast[selection][0].temperatureMin)}`}</p>
                      </div>
                    {
                          <div>
                            <div style={{zIndex:5, position:`${position}`, top:'200px'}}>
                              <hr />
                              <div id='noScrollDiv' style={{display:'grid', overflowY:'scroll', gridTemplateColumns: `repeat(${selectedHourlyForecast[selection].length+1}, 1fr)`, gridTemplateRows: '1fr'}}>
                                  <div style={{display:'grid', width:'calc(12.5vw)'}}>
                                    <p style={{display:'grid', gridRow:'1', fontSize:'1rem', margin:'1rem 0 1rem 2rem', fontWeight:'bold'}}>{'Now'}</p>
                                    <p style={{display:'grid', gridRow:'2', fontSize:'1rem', margin:'1rem 0 1rem 2rem'}}>icon</p>
                                    <p style={{display:'grid', gridRow:'3', fontSize:'1rem', margin:'1rem 0 1rem 2rem', fontWeight:'bold'}}>{`${Math.round(selectedCurrentForecast[selection].temperature)}°`}</p>
                                  </div>
                                {
                                selectedHourlyForecast[selection].map((forecast, index) => {
                                  return <div style={{display:'grid', width:'12.5vw'}}>
                                    <p style={{display:'grid', gridRow:'1', fontSize:'1rem', justifySelf:'center'}}>{this.timezoneHandler(forecast.time*1000)}</p>
                                    <p style={{display:'grid', gridRow:'2', fontSize:'1rem', justifySelf:'center'}}>icon</p>
                                    <p style={{display:'grid', gridRow:'3', fontSize:'1rem', justifySelf:'center'}}>{`${Math.round(forecast.temperature)}°`}</p> 
                                  </div>
                                })
                                }
                              </div>
                              <hr />
                            </div>
                          </div>
                    }
                    </div>
                    {
                      <Fragment>
                        <div style={{display:'grid', marginTop:positionCity==='fixed'?'685px':0, gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: `repeat(${selectedDailyForecast[selection].length},1fr)`}}>
                          {
                          selectedDailyForecast[selection].map((forecast, index) => {
                            if(index !== 0){
                              return <Fragment>
                                <p style={{display:'grid', gridRow:`${index+1}`, gridColumn:'1', marginLeft:'2rem', alignSelf:'center'}}>{this.dayOfTheWeekHandler(new Date(forecast.time*1000+selectedTimezone).getUTCDay())}</p>
                                <p style={{display:'grid', gridRow:`${index+1}`, justifySelf:'center', alignSelf:'center', textAlign:'center'}}>icon</p>
                                <p style={{display:'grid', gridRow:`${index+1}`, gridColumn:'3', justifySelf:'center', alignSelf:'center', margin:'0 2rem 0 0', fontSize:'2rem'}}>{`${Math.round(forecast.temperatureMax)}`}</p>
                                <p style={{display:'grid', gridRow:`${index+1}`, gridColumn:'3', justifySelf:'end', alignSelf:'center', margin:'0 2rem 0 0', fontSize:'2rem'}}>{`${Math.round(forecast.temperatureMin)}`}</p>
                              </Fragment> 
                            }
                          })
                          }
                        </div>
                        <hr />
                      </Fragment>
                    }
                {     
                    <div>                         
                      <p style={{marginLeft:'2rem'}}>{`Today: ${selectedDailyForecast[selection][0]['summary']} It's currently ${Math.round(selectedCurrentForecast[selection]['temperature'])}°; the high will be ${Math.round(selectedDailyForecast[selection][0]['temperatureMax'])}°.`}</p>
                        <hr />
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr'}}>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'1',alignSelf:'start',paddingLeft:'3px'}}>SUNRISE</p>
                <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'1',alignSelf:'center'}}>{this.sunDirection('sunrise')}</p>
                          </div>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'2',alignSelf:'start',paddingLeft:'3px'}}>SUNSET</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'2',alignSelf:'center'}}>{this.sunDirection('sunset')}</p>
                          </div>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr'}}>
                          <div>
                <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'1',alignSelf:'start',paddingLeft:'3px'}}>CHANCE OF {selectedDailyForecast[selection][0].precipType!==undefined?selectedDailyForecast[selection][0].precipType.toUpperCase():'RAIN'}</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'1',alignSelf:'center'}}>{
                            `${Math.round(dailyForecast[cities.indexOf(`${selectedCity}*${selectedCountry}`)][selection][0].precipProbability*100)}%`
                            }</p>
                          </div>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'2',alignSelf:'start',paddingLeft:'3px'}}>HUMIDITY</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'2',alignSelf:'center'}}>{`${selectedCurrentForecast[selection].humidity*100}%`}</p>
                          </div>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr'}}>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'1',alignSelf:'start',paddingLeft:'3px'}}>WIND</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'1',alignSelf:'center'}}>{`${this.windDirectionHandler(selectedCurrentForecast[selection].windBearing)}${Math.round(selectedCurrentForecast[selection].windSpeed)} mph`}</p>
                          </div>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'2',alignSelf:'start',paddingLeft:'3px'}}>FEELS LIKE</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'2',alignSelf:'center'}}>{`${Math.round(selectedCurrentForecast[selection].apparentTemperature)}°`}</p>
                          </div>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr'}}>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'1',alignSelf:'start',paddingLeft:'3px'}}>PRECIPITATION</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'1',alignSelf:'center'}}>{`${rainfall[cities.indexOf(`${selectedCity}*${selectedCountry}`)]} in`}</p>
                          </div>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'2',alignSelf:'start',paddingLeft:'3px'}}>PRESSURE</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'2',alignSelf:'center'}}>{`${Math.round(selectedCurrentForecast[selection].pressure/33.864)} inHg`}</p>
                          </div>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr'}}>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'1',alignSelf:'start',paddingLeft:'3px'}}>VISIBILITY</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'1',alignSelf:'center'}}>{`${selectedCurrentForecast[selection].visibility} mi`}</p>
                          </div>
                          <div>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'2',alignSelf:'start',paddingLeft:'3px'}}>UV INDEX</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'2',alignSelf:'center'}}>{selectedCurrentForecast[selection].uvIndex}</p>
                          </div>
                        </div>

                        { aqiArray.filter(aqi => aqi[selection]).length !== 0?
                        <Fragment>
                          <hr style={{margin:'0 2rem'}}/>
                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr'}}>
                            <div>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'1',alignSelf:'start',paddingLeft:'3px'}}>AIR QUALITY INDEX</p>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'1',alignSelf:'center'}}>{aqiArray.filter(aqi => aqi[selection])[0][selection]}</p>
                            </div>
                            <div>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'1rem',gridRow:'1', gridColumn:'2',alignSelf:'start',paddingLeft:'3px'}}>AIR QUALITY</p>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'2rem', gridRow:'1', gridColumn:'2',alignSelf:'center'}}>{this.aqiText(aqiArray.filter(aqi => aqi[selection])[0][selection])}</p>
                            </div>
                          </div>
                        </Fragment>
                        :
                        null
                        }
                    </div>
               }
                        
                    </Fragment>
                  : null
               }
               { !cityTileClicked ?
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr'}}>
                    <div onClick={this.tempConverter} style={{margin:'1rem 0 0 2rem'}}>
                      <span style={{display:'inline'}}>C°</span><span> / </span><span>F°</span>
                    </div>
                    <button onClick={this.addCityButtonHandler}style={{display:'grid', justifySelf:'end', margin:'1rem 2rem 0 0'}}>+</button>
                  </div>
                :
                  <Fragment>
                    <hr />
                    <div style={{display:'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
                        <p style={{display:'grid', gridColumn:'2/3', justifySelf:'center'}}>...</p>
                        <p onClick={this.hamburgerButtonHandler}style={{display:'grid', gridColumn:'3/4', justifySelf:'end', marginRight:'2rem'}}>E</p>
                    </div>
                  </Fragment>
               }
               {   addCityClicked ?
               <form style={{display:'grid'}}>
                 <input type='text' onChange={() => this.cityInputHandler(event)}/>
                 {/* <button type='submit'>Submit</button> */}
               </form>
               :
               null   }
             
             
                {   matchedCities.length>=1?
                <Fragment>
                  {matchedCities.map((city, index) => {
                    let locationId = matchedCities[index][locationId];
                    let cityName = matchedCities[index]['address']['city'];
                    let stateName = matchedCities[index]['address']['state'];
                    let postalCode = matchedCities[index]['address']['postalCode'];
                    let countryCode = matchedCities[index]['countryCode']
                    return (
                    <Fragment>
                      <p key={locationId} onClick={() => this.addCityHandler(cityName, countryCode)}>{cityName?cityName:null}, {stateName?stateName:null} {postalCode?postalCode:null} {countryCode?countryCode:null}</p>
                    </Fragment>
                    );
                  })}
                </Fragment>
                :
                null    }
          </Fragment>
        );
    }
}


export default Form;


const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<Form />, wrapper) : false;