import React from 'react';


const CityTiles = (props) => {
  return(
    props.cities.map((city, index) => {
      // index === props.cities.length - 1 ? () => this.setState({rendered:cities}):null
      return (<div style={{height:'5rem', backgroundSize:'100% 5rem'}} className={props.currentForecast.length === props.cities.length ?
        `${props.currentForecast.filter(cast => cast[city])[0][city]['icon']}1`:
         'cloudy1'} id={`${city}*${props.countryCode[index]}`} onLoad={props.resetLoadingAirData} key={city,index}>
        <div onClick={e => props.cityTileHandler(e)} style={{display:'grid',justifyContent: 'space-between',gridTemplateColumns:'1fr 1fr', color:'white', textShadow:'0.07em 0 black,0 0.07em black,-0.07em 0 black,0 -0.07em black'}}>
          <div>
            <p style={{display:'grid',margin:'1rem 0 0 2rem',gridColumn:'1 / 2',gridRow: '1 / 2',alignSelf:'start',justifySelf:'start'}}>{props.timezoneHandler(props.currentForecast[index][city]['time']*1000, 'tileTime')}</p>
            <h1 style={{display:'grid',margin:'0 0 0 2rem',alignSelf:'start',justifySelf:'start',gridColumn:'1 / 2',gridRow: '1 / 2'}}>{city.split('*')[0]}</h1>
          </div>
        { props.cities.length>=1 && props.currentForecast.filter(item => typeof(item[city])==='object')?
          <h1 style={{justifySelf:'end', marginRight:'2rem'}}>
            {props.currentForecast.length>=props.cities.length && props.currentForecast.length >=1 ?
            `${!props.tempInCelsius ? Math.round(props.currentForecast.filter(fore => typeof(fore[city]) === 'object')[0][city].temperature) :
            Math.round((props.currentForecast.filter(fore => typeof(fore[city]) === 'object')[0][city].temperature-32)*(5/9))}°`
            : null
            }
            </h1>
          :
          null
        }
        </div>
      </div>
      );
    })
  );
}

export default CityTiles;