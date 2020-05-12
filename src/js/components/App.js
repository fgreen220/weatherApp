import React, { Component, Fragment } from "react";
import 'babel-polyfill';
import ReactDOM from 'react-dom';
import { SwipeableDrawer, IconButton, Button, Modal } from '@material-ui/core';
import { FormatListBulleted, AddCircleOutline } from '@material-ui/icons';
import { countryCodes } from '../../countryDictionary';
import '../../styles/style.css';
import SignIn from './SignIn';
import CityTiles from './CityTiles';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import MatchedCities from './MatchedCities';
import CityInputSearchBar from './CityInputSearchBar';
import DetailedWeatherInformation from './DetailedWeatherInformation';


const initialState = {
  isLoggedIn: false,
  cities: [],
  citiesDisplayed: [],
  countryCode: [],
  coordinates: [],
  currentCity:'',
  rainfall: [],
  dailyForecast:[],
  hourlyForecast:[],
  selectedCurrentForecast: {},
  selectedDailyForecast: {},
  selectedHourlyForecast: {},
  selectedTimezone: '',
  selectedZip:'',
  sunrise:[],
  sunset:[],
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
  selectedZip: undefined,
  selectedForecast: [],
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
  tempInCelsius:false,
  cityFailedSearch: false,
  paddingBottomSize:'0vh',
  selection:'',
  signupSuccessTooltipOpen:false,
  signInFailureTooltipOpen:false
};

class App extends Component {
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
            selectedZip: undefined,
            selectedForecast: [],
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
            tempInCelsius:false,
            cityFailedSearch: false,
            paddingBottomSize:'0vh',
            selection: '',
            signupSuccessTooltipOpen:false,
            signInFailureTooltipOpen:false
        };

        this.targetScrollElement = React.createRef();

        this.addCityHandler = this.addCityHandler.bind(this);
        this.cityInputHandler = this.cityInputHandler.bind(this);
        this.testData = this.testData.bind(this);
        this.cityInputAutocomplete = this.cityInputAutocomplete.bind(this);
        this.cityTileHandler = this.cityTileHandler.bind(this);
        this.darkSkyData = this.darkSkyData.bind(this);
        this.signInHandler = this.signInHandler.bind(this);
        this.signUpHandler = this.signUpHandler.bind(this);
        this.testPoints = this.testPoints.bind(this);
        this.updateLoadedState = this.updateLoadedState.bind(this);
        this.signinUsernameRetriever = this.signinUsernameRetriever.bind(this);
    }

    listenScrollEvent = e => {
      let elementToScroll;
      this.targetScrollElement.current ? elementToScroll = this.targetScrollElement.current : null;
      if(elementToScroll) {
        if (elementToScroll.scrollTop < 5) {
          this.setState({opacityPercentage: 1})
        }
        if (elementToScroll.scrollTop > 10) {
          this.setState({opacityPercentage: 0.75})
        }
        if (elementToScroll.scrollTop > 15) {
          this.setState({opacityPercentage: 0.5})
        }
        if (elementToScroll.scrollTop > 20) {
          this.setState({opacityPercentage: 0.25});
  
        }
        if (elementToScroll.scrollTop > 25) {
          this.setState({opacityPercentage: 0});
        }
      }
    }

    componentDidMount () {
      window.addEventListener('beforeunload', this.testPoints);
      this.tick();
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

    componentDidUpdate (prevProps, prevState) {
      if(this.state.id && prevState.cities !== this.state.cities) {
        this.testPoints();
      }
      if(localStorage.getItem('stateObject') && this.state.isGuestUser && this.state.cities.length >= 1){
        localStorage.setItem('stateObject', JSON.stringify({...this.state, cityInputDrawerOpen:false, matchedCities:[], opacityPercentage:1, paddingBottomTitle:false, paddingBottomSize:'0vh', cityInput:''}));
      } else if(localStorage.getItem('stateObject') && this.state.isGuestUser && this.state.cities.length === 0){
        localStorage.setItem('stateObject', JSON.stringify({...initialState}));
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
        this.setState({cityInputDrawerOpen:false, matchedCities:[], opacityPercentage:1, paddingBottomTitle:false, paddingBottomSize:'0vh'});
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
      if(await localStorage.getItem('stateObject')) {
        this.setState(({...JSON.parse(localStorage.getItem('stateObject')), isLoggedIn:true, isGuestUser:true}));
      }
      this.updateLoadedState();
      // if(this.state.isGuestUser && localStorage.getItem('stateObject')) {
      //   this.setState(prevState => ({prevState, ...JSON.parse(localStorage.getItem('stateObject'))}));
      // }
    }

    // async airData (lat, lon, currentCity) {
    //   const parameters = ['pm25','pm10','o3','co','so2','no2'];
    //   for(let i=0;i<parameters.length;i++) {
    //     let averagingPeriod;
    //     switch(parameters[i]) {
    //       case 'pm25':
    //       case 'pm10':
    //       case 'so2':
    //         averagingPeriod = 24;
    //         break;
    //       case 'o3':
    //       case 'co':
    //         averagingPeriod = 8;
    //         break;
    //       case 'no2':
    //         averagingPeriod = 1;
    //         break;
    //       default:
    //         averagingPeriod = 12;
    //     }
    //    await fetch(`http://localhost:3000/airData`, {
    //       method: 'get',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'latitude': `${lat}`,
    //         'longitude': `${lon}`,
    //         'averagingperiod': `${averagingPeriod}`,
    //         'parameter': `${parameters[i]}`
    //       }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //       data = JSON.parse(data);
    //       console.log(data);
    //       if(i === 0 && data.results.length !== 0){
    //         this.setState({
    //           airData:[data.results]
    //         })
    //       } 
    //       if(i >= 1 && i<6 && data.results.length !== 0){
    //         this.setState({
    //           airData:[...this.state.airData, data.results]
    //         })
    //       }
    //     })
    //   }
    // }

    async testData (country, city, zip='99999') {
      let countryFinal = countryCodes.filter(code => {
        return code[country];
      })[0][country];
      await fetch(`https://sheltered-citadel-75989.herokuapp.com/currentWeather`, {
          method: 'get',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'zip': `${zip}`,
              'city': `${city}`,
              'country': `${countryFinal}`
          }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        if(data.name !== undefined){
        const timezone = data.timezone/3600;
        const rainfall = data.rain === undefined? 0 : data.rain['1h'] && data.rain['1h'] > 2.54?
        Math.round(data.rain['1h']/25.4):
        data.rain['1h'] && data.rain['1h'] < 2.54 ?
        0.1
        :
        data.rain['3h'] && data.rain['3h'] > 7.62 ?
        Math.round(data.rain['3h']/(25.4*3))
        : 
        data.rain['3h'] && data.rain['3h'] < 7.62 ? 
        0.1
        :
        0.1
        ;
        if(this.state.cities.filter(item => item === `${city}*${country}*${zip}`).length>=1) {
          const cityIndex = this.state.cities.indexOf(`${city}*${country}*${zip}`);
          const cityString = this.state.cities[cityIndex];
          this.setState({currentCity: `${city}*${country}*${zip}`,
            timezone: [...this.state.timezone.slice(0,cityIndex),
              {...this.state.timezone[cityIndex], [cityString]:timezone},
              ...this.state.timezone.slice(cityIndex+1)],
            sunrise: [...this.state.sunrise.slice(0,cityIndex), data.sys.sunrise, ...this.state.sunrise.slice(cityIndex+1)],
            sunset: [...this.state.sunset.slice(0,cityIndex), data.sys.sunset, ...this.state.sunset.slice(cityIndex+1)],
            rainfall: [...this.state.rainfall.slice(0,cityIndex), rainfall, ...this.state.rainfall.slice(cityIndex+1)],
            coordinates: [...this.state.coordinates.slice(0,cityIndex),
              {...this.state.coordinates[cityIndex], city: `${city}*${country}*${zip}`, lat:data.coord.lat, lon:data.coord.lon},
              ...this.state.coordinates.slice(cityIndex+1)],
            });
        }

        if(this.state.cities.length > 0 &&
          this.state.cities.filter(item => item === `${city}*${country}*${zip}`).length===0){
          this.setState({currentCity: `${city}*${country}*${zip}`,
            timezone: [...this.state.timezone, {[`${city}*${country}*${zip}`]:timezone}],
            sunrise: [...this.state.sunrise, data.sys.sunrise],
            sunset: [...this.state.sunset, data.sys.sunset],
            rainfall: [...this.state.rainfall, rainfall],
            coordinates: [...this.state.coordinates,{city: `${city}*${country}*${zip}`, lat:data.coord.lat, lon:data.coord.lon}],
            });
        } else if (this.state.cities.length === 0) {
            this.setState({currentCity: `${city}*${country}*${zip}`,
              timezone: [{[`${city}*${country}*${zip}`]:timezone}],
              sunrise: [data.sys.sunrise],
              sunset: [data.sys.sunset],
              rainfall: [rainfall],
              coordinates: [{city: `${city}*${country}*${zip}`,lat:data.coord.lat, lon:data.coord.lon}],
            });
        }
        }
      })
      .catch(e => console.error(e))
    }
    
    async darkSkyData (city, country, latitude, longitude, zip='99999') {
      
      await fetch(`https://sheltered-citadel-75989.herokuapp.com/darkSky`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'latitude': `${latitude}`,
          'longitude': `${longitude}`
        }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        if(this.state.currentForecast.length === 0){
          this.setState({
            currentForecast: [{[`${city}*${country}*${zip}`]: data.currently}],
            hourlyForecast: [{[`${city}*${country}*${zip}`]: data.hourly.data.slice(1,25)}],
            dailyForecast: [{[`${city}*${country}*${zip}`]: data.daily.data}]
          });
        } else if(this.state.currentForecast.length >= 1 &&
          this.state.currentForecast.filter(elem => elem[`${city}*${country}*${zip}`]).length === 0){

            this.setState({
              currentForecast: [...this.state.currentForecast, {[`${city}*${country}*${zip}`]: data.currently}],
              hourlyForecast: [...this.state.hourlyForecast, {[`${city}*${country}*${zip}`]: data.hourly.data.slice(1,25)}],
              dailyForecast: [...this.state.dailyForecast, {[`${city}*${country}*${zip}`]: data.daily.data}],
            });
          } else if(this.state.currentForecast.filter(elem => elem[`${city}*${country}*${zip}`]).length >= 1) {

            const forecastIndex = this.state.currentForecast.findIndex(cast => cast[`${city}*${country}*${zip}`]) 
            this.setState({
              currentForecast: [...this.state.currentForecast.slice(0,forecastIndex),
                {...this.state.currentForecast[forecastIndex], [`${city}*${country}*${zip}`]: data.currently},
                ...this.state.currentForecast.slice(forecastIndex+1)],
              hourlyForecast: [...this.state.hourlyForecast.slice(0,forecastIndex),
                {...this.state.hourlyForecast[forecastIndex], [`${city}*${country}*${zip}`]: data.hourly.data.slice(1,25)},
                ...this.state.hourlyForecast.slice(forecastIndex+1)],
              dailyForecast: [...this.state.dailyForecast.slice(0,forecastIndex),
                {...this.state.dailyForecast[forecastIndex], [`${city}*${country}*${zip}`]: data.daily.data},
                ...this.state.dailyForecast.slice(forecastIndex+1)]
            });
          }

      })
    }

    tempConverter = () => {
      this.setState({tempInCelsius:!this.state.tempInCelsius})
    }

    addCityButtonHandler = () => {
      this.setState({
        addCityClicked: true,
        cityInputDrawerOpen: true
      });
    }

    async updateLoadedState (city, country, zip='99999') {
      let cities = this.state.cities;
      for(let i = 0; i<cities.length;i++) {
        city = cities[i].split('*')[0];
        country = cities[i].split('*')[1];
        zip = this.state.zip[i];
        await this.testData(country, city, zip?zip:'99999');
        await this.darkSkyData(city,
          country,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lat,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lon,
          zip);
        // await this.airData(this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lat,
        // this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lon,
        // `${city}*${country}*${zip}`); 
        // console.log('loading air data *****************')
        // if(this.state.currentCity === `${city}*${country}*${zip}`) {
        //   if(this.state.airData.length !== 0){
        //     this.state.airData.forEach((dataPoint, index) => {
        //       let concentrationValue = undefined;
        //       let aqiHigh = undefined;
        //       let aqiLow = undefined;
        //       let breakPointHigh = undefined;
        //       let breakPointLow = undefined;
        //       console.log(dataPoint);
        //       if(dataPoint.length>=1){
        //         switch(dataPoint[0]['parameter']) {
        //           case 'pm25':
        //             concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //               return total + valueObject.value;
        //             },0)/24;

        //             aqiHigh = concentrationValue<=12?50:
        //             concentrationValue>12&&concentrationValue<=35.4?100:
        //             concentrationValue>35.4&&concentrationValue<=55.4?150:
        //             concentrationValue>55.4&&concentrationValue<=150.4?200:
        //             concentrationValue>150.4&&concentrationValue<=250.4?300:
        //             concentrationValue>250.4&&concentrationValue<=350.4?400:
        //             concentrationValue>350.4&&concentrationValue<=500.4?500:
        //             999;

        //             aqiLow = concentrationValue<=12?0:
        //             concentrationValue>12&&concentrationValue<=35.4?51:
        //             concentrationValue>35.4&&concentrationValue<=55.4?101:
        //             concentrationValue>55.4&&concentrationValue<=150.4?151:
        //             concentrationValue>150.4&&concentrationValue<=250.4?201:
        //             concentrationValue>250.4&&concentrationValue<=350.4?301:
        //             concentrationValue>350.4&&concentrationValue<=500.4?401:
        //             501;
                    
        //             breakPointHigh = aqiHigh===50?12:
        //             aqiHigh===100?35.4:
        //             aqiHigh===150?55.4:
        //             aqiHigh===200?150.4:
        //             aqiHigh===300?250.4:
        //             aqiHigh===400?350.4:
        //             aqiHigh===500?500.4:
        //             99999.9;

        //             breakPointLow = aqiHigh===50?0:
        //             aqiHigh===100?12:
        //             aqiHigh===150?35.4:
        //             aqiHigh===200?55.4:
        //             aqiHigh===300?150.4:
        //             aqiHigh===400?250.4:
        //             aqiHigh===500?350.4:
        //             500.4;
        //             break;
        //           case 'pm10':
        //             concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //               return total + valueObject.value;
        //             },0)/24;

        //             aqiHigh = concentrationValue<=54?50:
        //             concentrationValue>54&&concentrationValue<=154?100:
        //             concentrationValue>154&&concentrationValue<=254?150:
        //             concentrationValue>254&&concentrationValue<=354?200:
        //             concentrationValue>354&&concentrationValue<=424?300:
        //             concentrationValue>424&&concentrationValue<=504?400:
        //             concentrationValue>504&&concentrationValue<=604?500:
        //             999;

        //             aqiLow = concentrationValue<=54?0:
        //             concentrationValue>54&&concentrationValue<=154?51:
        //             concentrationValue>154&&concentrationValue<=254?101:
        //             concentrationValue>254&&concentrationValue<=354?151:
        //             concentrationValue>354&&concentrationValue<=424?201:
        //             concentrationValue>424&&concentrationValue<=504?301:
        //             concentrationValue>504&&concentrationValue<=604?401:
        //             501;
                    
        //             breakPointHigh = aqiHigh===50?54:
        //             aqiHigh===100?154:
        //             aqiHigh===150?254:
        //             aqiHigh===200?354:
        //             aqiHigh===300?424:
        //             aqiHigh===400?504:
        //             aqiHigh===500?604:
        //             99999.9;
                    
        //             breakPointLow = aqiHigh===50?0:
        //             aqiHigh===100?55:
        //             aqiHigh===150?154:
        //             aqiHigh===200?254:
        //             aqiHigh===300?354:
        //             aqiHigh===400?424:
        //             aqiHigh===500?504:
        //             604;

        //             break;
        //           case 'o3':
        //             concentrationValue = dataPoint.reduce((total,valueObject)=> {
        //               return total + valueObject.value;
        //             },0)*24.45/48/8000;

        //             aqiHigh = concentrationValue<=0.054?50:
        //             concentrationValue>0.054&&concentrationValue<=0.07?100:
        //             concentrationValue>0.07&&concentrationValue<=0.085?150:
        //             concentrationValue>0.085&&concentrationValue<=0.105?200:
        //             300;

        //             aqiLow = concentrationValue<=0.054?0:
        //             concentrationValue>0.054&&concentrationValue<=0.07?51:
        //             concentrationValue>0.07&&concentrationValue<=0.085?101:
        //             concentrationValue>0.085&&concentrationValue<=0.105?151:
        //             201;
                    
        //             breakPointHigh = aqiHigh===50?0.054:
        //             aqiHigh===100?0.07:
        //             aqiHigh===150?0.085:
        //             aqiHigh===200?0.105:
        //             0.2;
                    
        //             breakPointLow = aqiHigh===50?0:
        //             aqiHigh===100?0.054:
        //             aqiHigh===150?0.07:
        //             aqiHigh===200?0.085:
        //             0.105;

        //             break;
        //           case 'co':
        //             concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //               return total + valueObject.value;
        //             },0)*24.45/28.01/8000;

        //             aqiHigh = concentrationValue<=4.4?50:
        //             concentrationValue>4.4&&concentrationValue<=9.4?100:
        //             concentrationValue>9.4&&concentrationValue<=12.4?150:
        //             concentrationValue>12.4&&concentrationValue<=15.4?200:
        //             concentrationValue>15.4&&concentrationValue<=30.4?300:
        //             concentrationValue>30.4&&concentrationValue<=40.4?400:
        //             concentrationValue>40.4&&concentrationValue<=50.4?500:
        //             999;

        //             aqiLow = concentrationValue<=4.4?0:
        //             concentrationValue>4.4&&concentrationValue<=9.4?51:
        //             concentrationValue>9.4&&concentrationValue<=12.4?101:
        //             concentrationValue>12.4&&concentrationValue<=15.4?151:
        //             concentrationValue>15.4&&concentrationValue<=30.4?201:
        //             concentrationValue>30.4&&concentrationValue<=40.4?301:
        //             concentrationValue>40.4&&concentrationValue<=50.4?401:
        //             501;
                    
        //             breakPointHigh = aqiHigh===50?4.4:
        //             aqiHigh===100?9.4:
        //             aqiHigh===150?12.4:
        //             aqiHigh===200?15.4:
        //             aqiHigh===300?30.4:
        //             aqiHigh===400?40.4:
        //             aqiHigh===500?50.4:
        //             99999;
                    
        //             breakPointLow = aqiHigh===50?0:
        //             aqiHigh===100?4.4:
        //             aqiHigh===150?9.4:
        //             aqiHigh===200?12.4:
        //             aqiHigh===300?15.4:
        //             aqiHigh===400?30.4:
        //             aqiHigh===500?40.4:
        //             50.4;

        //             break;
        //           case 'so2':
        //             concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //               return total + valueObject.value;
        //             },0)*24.45/64.066/24;

        //             aqiHigh = concentrationValue<=304?-1:
        //             concentrationValue>304&&concentrationValue<=604?300:
        //             concentrationValue>604&&concentrationValue<=804?400:
        //             concentrationValue>804&&concentrationValue<=1004?500:
        //             999;

        //             aqiLow = concentrationValue<=304?-1:
        //             concentrationValue>304&&concentrationValue<=604?201:
        //             concentrationValue>604&&concentrationValue<=804?301:
        //             concentrationValue>804&&concentrationValue<=1004?401:
        //             501;
                    
        //             breakPointHigh = aqiHigh===-1?304:
        //             aqiHigh===300?604:
        //             aqiHigh===400?804:
        //             aqiHigh===500?1004:
        //             99999;
                    
        //             breakPointLow = aqiHigh===-1?0:
        //             aqiHigh===300?304:
        //             aqiHigh===400?604:
        //             aqiHigh===500?804:
        //             1004;

        //             break;
        //           case 'no2':
        //             concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //               return total + valueObject.value;
        //             },0)*24.45/46.0055;

        //             aqiHigh = concentrationValue<=53?50:
        //             concentrationValue>53&&concentrationValue<=100?100:
        //             concentrationValue>100&&concentrationValue<=360?150:
        //             concentrationValue>360&&concentrationValue<=649?200:
        //             concentrationValue>649&&concentrationValue<=1249?300:
        //             concentrationValue>1249&&concentrationValue<=1649?400:
        //             concentrationValue>1649&&concentrationValue<=2049?500:
        //             999;

        //             aqiLow = concentrationValue<=53?0:
        //             concentrationValue>53&&concentrationValue<=100?51:
        //             concentrationValue>100&&concentrationValue<=360?101:
        //             concentrationValue>360&&concentrationValue<=649?151:
        //             concentrationValue>649&&concentrationValue<=1249?201:
        //             concentrationValue>1249&&concentrationValue<=1649?301:
        //             concentrationValue>1649&&concentrationValue<=2049?401:
        //             501;
                    
        //             breakPointHigh = aqiHigh===50?53:
        //             aqiHigh===100?100:
        //             aqiHigh===150?360:
        //             aqiHigh===200?649:
        //             aqiHigh===300?1249:
        //             aqiHigh===400?1649:
        //             aqiHigh===500?2049:
        //             99999;
                    
        //             breakPointLow = aqiHigh===50?0:
        //             aqiHigh===100?54:
        //             aqiHigh===150?100:
        //             aqiHigh===200?360:
        //             aqiHigh===300?649:
        //             aqiHigh===400?1249:
        //             aqiHigh===500?1649:
        //             2049;

        //             break;
        //           default:
        //             console.log(dataPoint);
        //         }
        //       }
        //       const aqi = ((aqiHigh-aqiLow)/(breakPointHigh-breakPointLow))*(concentrationValue-breakPointLow)+aqiLow;
        //       this.setState({
        //         aqi: [...this.state.aqi, aqi]
        //       })
        //       if(index === this.state.airData.length-1 && this.state.aqiArray.filter(aqi => aqi[`${city}*${country}*${zip}`]).length>=1){
        //         const aqiIndex = this.state.aqiArray.findIndex(aqi => typeof(aqi[`${city}*${country}*${zip}`]) === 'number');
        //         this.setState({
        //           aqiArray: [...this.state.aqiArray.slice(0,aqiIndex),
        //             {...this.state.aqiArray[aqiIndex], [`${city}*${country}*${zip}`]: Math.round(this.state.aqi.reduce((a, b) => {
        //               return Math.max(a,b);
        //             }, 0))}, ...this.state.aqiArray.slice(aqiIndex+1)],
        //           airData: [],
        //           aqi: []
        //         })
        //       };
        //       if(index === this.state.airData.length-1 && this.state.aqiArray.filter(aqi => aqi[`${city}*${country}*${zip}`]).length===0){
        //         this.setState({
        //           aqiArray: [...this.state.aqiArray, {[this.state.currentCity]: Math.round(this.state.aqi.reduce((a, b) => {
        //             return Math.max(a,b);
        //           }, 0))}],
        //           airData: [],
        //           aqi: []
        //         })
        //       };
        //       console.log(`${dataPoint[0]['parameter']} value: `, aqi);
        //     })
        // } 
      // } else {
      //   console.log('try another city');
      // }
    }
  }
    async addCityHandler (city, country, zip='99999', e) {
      e.persist();
      const cities = this.state.cities;
      const countryCode = this.state.countryCode;
      const fahrenheit = this.state.fahrenheit;
      if(cities.filter(item => item === city).length === 0 || countryCode.filter(item => item === country).length === 0){
        await this.testData(country, city, zip);
      }
      if((cities.filter(item => item === city).length===0 ||
      countryCode.filter(item => item === country).length === 0) && 
      (fahrenheit?fahrenheit.filter(item => typeof(item[`${city}*${country}*${zip}`]) === 'number').length !== 0:null ||
      this.state.currentCity === `${city}*${country}*${zip}`)) {
        this.setState({
          cities: [...this.state.cities, `${city}*${country}*${zip}`],
          countryCode: [...this.state.countryCode, country],
          zip: [...this.state.zip, zip],
          matchedCities: []
          });
        await this.darkSkyData(city,
          country,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lat,
          this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lon,
          zip);
        // this.setState({
        //   loadingAirData: true
        // });
        // await this.airData(this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lat,
        // this.state.coordinates.filter(coords => coords.city === `${city}*${country}*${zip}`)[0].lon,
        // `${city}*${country}*${zip}`); 
        // if(this.state.airData.length !== 0){
        //   this.state.airData.forEach((dataPoint, index) => {
        //     let concentrationValue = undefined;
        //     let aqiHigh = undefined;
        //     let aqiLow = undefined;
        //     let breakPointHigh = undefined;
        //     let breakPointLow = undefined;
        //     console.log(dataPoint);
        //     if(dataPoint.length>=1){
        //       switch(dataPoint[0]['parameter']) {
        //         case 'pm25':
        //           concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //             return total + valueObject.value;
        //           },0)/24;

        //           aqiHigh = concentrationValue<=12?50:
        //           concentrationValue>12&&concentrationValue<=35.4?100:
        //           concentrationValue>35.4&&concentrationValue<=55.4?150:
        //           concentrationValue>55.4&&concentrationValue<=150.4?200:
        //           concentrationValue>150.4&&concentrationValue<=250.4?300:
        //           concentrationValue>250.4&&concentrationValue<=350.4?400:
        //           concentrationValue>350.4&&concentrationValue<=500.4?500:
        //           999;

        //           aqiLow = concentrationValue<=12?0:
        //           concentrationValue>12&&concentrationValue<=35.4?51:
        //           concentrationValue>35.4&&concentrationValue<=55.4?101:
        //           concentrationValue>55.4&&concentrationValue<=150.4?151:
        //           concentrationValue>150.4&&concentrationValue<=250.4?201:
        //           concentrationValue>250.4&&concentrationValue<=350.4?301:
        //           concentrationValue>350.4&&concentrationValue<=500.4?401:
        //           501;
                  
        //           breakPointHigh = aqiHigh===50?12:
        //           aqiHigh===100?35.4:
        //           aqiHigh===150?55.4:
        //           aqiHigh===200?150.4:
        //           aqiHigh===300?250.4:
        //           aqiHigh===400?350.4:
        //           aqiHigh===500?500.4:
        //           99999.9;

        //           breakPointLow = aqiHigh===50?0:
        //           aqiHigh===100?12:
        //           aqiHigh===150?35.4:
        //           aqiHigh===200?55.4:
        //           aqiHigh===300?150.4:
        //           aqiHigh===400?250.4:
        //           aqiHigh===500?350.4:
        //           500.4;
        //           break;
        //         case 'pm10':
        //           concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //             return total + valueObject.value;
        //           },0)/24;

        //           aqiHigh = concentrationValue<=54?50:
        //           concentrationValue>54&&concentrationValue<=154?100:
        //           concentrationValue>154&&concentrationValue<=254?150:
        //           concentrationValue>254&&concentrationValue<=354?200:
        //           concentrationValue>354&&concentrationValue<=424?300:
        //           concentrationValue>424&&concentrationValue<=504?400:
        //           concentrationValue>504&&concentrationValue<=604?500:
        //           999;

        //           aqiLow = concentrationValue<=54?0:
        //           concentrationValue>54&&concentrationValue<=154?51:
        //           concentrationValue>154&&concentrationValue<=254?101:
        //           concentrationValue>254&&concentrationValue<=354?151:
        //           concentrationValue>354&&concentrationValue<=424?201:
        //           concentrationValue>424&&concentrationValue<=504?301:
        //           concentrationValue>504&&concentrationValue<=604?401:
        //           501;
                  
        //           breakPointHigh = aqiHigh===50?54:
        //           aqiHigh===100?154:
        //           aqiHigh===150?254:
        //           aqiHigh===200?354:
        //           aqiHigh===300?424:
        //           aqiHigh===400?504:
        //           aqiHigh===500?604:
        //           99999.9;
                  
        //           breakPointLow = aqiHigh===50?0:
        //           aqiHigh===100?55:
        //           aqiHigh===150?154:
        //           aqiHigh===200?254:
        //           aqiHigh===300?354:
        //           aqiHigh===400?424:
        //           aqiHigh===500?504:
        //           604;

        //           break;
        //         case 'o3':
        //           concentrationValue = dataPoint.reduce((total,valueObject)=> {
        //             return total + valueObject.value;
        //           },0)*24.45/48/8000;

        //           aqiHigh = concentrationValue<=0.054?50:
        //           concentrationValue>0.054&&concentrationValue<=0.07?100:
        //           concentrationValue>0.07&&concentrationValue<=0.085?150:
        //           concentrationValue>0.085&&concentrationValue<=0.105?200:
        //           300;

        //           aqiLow = concentrationValue<=0.054?0:
        //           concentrationValue>0.054&&concentrationValue<=0.07?51:
        //           concentrationValue>0.07&&concentrationValue<=0.085?101:
        //           concentrationValue>0.085&&concentrationValue<=0.105?151:
        //           201;
                  
        //           breakPointHigh = aqiHigh===50?0.054:
        //           aqiHigh===100?0.07:
        //           aqiHigh===150?0.085:
        //           aqiHigh===200?0.105:
        //           0.2;
                  
        //           breakPointLow = aqiHigh===50?0:
        //           aqiHigh===100?0.054:
        //           aqiHigh===150?0.07:
        //           aqiHigh===200?0.085:
        //           0.105;

        //           break;
        //         case 'co':
        //           concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //             return total + valueObject.value;
        //           },0)*24.45/28.01/8000;

        //           aqiHigh = concentrationValue<=4.4?50:
        //           concentrationValue>4.4&&concentrationValue<=9.4?100:
        //           concentrationValue>9.4&&concentrationValue<=12.4?150:
        //           concentrationValue>12.4&&concentrationValue<=15.4?200:
        //           concentrationValue>15.4&&concentrationValue<=30.4?300:
        //           concentrationValue>30.4&&concentrationValue<=40.4?400:
        //           concentrationValue>40.4&&concentrationValue<=50.4?500:
        //           999;

        //           aqiLow = concentrationValue<=4.4?0:
        //           concentrationValue>4.4&&concentrationValue<=9.4?51:
        //           concentrationValue>9.4&&concentrationValue<=12.4?101:
        //           concentrationValue>12.4&&concentrationValue<=15.4?151:
        //           concentrationValue>15.4&&concentrationValue<=30.4?201:
        //           concentrationValue>30.4&&concentrationValue<=40.4?301:
        //           concentrationValue>40.4&&concentrationValue<=50.4?401:
        //           501;
                  
        //           breakPointHigh = aqiHigh===50?4.4:
        //           aqiHigh===100?9.4:
        //           aqiHigh===150?12.4:
        //           aqiHigh===200?15.4:
        //           aqiHigh===300?30.4:
        //           aqiHigh===400?40.4:
        //           aqiHigh===500?50.4:
        //           99999;
                  
        //           breakPointLow = aqiHigh===50?0:
        //           aqiHigh===100?4.4:
        //           aqiHigh===150?9.4:
        //           aqiHigh===200?12.4:
        //           aqiHigh===300?15.4:
        //           aqiHigh===400?30.4:
        //           aqiHigh===500?40.4:
        //           50.4;

        //           break;
        //         case 'so2':
        //           concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //             return total + valueObject.value;
        //           },0)*24.45/64.066/24;

        //           aqiHigh = concentrationValue<=304?-1:
        //           concentrationValue>304&&concentrationValue<=604?300:
        //           concentrationValue>604&&concentrationValue<=804?400:
        //           concentrationValue>804&&concentrationValue<=1004?500:
        //           999;

        //           aqiLow = concentrationValue<=304?-1:
        //           concentrationValue>304&&concentrationValue<=604?201:
        //           concentrationValue>604&&concentrationValue<=804?301:
        //           concentrationValue>804&&concentrationValue<=1004?401:
        //           501;
                  
        //           breakPointHigh = aqiHigh===-1?304:
        //           aqiHigh===300?604:
        //           aqiHigh===400?804:
        //           aqiHigh===500?1004:
        //           99999;
                  
        //           breakPointLow = aqiHigh===-1?0:
        //           aqiHigh===300?304:
        //           aqiHigh===400?604:
        //           aqiHigh===500?804:
        //           1004;

        //           break;
        //         case 'no2':
        //           concentrationValue = dataPoint.reduce((total, valueObject)=> {
        //             return total + valueObject.value;
        //           },0)*24.45/46.0055;

        //           aqiHigh = concentrationValue<=53?50:
        //           concentrationValue>53&&concentrationValue<=100?100:
        //           concentrationValue>100&&concentrationValue<=360?150:
        //           concentrationValue>360&&concentrationValue<=649?200:
        //           concentrationValue>649&&concentrationValue<=1249?300:
        //           concentrationValue>1249&&concentrationValue<=1649?400:
        //           concentrationValue>1649&&concentrationValue<=2049?500:
        //           999;

        //           aqiLow = concentrationValue<=53?0:
        //           concentrationValue>53&&concentrationValue<=100?51:
        //           concentrationValue>100&&concentrationValue<=360?101:
        //           concentrationValue>360&&concentrationValue<=649?151:
        //           concentrationValue>649&&concentrationValue<=1249?201:
        //           concentrationValue>1249&&concentrationValue<=1649?301:
        //           concentrationValue>1649&&concentrationValue<=2049?401:
        //           501;
                  
        //           breakPointHigh = aqiHigh===50?53:
        //           aqiHigh===100?100:
        //           aqiHigh===150?360:
        //           aqiHigh===200?649:
        //           aqiHigh===300?1249:
        //           aqiHigh===400?1649:
        //           aqiHigh===500?2049:
        //           99999;
                  
        //           breakPointLow = aqiHigh===50?0:
        //           aqiHigh===100?54:
        //           aqiHigh===150?100:
        //           aqiHigh===200?360:
        //           aqiHigh===300?649:
        //           aqiHigh===400?1249:
        //           aqiHigh===500?1649:
        //           2049;

        //           break;
            //     default:
            //       console.log(dataPoint);
            //   }
            // }
      //       const aqi = ((aqiHigh-aqiLow)/(breakPointHigh-breakPointLow))*(concentrationValue-breakPointLow)+aqiLow;
      //       this.setState({
      //         aqi: [...this.state.aqi, aqi]
      //       })
      //       if(index === this.state.airData.length-1){
      //         this.setState({
      //           aqiArray: [...this.state.aqiArray, {[this.state.currentCity]: Math.round(this.state.aqi.reduce((a, b) => {
      //             return Math.max(a,b);
      //           }, 0))}],
      //           airData: [],
      //           aqi: []
      //         })
      //       };
      //       console.log(`${dataPoint[0]['parameter']} value: `, aqi);
      //     })
      // } else {
      //     this.setState({
      //       loadingAirData: false
      //     })
      // }
      } else {
        this.setState({cityFailedSearch: true});
      }
      return this.state.cityFailedSearch;
    }

    cityFailedSearchHandler = () => {
      this.setState({cityFailedSearch:false});
    }

    async cityInputHandler (event) {
      this.state.cityInput = event.target.value;
      await this.cityInputAutocomplete(this.state.cityInput);
      if(!event.target.value) {
        this.setState({matchedCities:[]})
      }
    }

    async cityInputAutocomplete (query) {
      await fetch('https://sheltered-citadel-75989.herokuapp.com/autocomplete', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'query': `${query}`
        }
      })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data);
        if(data.suggestions !== undefined){
            this.setState({matchedCities: data.suggestions});
        }
      });
    }

    async cityTileHandler (e) {
      e.persist();
      const citySelection = e.nativeEvent.path.filter(item => item.id !== '' && item.id !== 'container' && item.tagName === 'DIV')[0].id.split('*')[0];
      const countrySelection = e.nativeEvent.path.filter(item => item.id !== '' && item.id !== 'container' && item.tagName === 'DIV')[0].id.split('*')[1];
      const zipSelection = e.nativeEvent.path.filter(item => item.id !== '' && item.id !== 'container' && item.tagName === 'DIV')[0].id.split('*')[2];
      const selection = `${citySelection}*${countrySelection}*${zipSelection}`;
      const selectedCurrentForecast = this.state.currentForecast.filter(forecast => forecast[`${citySelection}*${countrySelection}*${zipSelection}`])[0];
      const selectedHourlyForecast = this.state.hourlyForecast.filter(forecast => forecast[`${citySelection}*${countrySelection}*${zipSelection}`])[0];
      const selectedDailyForecast = this.state.dailyForecast.filter(forecast => forecast[`${citySelection}*${countrySelection}*${zipSelection}`])[0];
      const selectedTimezone = this.state.timezone[this.state.cities.indexOf(`${citySelection}*${countrySelection}*${zipSelection}`)][`${citySelection}*${countrySelection}*${zipSelection}`]*3600*1000;

      this.setState({
        cityTileClicked: true,
        selectedCity: citySelection,
        selectedCountry: countrySelection,
        selectedZip: zipSelection,
        selectedCurrentForecast,
        selectedHourlyForecast,
        selectedDailyForecast,
        selectedTimezone,
        selection
      });
    }

    hamburgerButtonHandler = () => {
      this.setState({
        cityTileClicked: false,
        opacityPercentage:1,
        selection: ''
      })
    }

    sunDirection = (sunDirection) => {
      let zoneHours = parseInt(new Date(this.state[sunDirection][this.state.cities.indexOf(`${this.state.selectedCity}*${this.state.selectedCountry}*${this.state.selectedZip}`)]*1000).getUTCHours())+this.state.timezone[this.state.cities.indexOf(`${this.state.selectedCity}*${this.state.selectedCountry}*${this.state.selectedZip}`)][`${this.state.selectedCity}*${this.state.selectedCountry}*${this.state.selectedZip}`];
      let zoneMinutes = parseInt(new Date(this.state[sunDirection][this.state.cities.indexOf(`${this.state.selectedCity}*${this.state.selectedCountry}*${this.state.selectedZip}`)]*1000).getUTCMinutes())
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

    timezoneHandler = (unixStamp, functionCaller, cityIndex) => {
      let selection = this.state.cities[cityIndex];
      let timezonePeriod = selection === '' ?
      this.state.timezone[cityIndex][this.state.cities[cityIndex]] :
      selection === this.state.cities[cityIndex] ?
      this.state.timezone[this.state.cities.indexOf(selection)][selection]
      : this.state.timezone[cityIndex][this.state.cities[cityIndex]];

      let zoneHours = parseInt(new Date(unixStamp).getUTCHours()) + timezonePeriod;
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
          iconPath = './weatherappc/assets/day.svg';
          break;
        case 'clear-night':
          iconPath = './weatherappc/assets/night.svg';
          break;
        case 'rain':
          iconPath = './weatherappc/assets/rainy-3.svg';
          break;
        case 'snow':
        case 'sleet':
          iconPath = './weatherappc/assets/snowy-1.svg';
          break;
        case 'wind':
          iconPath = './weatherappc/assets/wind.svg';
          break;
        case 'fog':
          iconPath = './weatherappc/assets/haze.svg';
          break;
        case 'cloudy':
        case 'partly-cloudy-day':
          iconPath = './weatherappc/assets/cloudy-day-1.svg';
          break;
        case 'partly-cloudy-night':
          iconPath = './weatherappc/assets/cloudy-night-1.svg';
          break;
        case 'tor nado':
        case 'thunderstorm':
        case 'hail':
          iconPath = './weatherappc/assets/thunder.svg';
          break;
        default:
          iconPath = './weatherappc/assets/cloudy.svg';
      }
      return iconPath;
    }

    async signInHandler (username, password) {
      await fetch('https://sheltered-citadel-75989.herokuapp.com/login', {
        method:'get',
        headers: {
          'Content-Type':'application/json',
          'Accept': 'application/json',
          'username': `${username}`,
          'password': `${password}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if(data.isLoggedIn && data.state === undefined) {
          this.setState({
            isLoggedIn: true,
            id:data.id
          })
        } else if(data.isLoggedIn && data.state !== undefined) {
            this.setState({
              ...data.state,
              isLoggedIn: true,
              id:data.id,
            })
            this.updateLoadedState();
          } 
        else {
          this.setState({signInFailureTooltipOpen:true});
          setTimeout(() => {
            this.setState({signInFailureTooltipOpen:false});
          }, 3000)
        }
      })
    }

  async signUpHandler (username, password) {
    await fetch('https://sheltered-citadel-75989.herokuapp.com/signup', {
      method:'post',
      headers: {
        'Content-Type':'application/json',
        'Accept': 'application/json',
        'username': `${username}`,
        'password': `${password}`
      },
      body: JSON.stringify({username, password, state:initialState})
    })
    .then(response => response.json())
    .then(data => {
      if(data.response) {
        this.setState({signupSuccessTooltipOpen:true});
        setTimeout(() => {
          this.setState({signupSuccessTooltipOpen:false});
        }, 3000);
      }
    })
  }

  async signinUsernameRetriever () {
    let currentUsernameList;
    await fetch('https://sheltered-citadel-75989.herokuapp.com/users', {
      method:'get',
      headers: {
        'Content-Type':'application/json',
        'Accept': 'application/json',
        'authorizedrequest': `true`
      }
    })
    .then(response => response.json())
    .then(data => {
      currentUsernameList = data.map(user => user.username);
    })
    return currentUsernameList;
  }

    async testPoints () {
      if(!this.state.isGuestUser && this.state.isLoggedIn && this.state.cities.length >= 1){
        await fetch(`https://sheltered-citadel-75989.herokuapp.com/users/${this.state.id}`, {
          method:'put',
          headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({state:{...this.state, cityInputDrawerOpen:false, matchedCities:[], opacityPercentage:1, paddingBottomTitle:false, paddingBottomSize:'0vh', cityInput:'' }})
        })
        .then(response => response.json())
      }
      if(!this.state.isGuestUser && this.state.isLoggedIn && this.state.cities.length === 0){
        await fetch(`https://sheltered-citadel-75989.herokuapp.com/users/${this.state.id}`, {
          method:'put',
          headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({state:{...initialState}})
        })
        .then(response => response.json())
      }
    }

    dragTileHandler = (e) => {
      e.persist();
      e.preventDefault();
    }

    sameCityTooltipCloseHandler = () => {
      this.setState({sameCityId:-1, sameCityTooltipOpen:false});
    }

    cityInputDrawerCloseHandler = () => {
      this.setState({cityInputDrawerOpen:false, matchedCities:[], sameCityId:-1, cityInput:''});
    }

    sameCityTooltipOpenHandler = (sameCityIndex) => {
      this.setState({sameCityId:sameCityIndex, sameCityTooltipOpen:true});
    }

    cancelButtonDrawerCloseHandler = () => {
      this.setState({cityInputDrawerOpen:false, matchedCities:[], cityInput:''})
    }

    deleteCityTileHandler = (indexToDelete) => {
      this.setState({
        indexToDelete,
        timezone: this.state.timezone.filter(item => item !== this.state.timezone[indexToDelete]), 
        aqiArray: this.state.aqiArray.filter(item => item !== this.state.aqiArray[indexToDelete]),
        cities: this.state.cities.filter(item => item !== this.state.cities[indexToDelete]),
        coordinates: this.state.coordinates.filter(item => item !== this.state.coordinates[indexToDelete]),
        countryCode: this.state.countryCode.filter(item => item !== this.state.countryCode[indexToDelete]),
        currentForecast: this.state.currentForecast.filter(item => item !== this.state.currentForecast[indexToDelete]),
        dailyForecast: this.state.dailyForecast.filter(item => item !== this.state.dailyForecast[indexToDelete]),
        hourlyForecast: this.state.hourlyForecast.filter(item => item !== this.state.hourlyForecast[indexToDelete]),
        rainfall: this.state.rainfall.filter(item => item !== this.state.rainfall[indexToDelete]),
        sunrise: this.state.sunrise.filter(item => item !== this.state.sunrise[indexToDelete]),
        sunset: this.state.sunset.filter(item => item !== this.state.sunset[indexToDelete]),
        zip: this.state.zip.filter(item => item !== this.state.zip[indexToDelete])
      })
      this.testPoints();
    }

    signoutHandler = () => {
      this.setState({...initialState})
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
          tempInCelsius,
          zip,
          selectedZip,
          cityFailedSearch,
          cityInput,
          signupSuccessTooltipOpen,
          signInFailureTooltipOpen
         } = this.state;

        return (
          <Fragment>
              { !isLoggedIn ?
                <Fragment>
                  <SignIn 
                  signInHandler={this.signInHandler}
                  guestUserLoginHandler={this.guestUserLoginHandler}
                  updateLoadedState={this.updateLoadedState}
                  signinUsernameRetriever={this.signinUsernameRetriever}
                  signUpHandler={this.signUpHandler}
                  signupSuccessTooltipOpen={signupSuccessTooltipOpen}
                  isLoggedIn={isLoggedIn}
                  signInFailureTooltipOpen={signInFailureTooltipOpen}
                  />
                </Fragment>
              :
              // cities.length >= 1 && !cityTileClicked && currentForecast === undefined && isLoggedIn?
              false ?
                  <div>
                    <p>Loading...</p>
                  </div>
                  : 
                  // !cityTileClicked && isLoggedIn ?
                  <Fragment>
                    <CityTiles 
                      cities={cities}
                      currentForecast={currentForecast}
                      countryCode={countryCode}
                      cityTileHandler={this.cityTileHandler}
                      timezoneHandler={this.timezoneHandler}
                      tempInCelsius={tempInCelsius}
                      deleteCityTileHandler={this.deleteCityTileHandler}
                    />
                    <Modal BackdropProps={{transitionduration:0}} open={cityTileClicked} disablePortal={true} onLoad={this.targetScrollElement.current ? this.targetScrollElement.current.addEventListener('scroll', this.listenScrollEvent): null}>
                      <div ref={this.targetScrollElement} className={currentForecast.length === cities.length && selection !== '' ?
                        `${currentForecast.filter(cast => cast[selection])[0][selection]['icon']}`:
                         'cloudy'} style={{height:'100%', backgroundAttachment:'fixed', overflowY:'scroll'}}>
                        <div id='stickyDiv' style={{background:'inherit', minHeight:'10vh', position:'sticky', top:0, padding:'5vh 0 15vh 0', display:'grid', textAlign:'center', margin:0, zIndex:5}}>
                          <p style={{zIndex:5, display:'grid', justifyContent:'center', fontSize:'min(8vw, 40px)', whiteSpace:'nowrap', margin:0}}>
                            {selectedCity}
                            <span style={{zIndex:5, display:'grid', justifyContent:'center', fontSize:'min(4vw, 20px)', textAlign:'center', whiteSpace:'nowrap', margin:0}}>{selection !== '' ? selectedCurrentForecast[selection]['summary'] : null}</span>
                          </p>
                        </div>
                        <p className='removeTemp' style={{zIndex:5, position:'absolute', margin:'-15vh 0 0 0', left:'50%', transform:'translateX(-50%)', fontSize:'12vh', opacity:`${opacityPercentage}`}}>
                          {
                          !tempInCelsius && selection !== '' ? 
                            Math.round(selectedCurrentForecast[selection]['temperature'])
                          : selection !== '' ? 
                          Math.round((selectedCurrentForecast[selection]['temperature']-32)*(5/9))
                          :
                          null
                          }
                          <span style={{position:'absolute', fontSize:'6vh', display:'inline', verticalAlign:'top', margin:0}}>°</span>
                        </p>
                        <div style={{marginTop:'-15vh', background:'inherit'}}>
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
                        cities={cities}
                      />
                    }
                    {
                      <DailyForecast 
                        selectedDailyForecast={selectedDailyForecast}
                        selection={selection}
                        iconSelector={this.iconSelector}
                        dayOfTheWeekHandler={this.dayOfTheWeekHandler}
                        selectedTimezone={selectedTimezone}
                        tempInCelsius={tempInCelsius}

                      />
                    }
                {     
                  <DetailedWeatherInformation 
                    selectedDailyForecast={selectedDailyForecast}
                    selection={selection}
                    tempInCelsius={tempInCelsius}
                    selectedCurrentForecast={selectedCurrentForecast}
                    sunDirection={this.sunDirection}
                    dailyForecast={dailyForecast}
                    cities={cities}
                    windDirectionHandler={this.windDirectionHandler}
                    rainfall={rainfall}
                    selectedCity={selectedCity}
                    selectedCountry={selectedCountry}
                    selectedZip={selectedZip}
                    aqiArray={aqiArray}
                    aqiText={this.aqiText}
                  />
                }
                </div>
                    <div style={{position:'relative', bottom:0}}>
                      <hr />
                      <div style={{display:'grid', gridTemplateColumns: '1fr'}}>
                          <IconButton onClick={this.hamburgerButtonHandler} style={{color:'white', padding:0, display:'grid', gridColumn:'3/4', justifySelf:'end', marginRight:'2rem', cursor:'pointer'}}>
                            <FormatListBulleted />
                          </IconButton>
                      </div>
                    </div>
                  </div>
                </Modal>
              </Fragment>
               }
               { !cityTileClicked && isLoggedIn?
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr'}}>
                    <div onClick={this.tempConverter} style={{fontFamily:'sans-serif', fontWeight:'600', margin:'0 0 0 2rem', alignSelf:'center', width:'fit-content', cursor:'pointer'}}>
                      <span style={{display:'inline', opacity:tempInCelsius?1:0.5}}>°C</span><span> / </span><span style={{opacity:tempInCelsius?0.5:1}}>°F</span>
                    </div>
                    <Button style={{backgroundColor:'red', color:'white', width:'fit-content', margin:'1rem 0', justifySelf:'center', alignSelf:'center'}} onClick={this.signoutHandler}>Sign Out</Button>
                    <IconButton onClick={this.addCityButtonHandler}style={{display:'grid', justifySelf:'end', margin:'0 2rem 0 0', alignSelf:'center', cursor:'pointer', color:'black', padding:0}}><AddCircleOutline /></IconButton>
                    {/* <button onClick={this.testPoints}>Test Points</button> */}
                  </div>
                :
                null
               }
               <SwipeableDrawer
                disableDiscovery={true}
                disableSwipeToOpen={true}
                open={this.state.cityInputDrawerOpen}
                onOpen={() => this.setState({cityInputDrawerOpen:true})}
                onClose={() => this.setState({cityInputDrawerOpen:false, matchedCities:[], cityInput:''})}
                anchor='bottom'
                id='cityInputDrawer'
               >
                 <CityInputSearchBar 
                  addCityClicked={addCityClicked}
                  isLoggedIn={isLoggedIn}
                  cityInputHandler={this.cityInputHandler}
                  cancelButtonDrawerCloseHandler={this.cancelButtonDrawerCloseHandler}
                 />

                {   
                  <MatchedCities 
                    matchedCities={matchedCities}
                    isLoggedIn={isLoggedIn}
                    sameCityId={sameCityId}
                    sameCityTooltipOpen={sameCityTooltipOpen}
                    cities={cities}
                    addCityHandler={this.addCityHandler}
                    sameCityTooltipCloseHandler={this.sameCityTooltipCloseHandler}
                    cityInputDrawerCloseHandler={this.cityInputDrawerCloseHandler}
                    sameCityTooltipOpenHandler={this.sameCityTooltipOpenHandler}
                    zip={zip}
                    cityFailedSearch={cityFailedSearch}
                    cityFailedSearchHandler={this.cityFailedSearchHandler}
                    cityInput={cityInput}
                  />  
                }
               </SwipeableDrawer>
            
          </Fragment>
        );
    }
}


export default App;


const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<App />, wrapper) : false;