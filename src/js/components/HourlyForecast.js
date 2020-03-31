import React, { Fragment } from 'react';

const HourlyForecast = (props) => {
  document.getElementById('noScrollDiv') ? document.getElementById('noScrollDiv').focus() : null;

  return(
    <Fragment>
      <div style={{background:'inherit', position:'sticky', top:'24vh', margin:'25vh 0 0 0', zIndex:5}}>
        <div className='removeCurrent' style={{width:'100%', position:'absolute', display:'grid',gridTemplateColumns:'1fr 1fr 1fr', opacity:`${props.opacityPercentage}`}}>
          <p style={{gridColumn:'1/2', gridRow:'1/2', justifySelf:'start', transform:'translateY(-200%)', textAlign:'bottom', display:'grid', marginLeft:'2rem', whiteSpace:'nowrap', fontSize:'min(6vw, 30px)'}}>
            {`${props.dayOfTheWeekHandler(new Date(props.selectedDailyForecast[props.selection][0].time*1000+props.selectedTimezone).getUTCDay())}`}
          </p>
          <p style={{display:'grid', transform:'translateY(-200%)', gridColumn:'3', whiteSpace:'nowrap', fontSize:'min(6vw, 30px)', justifySelf:'center', marginRight:'32px'}}>
            {`${!props.tempInCelsius ? Math.round(props.selectedDailyForecast[props.selection][0].temperatureMax) :
              Math.round((props.selectedDailyForecast[props.selection][0].temperatureMax-32)*(5/9))}`}
          </p>
          <p style={{position:'absolute', transform:'translateY(-200%)', right:0, textAlign:'bottom', display:'grid', justifyContent:'end', marginRight:'2rem', whiteSpace:'nowrap', fontSize:'min(6vw, 30px)'}}>
            {`${!props.tempInCelsius ? Math.round(props.selectedDailyForecast[props.selection][0].temperatureMin) :
              Math.round((props.selectedDailyForecast[props.selection][0].temperatureMin-32)*(5/9))}`}
          </p>
        </div>
        <div style={{zIndex:5, height:'100%'}}>
          <hr />
          <div tabIndex='0' id='noScrollDiv' style={{height:'100%', display:'grid', overflowY:'scroll', gridTemplateColumns: `repeat(${props.selectedHourlyForecast[props.selection].length+1}, 1fr)`, gridTemplateRows: '1fr'}}>
              <div style={{display:'grid', width:'calc(12.5vw)'}}>
                <p style={{display:'grid', gridRow:'1', fontSize:'min(4vw, 20px)', alignSelf:'center', justifySelf:'center', fontWeight:'bold'}}>{'Now'}</p>
                <img src={`${props.iconSelector(props.selectedCurrentForecast[props.selection]['icon'])}`} style={{display:'grid', gridRow:'2', alignSelf:'center', margin:0, justifySelf:'center'}}/>
                <p style={{display:'grid', gridRow:'3', fontSize:'min(4vw, 20px)', alignSelf:'center', justifySelf:'center', fontWeight:'bold'}}>
                  {`${!props.tempInCelsius ? Math.round(props.selectedCurrentForecast[props.selection].temperature) :
                    Math.round((props.selectedCurrentForecast[props.selection].temperature-32)*(5/9))}°`}
                </p>
              </div>
            {
            props.selectedHourlyForecast[props.selection].map((forecast, index) => {
              let iconSelection = props.iconSelector(forecast['icon']);
              return <div key={`${forecast.time}${index}`} style={{display:'grid', width:'12.5vw'}}>
                <p style={{display:'grid', gridRow:'1', fontSize:'min(4vw, 20px)', justifySelf:'center', whiteSpace:'nowrap'}}>
                  {props.timezoneHandler(forecast.time*1000, 'hourlyForecast', props.cities.indexOf(props.selection))}
                </p>
                <img src={`${iconSelection}`} style={{display:'grid', gridRow:'2', justifySelf:'center'}}/>
                <p style={{display:'grid', gridRow:'3', fontSize:'min(4vw, 20px)', justifySelf:'center'}}>
                  {`${!props.tempInCelsius ? Math.round(forecast.temperature) :
                    Math.round((forecast.temperature-32)*(5/9))}°`}
                </p> 
              </div>
            })
            }
          </div>
          <hr />
        </div>
      </div>
    </Fragment>
  );
}

export default HourlyForecast;