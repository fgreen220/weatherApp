import React, { Fragment } from 'react';

const DailyForecast = (props) => {
  return(
    <div style={{height:'100%', marginTop:'2vh'}}>
      <div style={{height:'100%', display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: `repeat(${props.selectedDailyForecast[props.selection].length-1},1fr)`}}>
        {
        props.selectedDailyForecast[props.selection].map((forecast, index) => {
          if(index !== 0){
            let iconPath = props.iconSelector(forecast['icon'])
            return <Fragment key={`${Math.round(forecast.time*1000)}${index}`}>
              <p style={{fontSize:'min(6vw, 30px)', display:'grid', gridRow:`${index}`, gridColumn:'1', marginLeft:'2rem', alignSelf:'center'}}>{`${props.dayOfTheWeekHandler(new Date(forecast.time*1000+props.selectedTimezone).getUTCDay())}`}</p>
              <p style={{display:'grid', gridRow:`${index}`, justifySelf:'center', alignSelf:'center', textAlign:'center'}}><img src={`${iconPath}`} /></p>
              <p style={{display:'grid', gridRow:`${index}`, gridColumn:'3', justifySelf:'center', alignSelf:'center', margin:'0 2rem 0 0', fontSize:'min(6vw, 30px)'}}>
                {`${!props.tempInCelsius ? Math.round(forecast.temperatureMax) :
                  Math.round((forecast.temperatureMax-32)*(5/9))}`}
              </p>
              <p style={{display:'grid', gridRow:`${index}`, gridColumn:'3', justifySelf:'end', alignSelf:'center', margin:'0 2rem 0 0', fontSize:'min(6vw, 30px)'}}>
                {`${!props.tempInCelsius ? Math.round(forecast.temperatureMin) :
                  Math.round((forecast.temperatureMin-32)*(5/9))}`}
              </p>
            </Fragment> 
          }
        })
        }
    </div>
  </div>
  );
}

export default DailyForecast;