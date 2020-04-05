import React, { Fragment } from 'react';
import { Tooltip } from '@material-ui/core';


const MatchedCities = (props) => {

  return(
    props.matchedCities.length>=1 && props.isLoggedIn?
    <div id='matchedCitiesWrapper' style={{overflowY:'scroll', height:'100%'}}>
      {props.matchedCities.map((city, index) => {
        let locationId = city['locationId'];
        let cityName = city['address']['city'];
        let prevCityName = '';
        if(index > 0){
          prevCityName = props.matchedCities[index-1]['address']['city'];
        }
        let stateName = city['address']['state'];
        let zip = city['address']['postalCode'];
        let countryCode = city['countryCode'];
        return (
          cityName !== prevCityName ?
          <Tooltip open={props.sameCityId === index ? props.sameCityTooltipOpen : false} title='Try another city'
            onOpen={() => null}
            onClose={() => props.sameCityTooltipCloseHandler()}
            key={`${locationId}${index}`}
          > 
            <p style={{color:'black', fontWeight:'none', textShadow:'none', cursor:'pointer', textAlign:'center'}} onClick={async (e) => {
              // console.log(typeof props.zip[0]);
              // console.log(typeof props.matchedCities[index]['address']['postalCode']);
              // console.log(props.zip.filter(zip => parseInt(zip) === parseInt(props.matchedCities[index]['address']['postalCode'])))
              // document.getElementById('matchedCitiesWrapper').scrollTop = 0;
              let cityFailed = false;
              if(props.cities.filter(item => item === `${cityName}*${countryCode}*${zip}`).length === 0 ||
                 props.zip.filter(zip => parseInt(zip) === parseInt(props.matchedCities[index]['address']['postalCode'])).length === 0){
                  props.addCityHandler(cityName, countryCode, zip, e);
                  props.cityInputDrawerCloseHandler();
              } else if(props.cities.filter(item => item === `${cityName}*${countryCode}*${zip}`).length >= 1){
                  props.sameCityTooltipOpenHandler(index);
                  props.cityFailedSearchHandler();
              } 
            }}>
              {cityName?cityName:null}, {stateName?stateName:null} {countryCode?countryCode:null}
            </p>
          </Tooltip>
          :
          null
      )})
    }
    </div>
    :
    props.matchedCities.length === 0  && props.cityInput !== '' ?
    <p style={{color:'black', textShadow:'none', textAlign:'center'}}>No results found</p>
    :
    null
  );
}

export default MatchedCities;