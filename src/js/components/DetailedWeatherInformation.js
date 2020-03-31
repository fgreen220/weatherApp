import React, { Fragment } from 'react';

const DetailedWeatherInformation = (props) => {
  return(
    <div style={{height:'100%'}}>                    
      <p style={{height:'4vh', lineHeight:'4vh', margin:'0 2rem 2rem 2rem'}}>
        {`Today: ${props.selectedDailyForecast[props.selection][0]['summary']} It's currently ${!props.tempInCelsius ?
        Math.round(props.selectedCurrentForecast[props.selection]['temperature']) : 
        Math.round((props.selectedCurrentForecast[props.selection]['temperature']-32)*(5/9))}°; the high will be ${!props.tempInCelsius ?
        Math.round(props.selectedDailyForecast[props.selection][0]['temperatureMax']) :
        Math.round((props.selectedDailyForecast[props.selection][0]['temperatureMax']-32)*(5/9))}°.`}
      </p>
        <hr style={{marginBottom:0}}/>
        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)', gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>SUNRISE</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{props.sunDirection('sunrise')}</p>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)', gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>SUNSET</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{props.sunDirection('sunset')}</p>
        </div>
        <hr style={{margin:'0 2rem'}}/>

        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>CHANCE OF {props.selectedDailyForecast[props.selection][0].precipType!==undefined?props.selectedDailyForecast[props.selection][0].precipType.toUpperCase():'RAIN'}</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{
            `${Math.round(props.dailyForecast[props.cities.indexOf(`${props.selectedCity}*${props.selectedCountry}*${props.selectedZip}`)][props.selection][0].precipProbability*100)}%`
            }</p>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>HUMIDITY</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{`${Math.round(props.selectedCurrentForecast[props.selection].humidity*100)}%`}</p>
        </div>
        <hr style={{margin:'0 2rem'}}/>

        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>WIND</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{`${props.windDirectionHandler(props.selectedCurrentForecast[props.selection].windBearing)}${Math.round(props.selectedCurrentForecast[props.selection].windSpeed)} mph`}</p>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>FEELS LIKE</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>
              {`${!props.tempInCelsius ? Math.round(props.selectedCurrentForecast[props.selection].apparentTemperature) :
                Math.round((props.selectedCurrentForecast[props.selection].apparentTemperature-32)*(5/9))}°`}
            </p>
        </div>
        <hr style={{margin:'0 2rem'}}/>

        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>PRECIPITATION</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{`${props.rainfall[props.cities.indexOf(`${props.selectedCity}*${props.selectedCountry}*${props.selectedZip}`)]} in`}</p>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>PRESSURE</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{`${Math.round(props.selectedCurrentForecast[props.selection].pressure/33.864)} inHg`}</p>
        </div>
        <hr style={{margin:'0 2rem'}}/>

        <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>VISIBILITY</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{`${Math.round(props.selectedCurrentForecast[props.selection].visibility)} mi`}</p>
            <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>UV INDEX</p>
            <p style={{display:'grid',margin:'0 0 0.5rem 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{props.selectedCurrentForecast[props.selection].uvIndex}</p>
        </div>

        { props.aqiArray.filter(aqi => aqi[props.selection]).length >=1?
            <Fragment>
              <hr style={{margin:'0 2rem'}}/>
              <div style={{lineHeight:'4vh', height:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr'}}>
                  <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'1',alignSelf:'end',paddingLeft:'3px'}}>AIR QUALITY INDEX</p>
                  <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'1',alignSelf:'start'}}>{props.aqiArray.filter(aqi => aqi[props.selection])[0][props.selection]}</p>
                  <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(3vw, 15px)',gridRow:'1', gridColumn:'2',alignSelf:'end',paddingLeft:'3px'}}>AIR QUALITY</p>
                  <p style={{display:'grid',margin:'0 0 0 2rem', fontSize:'min(6vw, 30px)', gridRow:'2', gridColumn:'2',alignSelf:'start'}}>{props.aqiText(props.aqiArray.filter(aqi => aqi[props.selection])[0][props.selection])}</p>
              </div>
            </Fragment>
        :
        null
        }
    </div>
  );
}

export default DetailedWeatherInformation;