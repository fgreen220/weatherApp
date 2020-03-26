import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import 'babel-polyfill';
import { Tooltip, SwipeableDrawer, TextField, InputAdornment, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { countryCodes } from '../../countryDictionary';
import '../../styles/style.css';
import SignIn from './SignIn';
import CityTiles from './CityTiles';
import HourlyForecast from './HourlyForecast';


const initialState = {
  isLoggedIn: false,
  cities: [],
  citiesDisplayed: [],
  countryCode: [],
  currentCity: undefined,
  isFahrenheit: true,
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
  selectedForecast: [],
  minTemp: [],
  maxTemp: [],
  uvIndex: [],
  currentForecast: [],
  hourlyForecast: [],
  dailyForecast: [],
  airData: [],
  aqi: [],
  aqiArray: [],
  loadingAirData: false,
  opacityPercentage: 1,
  position:'sticky',
  positionCity:'sticky',
  overlayDiv: 'initial',
  fontMultiplier: window.screen.width>1070?1.4:window.screen.width>1820?2:1,
  swipeStartX: 0,
  swipeStartY: 0,
  swipeEndX: 0,
  swipeEndY: 0,
  zip: [],
  isGuestUser: false,
  cityInputDrawerOpen:false,
  sameCityTooltipOpen:false,
  sameCityId:-1,
  paddingBottomTitle:false,
  paddingBottomAmount:'2vh',
  tempInCelsius:false
};

class Form extends Component {
    constructor() {
        super();


        this.state = {
            isLoggedIn: false,
            cities: [],
            citiesDisplayed: [],
            countryCode: [],
            currentCity: undefined,
            isFahrenheit: true,
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
            selectedForecast: [],
            minTemp: [],
            maxTemp: [],
            uvIndex: [],
            currentForecast: [],
            hourlyForecast: [],
            dailyForecast: [],
            airData: [],
            aqi: [],
            aqiArray: [],
            loadingAirData: false,
            opacityPercentage: 1,
            position:'sticky',
            positionCity:'sticky',
            overlayDiv: 'initial',
            fontMultiplier: window.screen.width>1070?1.4:window.screen.width>1820?2:1,
            swipeStartX: 0,
            swipeStartY: 0,
            swipeEndX: 0,
            swipeEndY: 0,
            zip: [],
            isGuestUser: false,
            cityInputDrawerOpen:false,
            sameCityTooltipOpen:false,
            sameCityId:-1,
            paddingBottomTitle:false,
            paddingBottomAmount:'2vh',
            tempInCelsius:false
        };

        this.addCityHandler = this.addCityHandler.bind(this);
        this.cityInputHandler = this.cityInputHandler.bind(this);
        this.testData = this.testData.bind(this);
        this.cityInputAutocomplete = this.cityInputAutocomplete.bind(this);
        this.cityTileHandler = this.cityTileHandler.bind(this);
        this.darkSkyData = this.darkSkyData.bind(this);
        this.signInHandler = this.signInHandler.bind(this);
        this.testPoints = this.testPoints.bind(this);
        this.updateLoadedState = this.updateLoadedState.bind(this);
    }

    listenScrollEvent = e => {
      if (window.scrollY < 5) {
        this.setState({opacityPercentage: 1})
      }
      if (window.scrollY > 10) {
        this.setState({opacityPercentage: 0.75})
      }
      if (window.scrollY > 15) {
        this.setState({opacityPercentage: 0.5})
      }
      if (window.scrollY > 20) {
        this.setState({opacityPercentage: 0.25});

      }
      if (window.scrollY > 25) {
        this.setState({opacityPercentage: 0});
      }
      if (window.scrollY > 200) {
        this.setState({paddingBottomTitle:true});
      }
      if (window.scrollY < 200) {
        this.setState({paddingBottomTitle:false});
      }

      // if (window.scrollY > 30) {
      //   document.querySelector('#divScale').style.height = '27vh';
      // }
      // if (window.scrollY > 35) {
      //   document.querySelector('#divScale').style.height = '30.5vh';
      // }
      // if (window.scrollY > 40) {
      //   document.querySelector('#divScale').style.height = '34vh';
      // }
    }

    componentDidMount () {
      window.addEventListener('beforeunload', this.testPoints);
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

    componentDidUpdate () {
      if(localStorage.getItem('stateObject') && this.state.isGuestUser){
        localStorage.setItem('stateObject', JSON.stringify({...this.state, cityInputDrawerOpen:false, matchedCities:[], opacityPercentage:1, paddingBottomTitle:false}));
      } else if(!localStorage.getItem('stateObject')) {
        localStorage.setItem('stateObject', JSON.stringify(initialState));
      }
    }

    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.testPoints)
      if(this.state.id){
        this.testPoints();
      }
      if(this.state.isGuestUser){
        this.setState({cityInputDrawerOpen:false, matchedCities:[], opacityPercentage:1, paddingBottomTitle:false});
      }
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

    guestUserLoginHandler = async () => {
      if(localStorage.getItem('stateObject') !== JSON.stringify(initialState) &&
      await localStorage.getItem('stateObject')) {
        this.setState(({...JSON.parse(localStorage.getItem('stateObject')), isLoggedIn:true, isGuestUser:true}));
      }
      this.updateLoadedState();
      // if(this.state.isGuestUser && localStorage.getItem('stateObject')) {
      //   this.setState(prevState => ({prevState, ...JSON.parse(localStorage.getItem('stateObject'))}));
      // }
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

    async testData (country, city, zip='00000') {
      console.log(country, city, 'Zip: ', zip);
      let countryFinal = countryCodes.filter(code => {
        return code[country];
      })[0][country];

      await fetch(`http://localhost:3000/currentWeather`, {
          method: 'get',
          headers: {
              'Content-Type': 'application/json',
              'zip': `${zip?parseInt(zip):0}`,
              'city': `${city}`,
              'country': `${countryFinal}`
          }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        if(data.name !== undefined){
        const timezone = data.timezone/3600;
        const rainfall = data.rain?Math.round(data.rain['1h']/25.4):0;
        // const pressure = Math.round(data.main.pressure/33.864);
        // const visibility = Math.round(data.visibility/1609);
        console.log(data);
        if(this.state.cities.filter(item => item === `${city}*${country}`).length>=1) {
          const cityIndex = this.state.cities.indexOf(`${city}*${country}`);
          const cityString = this.state.cities[cityIndex];
          this.setState({currentCity: `${city}*${country}`,
            temp: data.main.temp,
            timezone: [...this.state.timezone.slice(0,cityIndex),
              {...this.state.timezone[cityIndex], [cityString]:timezone},
              ...this.state.timezone.slice(cityIndex+1)],
            sunrise: [...this.state.sunrise.slice(0,cityIndex), data.sys.sunrise, ...this.state.sunrise.slice(cityIndex+1)],
            sunset: [...this.state.sunset.slice(0,cityIndex), data.sys.sunset, ...this.state.sunset.slice(cityIndex+1)],
            rainfall: [...this.state.rainfall.slice(0,cityIndex), rainfall, ...this.state.rainfall.slice(cityIndex+1)],
            coordinates: [...this.state.coordinates.slice(0,cityIndex),
              {...this.state.coordinates[cityIndex], city: `${city}*${country}`, lat:data.coord.lat, lon:data.coord.lon},
              ...this.state.coordinates.slice(cityIndex+1)],
            });
        }

        if(this.state.cities.length > 0 &&
          this.state.cities.filter(item => item === `${city}*${country}`).length===0){
          this.setState({currentCity: `${city}*${country}`,
            temp: data.main.temp,
            timezone: [...this.state.timezone, {[`${city}*${country}`]:timezone}],
            sunrise: [...this.state.sunrise, data.sys.sunrise],
            sunset: [...this.state.sunset, data.sys.sunset],
            rainfall: [...this.state.rainfall, rainfall],
            coordinates: [...this.state.coordinates,{city: `${city}*${country}`, lat:data.coord.lat, lon:data.coord.lon}],
            });
        } else if (this.state.cities.length === 0) {
            this.setState({currentCity: `${city}*${country}`,
              temp: data.main.temp,
              timezone: [{[`${city}*${country}`]:timezone}],
              sunrise: [data.sys.sunrise],
              sunset: [data.sys.sunset],
              rainfall: [rainfall],
              coordinates: [{city: `${city}*${country}`,lat:data.coord.lat, lon:data.coord.lon}],
            });
        }
        }
      })
      .catch(e => console.error(e))
    }
    
    async darkSkyData (city, country, latitude, longitude, zip='00000') {
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
        } else if(this.state.currentForecast.length >= 1 &&
          this.state.currentForecast.filter(elem => elem[`${city}*${country}`]).length === 0){
            this.setState({
              currentForecast: [...this.state.currentForecast, {[`${city}*${country}`]: data.currently}],
              hourlyForecast: [...this.state.hourlyForecast, {[`${city}*${country}`]: data.hourly.data.slice(1,25)}],
              dailyForecast: [...this.state.dailyForecast, {[`${city}*${country}`]: data.daily.data}],
            });
          } else if(this.state.currentForecast.filter(elem => elem[`${city}*${country}`]).length >= 1) {
            const forecastIndex = this.state.currentForecast.findIndex(cast => cast[`${city}*${country}`]) 
            this.setState({
              currentForecast: [...this.state.currentForecast.slice(0,forecastIndex),
                {...this.state.currentForecast[forecastIndex], [`${city}*${country}`]: data.currently},
                ...this.state.currentForecast.slice(forecastIndex+1)],
              hourlyForecast: [...this.state.hourlyForecast.slice(0,forecastIndex),
                {...this.state.hourlyForecast[forecastIndex], [`${city}*${country}`]: data.hourly.data.slice(1,25)},
                ...this.state.hourlyForecast.slice(forecastIndex+1)],
              dailyForecast: [...this.state.dailyForecast.slice(0,forecastIndex),
                {...this.state.dailyForecast[forecastIndex], [`${city}*${country}`]: data.daily.data},
                ...this.state.dailyForecast.slice(forecastIndex+1)]
            });
          }

      })
    }

    tempConverter = () => {
      this.setState({tempInCelsius:!this.state.tempInCelsius})
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
      this.setState({
        addCityClicked: true,
        cityInputDrawerOpen: true
      });
    }

    async updateLoadedState (city, country, zip='00000') {
      console.log('loading updated state *****************')
      let cities = this.state.cities;
      for(let i = 0; i<cities.length;i++) {
        city = cities[i].split('*')[0];
        country = cities[i].split('*')[1];
        zip = this.state.zip[i];
        console.log('Ziiiiiiiiiiiiiiiiiiiiiiiiip', zip)
        await this.testData(country, city, zip?parseInt(zip):0);
        console.log('loading test data *****************')
        await this.darkSkyData(city,
          country,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lat,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lon);
        console.log('loading darksky data *****************')
        await this.airData(this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lat,
        this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lon,
        `${city}*${country}`); 
        console.log('loading air data *****************')
        if(this.state.currentCity === `${city}*${country}`) {
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
              if(index === this.state.airData.length-1 && this.state.aqiArray.filter(aqi => aqi[`${city}*${country}`]).length>=1){
                const aqiIndex = this.state.aqiArray.findIndex(aqi => typeof(aqi[`${city}*${country}`]) === 'number');
                this.setState({
                  aqiArray: [...this.state.aqiArray.slice(0,aqiIndex),
                    {...this.state.aqiArray[aqiIndex], [`${city}*${country}`]: Math.round(this.state.aqi.reduce((a, b) => {
                      return Math.max(a,b);
                    }, 0))}, ...this.state.aqiArray.slice(aqiIndex+1)],
                  airData: [],
                  aqi: []
                })
              };
              if(index === this.state.airData.length-1 && this.state.aqiArray.filter(aqi => aqi[`${city}*${country}`]).length===0){
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
        } 
      } else {
        console.log('try another city');
      }
    }
  }
    async addCityHandler (city, country, zip='00000', e) {
      e.persist();
      console.log(e);
      const cities = this.state.cities;
      const countryCode = this.state.countryCode;
      const fahrenheit = this.state.fahrenheit;
      if(cities.filter(item => item === city).length === 0 || countryCode.filter(item => item === country).length === 0){
        await this.testData(country, city, zip?parseInt(zip):0);
      }
      if((cities.filter(item => item === city).length===0 ||
      countryCode.filter(item => item === country).length === 0) && 
      (fahrenheit?fahrenheit.filter(item => typeof(item[`${city}*${country}`]) === 'number').length !== 0:null ||
      this.state.currentCity === `${city}*${country}`)) {
        console.log(this.state.currentCity);
        this.setState({
          cities: [...this.state.cities, `${city}*${country}`],
          countryCode: [...this.state.countryCode, country],
          zip: [...this.state.zip, zip?parseInt(zip):0],
          matchedCities: []
          });
        await this.darkSkyData(city,
          country,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lat,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lon);
        console.log('Current Forecast: ',this.state.currentForecast);
        console.log('Hourly Forecast: ', this.state.hourlyForecast);
        console.log('Daily Forecast: ', this.state.dailyForecast);
        console.log(this.state.cities);
        this.setState({
          loadingAirData: true
        });
        await this.airData(this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lat,
        this.state.coordinates.filter(coords => coords.city === `${city}*${country}`)[0].lon,
        `${city}*${country}`); 
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
        e.target.id = `tooltip`;
        console.log(e.target);
        setTimeout(() => {
          document.querySelectorAll(`#tooltip`)[0].id='';
        },4000);
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
        console.log(data.suggestions);
        if(data.suggestions !== undefined){
            this.setState({matchedCities: data.suggestions});
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
        case(aqi<=50?aqi:null):
          aqiText = 'Good';
          break;
        case(aqi>50&&aqi<=100?aqi:null):
          aqiText = 'Moderate';
          break;
        case(aqi>100&&aqi<=150?aqi:null):
          aqiText = 'Unhealthy for Sensitive Groups';
          break;
        case(aqi>150&&aqi<=200?aqi:null):
          aqiText = 'Unhealthy';
          break;
        case(aqi>200&&aqi<=300?aqi:null):
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
        loadingAirData: false
      })
    }

    timezoneHandler = (unixStamp, functionCaller) => {
      let selection = this.state.selection;
      let zoneHours = parseInt(new Date(unixStamp).getUTCHours())+this.state.timezone[this.state.cities.indexOf(selection)][selection];
      let finalHours = zoneHours>23?zoneHours-24:zoneHours<0?24+zoneHours:zoneHours;
      let period = finalHours > 11 ? 'PM':'AM';
      return (
        functionCaller === 'tileTime' ? 
        `${finalHours===0?12:finalHours>12?finalHours-12:finalHours}:${this.state.currentMinutes} ${period}`
        :
        `${finalHours===0?12:finalHours>12?finalHours-12:finalHours} ${period}`
        
      );
    }

    iconSelector = (icon) => {
      let iconPath = undefined;
      switch (icon) {
        case 'clear-day':
          iconPath = './assets/day.svg';
          break;
        case 'clear-night':
          iconPath = './assets/night.svg';
          break;
        case 'rain':
          iconPath = './assets/rainy-3.svg';
          break;
        case 'snow':
        case 'sleet':
          iconPath = './assets/snowy-1.svg';
          break;
        case 'wind':
          iconPath = './assets/wind.svg';
          break;
        case 'fog':
          iconPath = './assets/haze.svg';
          break;
        case 'cloudy':
        case 'partly-cloudy-day':
          iconPath = './assets/cloudy-day-1.svg';
          break;
        case 'partly-cloudy-night':
          iconPath = './assets/cloudy-night-1.svg';
          break;
        case 'tornado':
        case 'thunderstorm':
        case 'hail':
          iconPath = './assets/thunder.svg';
          break;
        default:
          iconPath = './assets/cloudy.svg';
      }
      return iconPath;
    }

    async signInHandler (username, password) {
      console.log(username, password)
      await fetch('http://localhost:3000/login', {
        method:'get',
        headers: {
          'Content-Type':'application/json',
          'username': `${username}`,
          'password': `${password}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if(data.isLoggedIn && data.state === undefined) {
          console.log(data);
          this.setState({
            isLoggedIn: true,
            id:data.id
          })
        } else if(data.isLoggedIn && data.state !== undefined) {
            console.log(data.state);
            this.setState({
              ...data.state,
              isLoggedIn: true,
              id:data.id,
            })
            this.updateLoadedState();
          } 
        else {
          console.log('Invalid login')
        }
      })
    }

    async testPoints () {
      if((!this.state.isGuestUser && isLoggedIn) && (this.state.isGuestUser && !isLoggedIn)){
        await fetch(`http://localhost:3000/users/${this.state.id}`, {
          method:'put',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({state:{...this.state, cityInputDrawerOpen:false, matchedCities:[], opacityPercentage:1, paddingBottomTitle:false}})
        })
        .then(response => response.json())
        .then(data => console.log(data.response))
      }
    }

    dragTileHandler = (e) => {
      e.persist();
      e.preventDefault();
      console.log('dragging');
    }

    render() {
        const {isFahrenheit,
          currentHours,
          currentMinutes,
          period,
          addCityClicked,
          cityTileClicked,
          cities,
          matchedCities,
          isAutocomplete,
          timezone,
          selectedCity,
          selectedCountry,
          countryCode,
          selectedForecast,
          sunrise,
          sunset,
          rainfall,
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
          overlayDiv,
          fontMultiplier,
          isLoggedIn,
          sameCityId,
          sameCityTooltipOpen,
          paddingBottomTitle,
          paddingBottomAmount,
          tempInCelsius
         } = this.state;

        return (
          <Fragment>
              { !isLoggedIn ?
                <SignIn 
                signInHandler={this.signInHandler}
                guestUserLoginHandler={this.guestUserLoginHandler}
                updateLoadedState={this.updateLoadedState}
                />
              :
              cities.length >= 1 && !cityTileClicked && currentForecast === undefined && loadingAirData === true && isLoggedIn?
                  <div>
                    <p>Loading...</p>
                  </div>
                  : !cityTileClicked && isLoggedIn?
                    <CityTiles 
                      cities={cities}
                      currentForecast={currentForecast}
                      countryCode={countryCode}
                      resetLoadingAirData={this.resetLoadingAirData}
                      cityTileHandler={this.cityTileHandler}
                      timezoneHandler={this.timezoneHandler}
                      tempInCelsius={tempInCelsius}
                    />
                : selectedCity && isLoggedIn ?
                      <div className={currentForecast.length === cities.length ?
                        `${currentForecast.filter(cast => cast[selection])[0][selection]['icon']}`:
                         'cloudy'} style={{height:'100%'}}>
                        <div id='stickyDiv' style={{background:'inherit', minHeight:'10vh', position:'sticky', top:0, paddingTop:'5vh', display:'grid', textAlign:'center', margin:0, zIndex:5, paddingBottom: paddingBottomTitle ? `15vh` : null}}>
                          <p style={{zIndex:5, display:'grid', justifyContent:'center', fontSize:'min(8vw, 40px)', whiteSpace:'nowrap', margin:0}}>
                            {selectedCity}
                            <span style={{zIndex:5, display:'grid', justifyContent:'center', fontSize:'min(4vw, 20px)', textAlign:'center', whiteSpace:'nowrap', margin:0}}>{selectedCurrentForecast[selection]['summary']}</span>
                          </p>
                        </div>
                        <p className='removeTemp' style={{zIndex:5, position:'absolute', margin:0, left:'50%', transform:'translateX(-50%)', fontSize:'12vh', opacity:`${opacityPercentage}`}}>
                          {
                          !tempInCelsius ? 
                            Math.round(selectedCurrentForecast[selection]['temperature'])
                          : Math.round((selectedCurrentForecast[selection]['temperature']-32)*(5/9))
                          }
                          <span style={{position:'absolute', fontSize:'6vh', display:'inline', verticalAlign:'top', margin:0}}>°</span>
                        </p>
                    {
                      <HourlyForecast 
                        opacityPercentage={opacityPercentage}
                        dayOfTheWeekHandler={this.dayOfTheWeekHandler}
                        selectedDailyForecast={selectedDailyForecast}
                        selection={selection}
                        selectedTimezone={selectedTimezone}
                        tempInCelsius={tempInCelsius}
                        selectedHourlyForecast={selectedHourlyForecast}
                        iconSelector={this.iconSelector}
                        selectedCurrentForecast={selectedCurrentForecast}
                        timezoneHandler={this.timezoneHandler}
                      />
                    }
                    {
                      <div style={{height:'100%', marginTop:'2vh'}}>
                        <div style={{gridRowGap:'3vh', height:'100%', display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: `repeat(${selectedDailyForecast[selection].length-1},1fr)`}}>
                          {
                          selectedDailyForecast[selection].map((forecast, index) => {
                            if(index !== 0){
                              let iconPath = this.iconSelector(forecast['icon'])
                              return <Fragment key={`${Math.round(forecast.time*1000)}${index}`}>
                                <p style={{fontSize:'min(6vw, 30px)', display:'grid', gridRow:`${index}`, gridColumn:'1', marginLeft:'2rem', alignSelf:'center'}}>{`${this.dayOfTheWeekHandler(new Date(forecast.time*1000+selectedTimezone).getUTCDay())}`}</p>
                                <p style={{display:'grid', gridRow:`${index}`, justifySelf:'center', alignSelf:'center', textAlign:'center'}}><img src={`${iconPath}`} /></p>
                                <p style={{display:'grid', gridRow:`${index}`, gridColumn:'3', justifySelf:'center', alignSelf:'center', margin:'0 2rem 0 0', fontSize:'min(6vw, 30px)'}}>
                                  {`${!tempInCelsius ? Math.round(forecast.temperatureMax) :
                                    Math.round((forecast.temperatureMax-32)*(5/9))}`}
                                </p>
                                <p style={{display:'grid', gridRow:`${index}`, gridColumn:'3', justifySelf:'end', alignSelf:'center', margin:'0 2rem 0 0', fontSize:'min(6vw, 30px)'}}>
                                  {`${!tempInCelsius ? Math.round(forecast.temperatureMin) :
                                    Math.round((forecast.temperatureMin-32)*(5/9))}`}
                                </p>
                              </Fragment> 
                            }
                          })
                          }
                        </div>
                        <hr />
                      </div>
                    }
                {     
                    <div style={{height:'100%'}}>                    
                      <p style={{height:'4vh', lineHeight:'4vh', margin:'0 2rem 2rem 2rem'}}>
                        {`Today: ${selectedDailyForecast[selection][0]['summary']} It's currently ${!tempInCelsius ?
                        Math.round(selectedCurrentForecast[selection]['temperature']) : 
                        Math.round((selectedCurrentForecast[selection]['temperature']-32)*(5/9))}°; the high will be ${!tempInCelsius ?
                        Math.round(selectedDailyForecast[selection][0]['temperatureMax']) :
                        Math.round((selectedDailyForecast[selection][0]['temperatureMax']-32)*(5/9))}°.`}
                        </p>
                        <hr style={{marginBottom:0}}/>
                        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)', gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>SUNRISE</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{this.sunDirection('sunrise')}</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)', gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>SUNSET</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{this.sunDirection('sunset')}</p>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>CHANCE OF {selectedDailyForecast[selection][0].precipType!==undefined?selectedDailyForecast[selection][0].precipType.toUpperCase():'RAIN'}</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{
                            `${Math.round(dailyForecast[cities.indexOf(`${selectedCity}*${selectedCountry}`)][selection][0].precipProbability*100)}%`
                            }</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>HUMIDITY</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{`${Math.round(selectedCurrentForecast[selection].humidity*100)}%`}</p>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>WIND</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{`${this.windDirectionHandler(selectedCurrentForecast[selection].windBearing)}${Math.round(selectedCurrentForecast[selection].windSpeed)} mph`}</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>FEELS LIKE</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>
                              {`${!tempInCelsius ? Math.round(selectedCurrentForecast[selection].apparentTemperature) :
                                Math.round((selectedCurrentForecast[selection].apparentTemperature-32)*(5/9))}°`}
                            </p>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>PRECIPITATION</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{`${rainfall[cities.indexOf(`${selectedCity}*${selectedCountry}`)]} in`}</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>PRESSURE</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{`${Math.round(selectedCurrentForecast[selection].pressure/33.864)} inHg`}</p>
                        </div>
                        <hr style={{margin:'0 2rem'}}/>

                        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>VISIBILITY</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{`${selectedCurrentForecast[selection].visibility} mi`}</p>
                            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>UV INDEX</p>
                            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{selectedCurrentForecast[selection].uvIndex}</p>
                        </div>

                        { aqiArray.filter(aqi => aqi[selection]).length !== 0 && isLoggedIn?
                        <Fragment>
                          <hr style={{margin:'0 2rem'}}/>
                          <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>AIR QUALITY INDEX</p>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{aqiArray.filter(aqi => aqi[selection])[0][selection]}</p>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>AIR QUALITY</p>
                              <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{this.aqiText(aqiArray.filter(aqi => aqi[selection])[0][selection])}</p>
                          </div>
                        </Fragment>
                        :
                        null
                        }
                      </div>
               }
                    <div style={{position:'relative', bottom:0}}>
                      <hr />
                      <div style={{display:'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
                          <p style={{display:'grid', gridColumn:'2/3', justifySelf:'center'}}>...</p>
                          <p onClick={this.hamburgerButtonHandler}style={{display:'grid', gridColumn:'3/4', justifySelf:'end', marginRight:'2rem'}}>E</p>
                      </div>
                    </div>
                  </div>
                  : null
               }
               { !cityTileClicked && isLoggedIn?
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr'}}>
                    <div onClick={this.tempConverter} style={{margin:'1rem 0 0 2rem', width:'fit-content', cursor:'pointer'}}>
                      <span style={{display:'inline'}}>C°</span><span> / </span><span>F°</span>
                    </div>
                    <button onClick={this.addCityButtonHandler}style={{display:'grid', justifySelf:'end', margin:'1rem 2rem 0 0'}}>+</button>
                    {/* <button onClick={this.testPoints}>Test Points</button> */}
                  </div>
                :
                null
               }
               <SwipeableDrawer
                open={this.state.cityInputDrawerOpen}
                onOpen={() => this.setState({cityInputDrawerOpen:true})}
                onClose={() => this.setState({cityInputDrawerOpen:false, matchedCities:[]})}
                anchor='bottom'
                id='cityInputDrawer'
               >
                <div style={{backgroundColor:'gray'}}>
                  <p style={{textShadow:'none', fontWeight:400, textAlign:'center'}}>Enter city</p>
                  {  
                    addCityClicked && isLoggedIn ?
                      <div style={{display:'flex', margin:'0 1rem'}}>
                        <form style={{width:'100%'}} id='city-input-form'>
                          <TextField 
                            InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                  <Search />
                              </InputAdornment>
                            )
                          }} style={{width:'100%'}} onChange={() => this.cityInputHandler(event)}/>
                        </form>
                        <Button style={{color:'white', marginLeft:'0.25rem'}} onClick={() => this.setState({cityInputDrawerOpen:false, matchedCities:[]})}>Cancel</Button>
                      </div>
                      : null   
                  }
                </div>

                {   
                  matchedCities.length>=1 && isLoggedIn?
                    <Fragment>
                      {matchedCities.map((city, index) => {
                        let locationId = city[locationId];
                        let cityName = city['address']['city'];
                        let stateName = city['address']['state'];
                        let zip = city['address']['postalCode'];
                        let countryCode = city['countryCode'];
                        return (
                          <Tooltip open={sameCityId === index ? sameCityTooltipOpen : false} title='Try another city'
                            onOpen={() => null}
                            onClose={() => this.setState({sameCityId:-1, sameCityTooltipOpen:false})}
                            key={`${locationId}${index}`}
                          > 
                            <p style={{color:'black', fontWeight:'none', textShadow:'none'}} onClick={e => {
                              if(this.state.cities.filter(item => item === `${cityName}*${countryCode}`).length === 0){
                                this.addCityHandler(cityName, countryCode, zip, e);
                                this.setState({cityInputDrawerOpen:false, matchedCities:[], sameCityId:-1});
                              } else if(this.state.cities.filter(item => item === `${cityName}*${countryCode}`).length >= 1) {
                                  this.setState({sameCityId:index, sameCityTooltipOpen:true})
                              }
                            }}>{cityName?cityName:null}, {stateName?stateName:null} {countryCode?countryCode:null}</p>
                          </Tooltip>
                      )})}
                    </Fragment>
                :
                null    }
               </SwipeableDrawer>
            
          </Fragment>
        );
    }
}


export default Form;


const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<Form />, wrapper) : false;